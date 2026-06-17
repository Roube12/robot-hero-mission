// 2D Side-Scrolling Adventure Engine for Robot Hero Mission

class Player {
    constructor() {
        this.width = 38;
        this.height = 46;
        this.x = 100;
        this.y = 300;
        this.vx = 0;
        this.vy = 0;
        this.baseSpeed = 4.5;
        this.jumpForce = -12;
        this.grounded = false;
        this.facingRight = true;
        this.health = 100;
        this.maxHealth = 100;
        this.invulnerable = false;
        this.invulnTimer = 0;
        
        // Animation states
        this.animFrame = 0;
        this.particleSystems = [];
    }

    reset(startX = 100, startY = 300) {
        this.x = startX;
        this.y = startY;
        this.vx = 0;
        this.vy = 0;
        this.grounded = false;
        this.health = this.maxHealth;
        this.invulnerable = false;
        this.invulnTimer = 0;
        this.particleSystems = [];
    }

    update(upgrades, isWaterLevel) {
        // Apply upgrades impact
        const speed = upgrades.speed ? this.baseSpeed * 1.4 : this.baseSpeed;
        const gravity = isWaterLevel ? 0.2 : 0.55;
        const terminalVelocity = isWaterLevel ? 4.0 : 12.0;

        // Apply gravity
        this.vy += gravity;
        if (this.vy > terminalVelocity) this.vy = terminalVelocity;

        // Invulnerability flashing timer
        if (this.invulnerable) {
            this.invulnTimer -= 16.67; // approx ms per frame
            if (this.invulnTimer <= 0) {
                this.invulnerable = false;
            }
        }

        // Speed thruster particles
        if (upgrades.speed && Math.abs(this.vx) > 0.5 && this.grounded) {
            if (Math.random() < 0.3) {
                this.particleSystems.push({
                    x: this.facingRight ? this.x - 2 : this.x + this.width + 2,
                    y: this.y + this.height - 12,
                    vx: this.facingRight ? -1.5 - Math.random() : 1.5 + Math.random(),
                    vy: -Math.random() * 0.5,
                    life: 20,
                    maxLife: 20,
                    color: 'rgba(249, 115, 22, 0.7)' // orange fire
                });
            }
        }

        // Heat shield particle ring
        if (upgrades.heatShield && Math.random() < 0.1) {
            this.particleSystems.push({
                x: this.x + this.width / 2 + (Math.random() - 0.5) * 60,
                y: this.y + this.height / 2 + (Math.random() - 0.5) * 60,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                life: 30,
                maxLife: 30,
                color: 'rgba(239, 68, 68, 0.4)' // soft red
            });
        }

        // Update active particles
        for (let i = this.particleSystems.length - 1; i >= 0; i--) {
            const p = this.particleSystems[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            if (p.life <= 0) this.particleSystems.splice(i, 1);
        }

        // Cycle animation frames
        if (Math.abs(this.vx) > 0.1) {
            this.animFrame = (this.animFrame + 0.15) % 4;
        } else {
            this.animFrame = 0;
        }
    }

    damage(amount, soundManager, armorUpgrade) {
        if (this.invulnerable) return;
        
        let damageTaken = amount;
        // Apply waterproof armor reduce in Level 2 slime
        if (armorUpgrade) {
            damageTaken = Math.floor(amount * 0.2); // 80% reduction
            if (damageTaken <= 0) return; // Immune
        }

        this.health -= damageTaken;
        if (this.health < 0) this.health = 0;
        
        this.invulnerable = true;
        this.invulnTimer = 1000; // 1 second invuln
        
        if (soundManager) soundManager.playDamage();
    }

    draw(ctx, upgrades, isWaterLevel, viewportX) {
        ctx.save();
        
        // Draw custom player particles
        this.particleSystems.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x - viewportX, p.y, 3 * (p.life / p.maxLife), 0, Math.PI * 2);
            ctx.fill();
        });

        // Invuln flashing opacity
        if (this.invulnerable && Math.floor(Date.now() / 80) % 2 === 0) {
            ctx.globalAlpha = 0.3;
        }

        const px = this.x - viewportX;
        const py = this.y;
        const right = this.facingRight;

        // Draw Heat Shield bubble
        if (upgrades.heatShield) {
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
            ctx.lineWidth = 2;
            ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
            ctx.beginPath();
            ctx.arc(px + this.width / 2, py + this.height / 2, 32, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fill();
        }

        // Draw Waterproof Armor Outer Seal
        if (upgrades.waterproof) {
            ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(px - 3, py - 3, this.width + 6, this.height + 6, 12);
            ctx.fill();
            ctx.stroke();
        }

        // RENDER ROBOT SPRITE
        // Tracks (wheels)
        ctx.fillStyle = '#334155';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        if (isWaterLevel) {
            // Draw propeller/fins instead of wheels
            ctx.fillStyle = '#64748b';
            const finOffset = Math.sin(Date.now() / 50) * 8;
            ctx.beginPath();
            ctx.moveTo(right ? px : px + this.width, py + this.height - 12);
            ctx.lineTo(right ? px - 12 : px + this.width + 12, py + this.height - 12 + finOffset);
            ctx.lineTo(right ? px - 12 : px + this.width + 12, py + this.height - 4 - finOffset);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        } else {
            // Draw tracked wheels with rotation animation
            const roll = Math.floor(this.animFrame) % 2;
            ctx.beginPath();
            ctx.roundRect(px + 2, py + this.height - 10, this.width - 4, 10, 4);
            ctx.fill();
            ctx.stroke();

            // Wheel cogs inside track
            ctx.fillStyle = '#94a3b8';
            ctx.beginPath();
            ctx.arc(px + 8 + roll * 2, py + this.height - 5, 3, 0, Math.PI * 2);
            ctx.arc(px + this.width - 8 - roll * 2, py + this.height - 5, 3, 0, Math.PI * 2);
            ctx.fill();
        }

        // Robot Chassis / Body
        const bodyColor = upgrades.waterproof ? '#064e3b' : '#334155';
        ctx.fillStyle = bodyColor;
        ctx.strokeStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect(px + 4, py + 14, this.width - 8, 22, 6);
        ctx.fill();
        ctx.stroke();

        // Chest Plate / Battery indicator
        ctx.fillStyle = this.health > 30 ? '#10b981' : '#ef4444';
        ctx.fillRect(px + 12, py + 20, this.width - 24, 4);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(px + 12, py + 26, this.width - 24, 6);

        // Robot Neck
        ctx.fillStyle = '#64748b';
        ctx.fillRect(px + this.width / 2 - 4, py + 10, 8, 5);

        // Robot Head
        ctx.fillStyle = upgrades.waterproof ? '#0f5132' : '#475569';
        ctx.beginPath();
        ctx.roundRect(px + 6, py, this.width - 12, 11, 4);
        ctx.fill();
        ctx.stroke();

        // Eye / Glowing Visor
        let visorColor = '#38bdf8'; // dull blue
        if (upgrades.sonar) visorColor = '#fbbf24'; // yellow sonar
        if (upgrades.surgeon) visorColor = '#a855f7'; // surgical purple
        
        ctx.fillStyle = visorColor;
        ctx.shadowBlur = 6;
        ctx.shadowColor = visorColor;
        if (right) {
            ctx.fillRect(px + 18, py + 3, this.width - 26, 4);
        } else {
            ctx.fillRect(px + 8, py + 3, this.width - 26, 4);
        }
        ctx.shadowBlur = 0; // reset shadow

        // Speed Thruster Attachments
        if (upgrades.speed) {
            ctx.fillStyle = '#1e293b';
            ctx.strokeStyle = '#334155';
            const tx = right ? px - 2 : px + this.width - 4;
            ctx.beginPath();
            ctx.roundRect(tx, py + 18, 6, 12, 2);
            ctx.fill();
            ctx.stroke();
            // Glow nozzle
            ctx.fillStyle = '#f97316';
            ctx.fillRect(right ? px - 4 : px + this.width - 1, py + 21, 2, 6);
        }

        // Sonar Dish Attachment (L4)
        if (upgrades.sonar) {
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(px + this.width / 2, py);
            ctx.lineTo(px + this.width / 2 + (right ? 4 : -4), py - 6);
            ctx.stroke();
            // Dish
            ctx.fillStyle = '#475569';
            ctx.beginPath();
            ctx.arc(px + this.width / 2 + (right ? 4 : -4), py - 8, 5, 0, Math.PI, !right);
            ctx.fill();
            ctx.stroke();
        }

        // Precision Surgical Arm (L5)
        if (upgrades.surgeon) {
            ctx.strokeStyle = '#a855f7';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            if (right) {
                ctx.moveTo(px + this.width - 8, py + 24);
                ctx.lineTo(px + this.width + 10, py + 20);
                ctx.lineTo(px + this.width + 12, py + 24);
            } else {
                ctx.moveTo(px + 8, py + 24);
                ctx.lineTo(px - 10, py + 20);
                ctx.lineTo(px - 12, py + 24);
            }
            ctx.stroke();
            // Claws
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(right ? px + this.width + 12 : px - 12, py + 24, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}

class Level {
    constructor(config) {
        this.id = config.id;
        this.title = config.title;
        this.theme = config.theme; // 'blue', 'green', 'red', 'yellow', 'purple'
        this.width = config.width || 2500;
        this.height = config.height || 580;
        this.startX = config.startX || 100;
        this.startY = config.startY || 400;
        this.platforms = config.platforms || [];
        this.collectibles = config.collectibles || [];
        this.hazards = config.hazards || [];
        this.exit = config.exit || { x: 2400, y: 350, w: 60, h: 80 };
        
        // Active level states
        this.collectedCount = 0;
        this.bonusCollectedCount = 0;
        this.totalRequired = config.totalRequired || 5;
    }
}

class GameEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.player = new Player();
        this.currentLevel = null;
        this.upgrades = {
            speed: false,
            waterproof: false,
            heatShield: false,
            sonar: false,
            surgeon: false
        };
        
        // Game States
        this.gameState = 'menu'; // 'menu', 'level_select', 'playing', 'paused', 'victory'
        this.score = 0;
        this.unlockedLevels = 1;
        this.viewportX = 0;
        
        // Input bindings
        this.keys = {};
        
        // Metrics
        this.levelStartTime = 0;
        
        // Web Audio API hooks
        this.soundManager = null;
        
        // Scanning/interacting visual state
        this.actionTarget = null;
        this.activeFactNode = null;
        
        // Sonar ping radius
        this.sonarPings = [];
    }

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.soundManager = window.sounds;

        this.setupWindowResize();
        this.setupInputListeners();
        this.loadProgress();
        this.resizeCanvas();
        
        // Animation Loop
        const loop = () => {
            this.update();
            this.draw();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    setupWindowResize() {
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = 1024;
        this.canvas.height = 580;
    }

    setupInputListeners() {
        // Keyboard Down
        window.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            this.keys[key] = true;
            if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                if (this.gameState === 'playing') e.preventDefault();
            }

            // Keyboard Pause
            if (e.key === 'Escape') {
                if (this.gameState === 'playing') {
                    this.pauseGame();
                } else if (this.gameState === 'paused') {
                    this.resumeGame();
                }
            }
        });

        // Keyboard Up
        window.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            this.keys[key] = false;
        });

        // Touch Control Triggers
        const hookTouch = (id, keyName) => {
            const el = document.getElementById(id);
            if (!el) return;
            const triggerDown = (e) => {
                e.preventDefault();
                this.keys[keyName] = true;
            };
            const triggerUp = (e) => {
                e.preventDefault();
                this.keys[keyName] = false;
            };
            el.addEventListener('touchstart', triggerDown);
            el.addEventListener('touchend', triggerUp);
            el.addEventListener('mousedown', triggerDown);
            el.addEventListener('mouseup', triggerUp);
            el.addEventListener('mouseleave', triggerUp);
        };

        hookTouch('btn-left', 'arrowleft');
        hookTouch('btn-right', 'arrowright');
        hookTouch('btn-jump', ' ');
        hookTouch('btn-use', 'e');
    }

    loadProgress() {
        const saved = localStorage.getItem('robot_hero_progress');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.score = data.score || 0;
                this.unlockedLevels = data.unlockedLevels || 1;
                this.upgrades = data.upgrades || {
                    speed: false,
                    waterproof: false,
                    heatShield: false,
                    sonar: false,
                    surgeon: false
                };
                this.updateMenuHUD();
            } catch (e) {
                console.error("Failed to load progress", e);
            }
        }
    }

    saveProgress() {
        const data = {
            score: this.score,
            unlockedLevels: this.unlockedLevels,
            upgrades: this.upgrades
        };
        localStorage.setItem('robot_hero_progress', JSON.stringify(data));
        this.updateMenuHUD();
    }

    resetSaveProgress() {
        localStorage.removeItem('robot_hero_progress');
        this.score = 0;
        this.unlockedLevels = 1;
        this.upgrades = {
            speed: false,
            waterproof: false,
            heatShield: false,
            sonar: false,
            surgeon: false
        };
        this.saveProgress();
        this.soundManager.playClick();
    }

    updateMenuHUD() {
        const scoreSpan = document.getElementById('menu-hud-score');
        const countSpan = document.getElementById('menu-hud-levels');
        if (scoreSpan) scoreSpan.textContent = this.score;
        if (countSpan) countSpan.textContent = `${this.unlockedLevels - 1}/5`;

        // Update levels grid dots
        for (let i = 1; i <= 5; i++) {
            const dot = document.getElementById(`dot-l${i}`);
            if (dot) {
                dot.className = 'level-dot';
                if (i < this.unlockedLevels) {
                    dot.classList.add('completed');
                    dot.innerHTML = '✓';
                } else if (i === this.unlockedLevels) {
                    dot.classList.add('unlocked');
                    dot.innerHTML = i;
                } else {
                    dot.innerHTML = '🔒';
                }
            }
        }
    }

    selectLevel(levelNum) {
        if (levelNum > this.unlockedLevels) {
            this.soundManager.playWrong();
            return;
        }
        this.soundManager.playClick();
        this.loadLevel(levelNum);
        
        // Hide standard menus
        document.getElementById('menu-screen').classList.add('hidden');
        document.getElementById('level-select-screen').classList.remove('hidden');
        document.getElementById('play-screen').classList.remove('hidden');
        
        this.gameState = 'playing';
        this.soundManager.startBGM();
    }

    loadLevel(levelNum) {
        const config = getLevelConfig(levelNum);
        this.currentLevel = new Level(config);
        
        // Reset player
        this.player.reset(this.currentLevel.startX, this.currentLevel.startY);
        this.viewportX = 0;
        this.levelStartTime = Date.now();
        this.actionTarget = null;
        this.activeFactNode = null;
        this.sonarPings = [];
        
        this.updateGameplayHUD();
    }

    updateGameplayHUD() {
        const scoreEl = document.getElementById('hud-score');
        const levelNameEl = document.getElementById('hud-level-name');
        const objTextEl = document.getElementById('hud-objective-text');
        
        if (scoreEl) scoreEl.textContent = this.score;
        if (levelNameEl) levelNameEl.textContent = this.currentLevel.title;
        
        if (objTextEl) {
            objTextEl.innerHTML = `Facts Read: <strong>${this.currentLevel.collectedCount}/${this.currentLevel.totalRequired}</strong> | Items: <strong>${this.currentLevel.bonusCollectedCount}/5</strong>`;
        }
    }

    pauseGame() {
        if (this.gameState !== 'playing') return;
        this.gameState = 'paused';
        document.getElementById('pause-modal').classList.remove('hidden');
        this.soundManager.playClick();
    }

    resumeGame() {
        this.gameState = 'playing';
        document.getElementById('pause-modal').classList.add('hidden');
        this.soundManager.playClick();
    }

    exitToMenu() {
        this.gameState = 'menu';
        this.soundManager.stopBGM();
        document.getElementById('pause-modal').classList.add('hidden');
        document.getElementById('game-over-modal').classList.add('hidden');
        document.getElementById('play-screen').classList.add('hidden');
        document.getElementById('menu-screen').classList.remove('hidden');
        this.soundManager.playClick();
        this.updateMenuHUD();
    }

    // MAIN UPDATES LOOP
    update() {
        if (this.gameState !== 'playing') return;

        const isWaterLevel = this.currentLevel.id === 4;

        // Player controls
        let moveX = 0;
        if (this.keys['a'] || this.keys['arrowleft']) {
            moveX = -1;
            this.player.facingRight = false;
        }
        if (this.keys['d'] || this.keys['arrowright']) {
            moveX = 1;
            this.player.facingRight = true;
        }

        // Apply horizontal movement
        const currentSpeed = this.upgrades.speed ? this.player.baseSpeed * 1.4 : this.player.baseSpeed;
        this.player.vx = moveX * currentSpeed;

        // Subsea water level floaty controls
        if (isWaterLevel) {
            if (this.keys[' '] || this.keys['w'] || this.keys['arrowup']) {
                if (Math.floor(Date.now() / 150) % 2 === 0) { // Swim limit rate
                    this.player.vy = -3.5;
                    if (Math.random() < 0.15) this.soundManager.playJump();
                }
            }
        } else {
            // Normal platform jump
            if ((this.keys[' '] || this.keys['w'] || this.keys['arrowup']) && this.player.grounded) {
                this.player.vy = this.player.jumpForce;
                this.player.grounded = false;
                this.soundManager.playJump();
            }
        }

        // Apply physics
        this.player.update(this.upgrades, isWaterLevel);

        // Move horizontally and handle platform collision
        this.player.x += this.player.vx;
        this.handleCollisions('horizontal');

        // Move vertically and handle platform collision
        this.player.y += this.player.vy;
        this.handleCollisions('vertical');

        // Clamp to level boundary
        if (this.player.x < 0) this.player.x = 0;
        if (this.player.x > this.currentLevel.width - this.player.width) {
            this.player.x = this.currentLevel.width - this.player.width;
        }

        // Fall in pit check
        if (this.player.y > this.currentLevel.height + 50) {
            this.player.damage(50, this.soundManager);
            this.player.y = 100;
            this.player.x = Math.max(100, this.player.x - 200);
            this.player.vy = 0;
        }

        // Update items / collectibles / hazards
        this.updateLevelObjects();

        // Update scroll camera
        const targetViewportX = this.player.x - this.canvas.width / 2;
        this.viewportX += (targetViewportX - this.viewportX) * 0.1;
        this.viewportX = Math.max(0, Math.min(this.currentLevel.width - this.canvas.width, this.viewportX));

        // Sonar wave animation (L4)
        if (this.upgrades.sonar && isWaterLevel && Math.floor(Date.now() / 2000) % 2 === 0) {
            if (this.sonarPings.length === 0 || this.sonarPings[this.sonarPings.length - 1].life < 10) {
                this.sonarPings.push({
                    x: this.player.x + this.player.width / 2,
                    y: this.player.y + this.player.height / 2,
                    r: 0,
                    life: 60
                });
            }
        }

        this.sonarPings.forEach((p, idx) => {
            p.r += 6;
            p.life--;
            if (p.life <= 0) this.sonarPings.splice(idx, 1);
        });

        // Game Over condition
        if (this.player.health <= 0) {
            this.playerGameOver("Robot structural integrity failed!");
        }
    }

    playerGameOver(reason) {
        this.gameState = 'paused';
        this.soundManager.playDamage();
        const popup = document.getElementById('game-over-modal');
        const text = document.getElementById('game-over-reason');
        if (popup) {
            popup.classList.remove('hidden');
            if (text) text.textContent = reason;
        }
    }

    restartLevel() {
        document.getElementById('game-over-modal').classList.add('hidden');
        this.loadLevel(this.currentLevel.id);
        this.gameState = 'playing';
        this.soundManager.startBGM();
    }

    handleCollisions(direction) {
        this.player.grounded = false;
        
        for (const plat of this.currentLevel.platforms) {
            if (checkAABB(this.player, plat)) {
                if (direction === 'horizontal') {
                    if (this.player.vx > 0) {
                        this.player.x = plat.x - this.player.width;
                    } else if (this.player.vx < 0) {
                        this.player.x = plat.x + plat.w;
                    }
                    this.player.vx = 0;
                } else {
                    if (this.player.vy > 0) {
                        this.player.y = plat.y - this.player.height;
                        this.player.vy = 0;
                        this.player.grounded = true;
                        
                        // Apply conveyor force
                        if (plat.isConveyor) {
                            this.player.x += plat.conveyorSpeed;
                        }
                    } else if (this.player.vy < 0) {
                        this.player.y = plat.y + plat.h;
                        this.player.vy = 0;
                    }
                }
            }
        }
    }

    updateLevelObjects() {
        // 1. Hazards
        for (const haz of this.currentLevel.hazards) {
            // Update animated hazards
            if (haz.type === 'box') {
                haz.y += haz.vy;
                if (haz.y > haz.maxY) haz.y = haz.spawnY;
            } else if (haz.type === 'rat') {
                haz.x += haz.vx;
                if (haz.x < haz.minX || haz.x > haz.maxX) haz.vx *= -1;
            } else if (haz.type === 'spark') {
                haz.timer += 16.67;
                if (haz.timer > 1500) {
                    haz.active = !haz.active;
                    haz.timer = 0;
                }
            } else if (haz.type === 'steam') {
                haz.timer += 16.67;
                if (haz.timer > 2000) {
                    haz.active = !haz.active;
                    haz.timer = 0;
                }
            } else if (haz.type === 'creature') {
                haz.y += haz.vy;
                if (haz.y < haz.minY || haz.y > haz.maxY) haz.vy *= -1;
            }

            // Check collision with player
            if (checkAABB(this.player, haz)) {
                if (haz.type === 'spark' && !haz.active) continue;
                if (haz.type === 'steam' && !haz.active) continue;

                if (haz.type === 'lava') {
                    this.player.damage(25, this.soundManager, this.upgrades.heatShield);
                } else if (haz.type === 'slime') {
                    this.player.damage(15, this.soundManager, this.upgrades.waterproof);
                } else {
                    this.player.damage(20, this.soundManager);
                }
            }
        }

        // 2. Bonus collectibles check
        for (let i = this.currentLevel.collectibles.length - 1; i >= 0; i--) {
            const item = this.currentLevel.collectibles[i];
            if (item.type === 'bonus_item' && !item.collected) {
                if (checkAABB(this.player, item)) {
                    item.collected = true;
                    this.currentLevel.collectibles.splice(i, 1);
                    this.currentLevel.bonusCollectedCount++;
                    this.score += 100;
                    this.soundManager.playCollect();
                    
                    // Spawn particles at item location
                    for (let p = 0; p < 8; p++) {
                        this.player.particleSystems.push({
                            x: item.x + item.w / 2,
                            y: item.y + item.h / 2,
                            vx: (Math.random() - 0.5) * 4,
                            vy: (Math.random() - 0.5) * 4,
                            life: 15,
                            maxLife: 15,
                            color: 'rgba(251, 191, 36, 0.8)' // yellow sparkle
                        });
                    }
                    
                    this.updateGameplayHUD();
                }
            }
        }

        // 3. Fact interactive checks
        let nearInteractive = false;
        let nearestFact = null;

        for (const collect of this.currentLevel.collectibles) {
            if (collect.type === 'fact_node' && !collect.read) {
                if (checkDistance(this.player, collect, 60)) {
                    nearInteractive = true;
                    nearestFact = collect;
                    break;
                }
            }
        }

        if (nearInteractive) {
            this.actionTarget = nearestFact;
            let promptMsg = `Press [E] or tap [ACTION] to read Fact ${nearestFact.factIndex + 1}`;
            document.getElementById('hud-action-prompt').classList.remove('hidden');
            document.getElementById('hud-action-text').textContent = promptMsg;
            
            // Check interaction key press
            if (this.keys['e'] || this.keys['action']) {
                this.activeFactNode = nearestFact;
                this.gameState = 'paused';
                
                const titleEl = document.getElementById('fact-modal-title');
                const textEl = document.getElementById('fact-modal-text');
                if (titleEl && textEl) {
                    titleEl.textContent = `${this.currentLevel.title} - Fact ${nearestFact.factIndex + 1} of 5`;
                    textEl.textContent = nearestFact.factText;
                }
                document.getElementById('fact-modal').classList.remove('hidden');
                
                this.keys['e'] = false;
                this.keys['action'] = false;
            }
        } else {
            this.actionTarget = null;
            document.getElementById('hud-action-prompt').classList.add('hidden');
        }

        // 4. Exit Zone
        if (checkAABB(this.player, this.currentLevel.exit)) {
            if (this.currentLevel.collectedCount >= this.currentLevel.totalRequired) {
                this.triggerLevelVictory();
            } else {
                document.getElementById('hud-tutorial-bubble').classList.remove('hidden');
                document.getElementById('hud-tutorial-text').textContent = "Read all 5 educational facts before exiting this sector!";
            }
        } else {
            document.getElementById('hud-tutorial-bubble').classList.add('hidden');
        }
    }

    triggerLevelVictory() {
        this.gameState = 'paused';
        this.soundManager.stopBGM();
        this.soundManager.playVictoryFanfare();
        
        // Open Quiz Modal
        window.quizEngine.startQuiz(this.currentLevel.id, (totalQuizPoints, correctCount) => {
            this.handleQuizResults(totalQuizPoints, correctCount);
        });
    }

    handleQuizResults(quizPoints, correctCount) {
        const timeTaken = Math.floor((Date.now() - this.levelStartTime) / 1000);
        const speedBonus = Math.max(0, 300 - timeTaken);
        const bonusItemsGained = this.currentLevel.bonusCollectedCount * 50; // extra points at exit for items
        
        this.score += quizPoints + speedBonus + bonusItemsGained + 200; // 200 base level complete

        // Unlock upgrades based on level complete
        let unlockedUpgrade = '';
        if (this.currentLevel.id === 1) { this.upgrades.speed = true; unlockedUpgrade = 'Speed Boost'; }
        else if (this.currentLevel.id === 2) { this.upgrades.waterproof = true; unlockedUpgrade = 'Waterproof Armor'; }
        else if (this.currentLevel.id === 3) { this.upgrades.heatShield = true; unlockedUpgrade = 'Heat Shield'; }
        else if (this.currentLevel.id === 4) { this.upgrades.sonar = true; unlockedUpgrade = 'Sonar Scanner'; }
        else if (this.currentLevel.id === 5) { this.upgrades.surgeon = true; unlockedUpgrade = 'Master Surgeon Module'; }

        // Advance progress
        if (this.currentLevel.id === this.unlockedLevels) {
            this.unlockedLevels = Math.min(6, this.unlockedLevels + 1);
        }

        this.saveProgress();

        // Check if full game beat
        if (this.currentLevel.id === 5 && this.unlockedLevels >= 6) {
            this.showGameVictory(quizPoints, speedBonus);
        } else {
            this.showUpgradeModal(unlockedUpgrade, quizPoints, speedBonus);
        }
    }

    showUpgradeModal(upgradeName, quizPoints, speedBonus) {
        const modal = document.getElementById('level-complete-modal');
        const content = document.getElementById('complete-modal-content');
        if (!modal || !content) return;

        const itemsPoints = this.currentLevel.bonusCollectedCount * 50;

        content.innerHTML = `
            <h2>Sector ${this.currentLevel.id} Cleared!</h2>
            <div style="font-size: 3rem; margin: 15px 0;">🏆</div>
            <p style="margin-bottom: 15px; font-weight: 600;">You successfully completed the ${this.currentLevel.title}!</p>
            
            <div style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 14px; text-align: left; margin-bottom: 20px;">
                <div style="display:flex; justify-content:space-between; margin-bottom: 6px;">
                    <span>Base Clearance Reward:</span>
                    <strong>+200 pts</strong>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom: 6px;">
                    <span>Time Bonus:</span>
                    <strong>+${speedBonus} pts</strong>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom: 6px;">
                    <span>Bonus Items Collected (${this.currentLevel.bonusCollectedCount}/5):</span>
                    <strong>+${itemsPoints} pts</strong>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom: 6px;">
                    <span>Quiz Earnings:</span>
                    <strong>+${quizPoints} pts</strong>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:1.1rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top:6px; margin-top:6px;">
                    <span>Total Score:</span>
                    <strong style="color:var(--color-warning);">${this.score} pts</strong>
                </div>
            </div>

            <div style="border: 1px solid rgba(16, 185, 129, 0.4); background: rgba(16, 185, 129, 0.08); padding: 14px; border-radius: 12px; margin-bottom: 24px;">
                <h4 style="color:var(--color-success); text-transform:uppercase; margin-bottom:4px;">New Upgrade Acquired!</h4>
                <p style="font-weight: 800; font-size: 1.1rem; color:#fff;">⚙️ ${upgradeName}</p>
                <p style="font-size: 0.8rem; color:#cbd5e1; margin-top: 4px;">This upgrade is now visually equipped and active for your robot hero.</p>
            </div>

            <button class="primary-btn" onclick="gameEngine.returnToLevelSelect()">Continue to Command</button>
        `;

        modal.classList.remove('hidden');
    }

    returnToLevelSelect() {
        document.getElementById('level-complete-modal').classList.add('hidden');
        document.getElementById('play-screen').classList.add('hidden');
        document.getElementById('level-select-screen').classList.remove('hidden');
        this.gameState = 'level_select';
        this.soundManager.playClick();
        
        // Refresh level lock overlay cards
        for (let i = 1; i <= 5; i++) {
            const card = document.getElementById(`card-l${i}`);
            if (card) {
                if (i <= this.unlockedLevels) {
                    card.classList.remove('locked');
                } else {
                    card.classList.add('locked');
                }
            }
        }
    }

    showGameVictory(quizPoints, speedBonus) {
        document.getElementById('play-screen').classList.add('hidden');
        document.getElementById('victory-screen').classList.remove('hidden');
        this.gameState = 'victory';

        const scoreVal = document.getElementById('victory-final-score');
        const upgradesVal = document.getElementById('victory-unlocked-upgrades');
        
        if (scoreVal) scoreVal.textContent = `${this.score} PTS`;
        if (upgradesVal) upgradesVal.textContent = "Speed Boost, Waterproof Armor, Heat Shield, Sonar Scanner, Master Surgeon Module";
    }

    // DRAW RENDERS LOOP
    draw() {
        if (this.gameState !== 'playing') return;

        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const isWaterLevel = this.currentLevel.id === 4;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw Environment Backdrop Gradients
        let bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        if (this.currentLevel.id === 1) {
            bgGrad.addColorStop(0, '#0f172a');
            bgGrad.addColorStop(1, '#1e293b');
        } else if (this.currentLevel.id === 2) {
            bgGrad.addColorStop(0, '#062f21');
            bgGrad.addColorStop(1, '#051b14');
        } else if (this.currentLevel.id === 3) {
            bgGrad.addColorStop(0, '#450a0a');
            bgGrad.addColorStop(1, '#180202');
        } else if (this.currentLevel.id === 4) {
            bgGrad.addColorStop(0, '#0c4a6e');
            bgGrad.addColorStop(1, '#082f49');
        } else {
            bgGrad.addColorStop(0, '#1e1b4b');
            bgGrad.addColorStop(1, '#090520');
        }
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Ambient particles / bubbles
        if (isWaterLevel) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            for (let i = 0; i < 15; i++) {
                const bubbleX = (Math.sin(Date.now() / 1000 + i * 200) * 100 + i * 80) % width;
                const bubbleY = (Date.now() / 40 + i * 50) % height;
                ctx.beginPath();
                ctx.arc(bubbleX, height - bubbleY, 2 + (i % 3), 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (this.currentLevel.id === 3) {
            ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
            for (let i = 0; i < 12; i++) {
                const ashX = (Math.sin(Date.now() / 600 + i * 150) * 80 + i * 90) % width;
                const ashY = (Date.now() / 30 + i * 60) % height;
                ctx.beginPath();
                ctx.arc(ashX, height - ashY, 1.5 + (i % 2), 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Draw exit door zone
        ctx.save();
        const ex = this.currentLevel.exit;
        let doorColor = '#10b981';
        
        if (this.currentLevel.collectedCount < this.currentLevel.totalRequired) {
            doorColor = '#ef4444';
        }

        ctx.shadowBlur = 15;
        ctx.shadowColor = doorColor;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = doorColor;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(ex.x - this.viewportX, ex.y, ex.w, ex.h, [8, 8, 0, 0]);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("EXIT MISSION", ex.x - this.viewportX + ex.w / 2, ex.y - 10);

        // Draw Platforms
        this.currentLevel.platforms.forEach(plat => {
            ctx.save();
            const px = plat.x - this.viewportX;

            if (plat.isConveyor) {
                ctx.fillStyle = '#334155';
                ctx.fillRect(px, plat.y, plat.w, plat.h);
                ctx.strokeStyle = '#64748b';
                ctx.lineWidth = 2.5;
                const offset = (Date.now() / 15) % 24;
                ctx.beginPath();
                for (let tx = 0; tx < plat.w; tx += 24) {
                    const arrowX = px + tx + (plat.conveyorSpeed > 0 ? offset : -offset);
                    if (arrowX > px && arrowX < px + plat.w - 10) {
                        ctx.moveTo(arrowX, plat.y + 4);
                        ctx.lineTo(arrowX + 6, plat.y + 7);
                        ctx.lineTo(arrowX, plat.y + 10);
                    }
                }
                ctx.stroke();
            } else {
                let tileColor = '#475569';
                let rimColor = '#334155';
                if (this.currentLevel.id === 2) { tileColor = '#064e3b'; rimColor = '#0f172a'; }
                if (this.currentLevel.id === 3) { tileColor = '#450a0a'; rimColor = '#ef4444'; }
                if (this.currentLevel.id === 4) { tileColor = '#075985'; rimColor = '#0284c7'; }
                if (this.currentLevel.id === 5) { tileColor = '#3b0764'; rimColor = '#a855f7'; }

                ctx.fillStyle = tileColor;
                ctx.strokeStyle = rimColor;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(px, plat.y, plat.w, plat.h, 4);
                ctx.fill();
                ctx.stroke();
            }
            ctx.restore();
        });

        // Draw Hazards
        this.currentLevel.hazards.forEach(haz => {
            const hx = haz.x - this.viewportX;
            ctx.save();

            if (haz.type === 'lava') {
                ctx.fillStyle = 'rgba(239, 68, 68, 0.7)';
                ctx.strokeStyle = '#f97316';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.fillRect(hx, haz.y, haz.w, haz.h);
                ctx.strokeRect(hx, haz.y, haz.w, 0);
            } else if (haz.type === 'slime') {
                ctx.fillStyle = 'rgba(16, 185, 129, 0.7)';
                ctx.strokeStyle = '#10b981';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.fillRect(hx, haz.y, haz.w, haz.h);
                ctx.strokeRect(hx, haz.y, haz.w, 0);
            } else if (haz.type === 'box') {
                ctx.fillStyle = '#b45309';
                ctx.strokeStyle = '#78350f';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(hx, haz.y, haz.w, haz.h, 4);
                ctx.fill();
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(hx + 4, haz.y + 4);
                ctx.lineTo(hx + haz.w - 4, haz.y + haz.h - 4);
                ctx.moveTo(hx + haz.w - 4, haz.y + 4);
                ctx.lineTo(hx + 4, haz.y + haz.h - 4);
                ctx.stroke();
            } else if (haz.type === 'rat') {
                ctx.fillStyle = '#64748b';
                ctx.beginPath();
                ctx.ellipse(hx + haz.w / 2, haz.y + haz.h / 2, haz.w / 2, haz.h / 2, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#ff9999';
                ctx.beginPath();
                ctx.moveTo(haz.vx > 0 ? hx : hx + haz.w, haz.y + haz.h - 4);
                ctx.quadraticCurveTo(
                    haz.vx > 0 ? hx - 8 : hx + haz.w + 8, 
                    haz.y + 2, 
                    haz.vx > 0 ? hx - 6 : hx + haz.w + 6, 
                    haz.y - 2
                );
                ctx.stroke();
            } else if (haz.type === 'spark') {
                if (haz.active) {
                    ctx.strokeStyle = '#38bdf8';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(hx, haz.y);
                    for (let sy = 0; sy < haz.h; sy += 8) {
                        ctx.lineTo(hx + (Math.random() - 0.5) * 16, haz.y + sy);
                    }
                    ctx.stroke();
                }
            } else if (haz.type === 'steam') {
                if (haz.active) {
                    ctx.fillStyle = 'rgba(241, 245, 249, 0.4)';
                    ctx.beginPath();
                    ctx.moveTo(hx + haz.w / 2, haz.y + haz.h);
                    ctx.lineTo(hx, haz.y);
                    ctx.lineTo(hx + haz.w, haz.y);
                    ctx.closePath();
                    ctx.fill();
                }
            } else if (haz.type === 'creature') {
                ctx.fillStyle = '#1e1b4b';
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.roundRect(hx, haz.y, haz.w, haz.h, 6);
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = '#e11d48';
                ctx.beginPath();
                ctx.arc(hx + haz.w - 8, haz.y + 8, 3, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        });

        // Draw Collectibles / Fact Nodes / Bonus items
        this.currentLevel.collectibles.forEach(item => {
            const ix = item.x - this.viewportX;
            ctx.save();

            if (item.type === 'fact_node') {
                if (item.read) {
                    // Draw read node (faded green)
                    ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
                    ctx.strokeStyle = '#10b981';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.roundRect(ix, item.y, item.w, item.h, 8);
                    ctx.fill();
                    ctx.stroke();

                    // Draw checkmark
                    ctx.strokeStyle = '#10b981';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(ix + 8, item.y + 16);
                    ctx.lineTo(ix + 14, item.y + 22);
                    ctx.lineTo(ix + 24, item.y + 10);
                    ctx.stroke();
                } else {
                    // Draw pulsing glowing unread node
                    const pulse = Math.sin(Date.now() / 150) * 4;
                    ctx.shadowBlur = 10 + pulse;
                    
                    let termColor = '#38bdf8';
                    if (this.currentLevel.id === 2) termColor = '#10b981';
                    if (this.currentLevel.id === 3) termColor = '#ef4444';
                    if (this.currentLevel.id === 4) termColor = '#fbbf24';
                    if (this.currentLevel.id === 5) termColor = '#a855f7';
                    
                    ctx.shadowColor = termColor;
                    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
                    ctx.strokeStyle = termColor;
                    ctx.lineWidth = 2.5;
                    ctx.beginPath();
                    ctx.roundRect(ix, item.y, item.w, item.h, 8);
                    ctx.fill();
                    ctx.stroke();

                    // Floating "?" above node
                    ctx.fillStyle = '#fff';
                    ctx.font = 'bold 16px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText("?", ix + item.w / 2, item.y + 22 + pulse / 2);
                }
            } else if (item.type === 'bonus_item') {
                const spin = (Date.now() / 300) % (Math.PI * 2);
                const hover = Math.sin(Date.now() / 150) * 3;
                const cx = ix + item.w / 2;
                const cy = item.y + item.h / 2 + hover;

                ctx.save();
                if (this.currentLevel.id === 1) {
                    // Cogwheel
                    ctx.translate(cx, cy);
                    ctx.rotate(spin);
                    ctx.strokeStyle = '#38bdf8';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(0, 0, 7, 0, Math.PI * 2);
                    ctx.stroke();
                    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
                        ctx.moveTo(Math.cos(a) * 7, Math.sin(a) * 7);
                        ctx.lineTo(Math.cos(a) * 11, Math.sin(a) * 11);
                    }
                    ctx.stroke();
                } else if (this.currentLevel.id === 2) {
                    // Data disk
                    ctx.fillStyle = 'rgba(16, 185, 129, 0.9)';
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.roundRect(ix, item.y + hover, item.w, item.h, 3);
                    ctx.fill();
                    ctx.stroke();
                    ctx.fillStyle = '#cbd5e1';
                    ctx.fillRect(ix + 4, item.y + hover + 2, 10, 6);
                } else if (this.currentLevel.id === 3) {
                    // Crystal
                    ctx.translate(cx, cy);
                    ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
                    ctx.strokeStyle = '#f97316';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(0, -9);
                    ctx.lineTo(7, 0);
                    ctx.lineTo(0, 9);
                    ctx.lineTo(-7, 0);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                } else if (this.currentLevel.id === 4) {
                    // Pearl
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = '#fbbf24';
                    ctx.fillStyle = '#fff';
                    ctx.strokeStyle = '#fbbf24';
                    ctx.beginPath();
                    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                } else if (this.currentLevel.id === 5) {
                    // Capsule pill
                    ctx.translate(cx, cy);
                    ctx.rotate(Math.PI / 4 + spin / 3);
                    ctx.fillStyle = '#a855f7';
                    ctx.beginPath();
                    ctx.arc(0, -3, 4, Math.PI, 0);
                    ctx.lineTo(4, 3);
                    ctx.lineTo(-4, 3);
                    ctx.closePath();
                    ctx.fill();
                    ctx.fillStyle = '#fff';
                    ctx.beginPath();
                    ctx.arc(0, 3, 4, 0, Math.PI);
                    ctx.lineTo(-4, -3);
                    ctx.lineTo(4, -3);
                    ctx.closePath();
                    ctx.fill();
                }
                ctx.restore();
            }
            ctx.restore();
        });

        // Draw active sonar scan lines (L4)
        if (isWaterLevel && this.upgrades.sonar) {
            this.sonarPings.forEach(p => {
                ctx.strokeStyle = `rgba(251, 191, 36, ${p.life / 60})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(p.x - this.viewportX, p.y, p.r, 0, Math.PI * 2);
                ctx.stroke();
            });
        }

        // Draw Player
        this.player.draw(ctx, this.upgrades, isWaterLevel, this.viewportX);
    }
}

// Level configurations helper
function getLevelConfig(num) {
    const list = {
        1: {
            id: 1,
            title: "Level 1: Dull Factory",
            theme: "blue",
            width: 2800,
            height: 580,
            startX: 100,
            startY: 400,
            totalRequired: 5,
            platforms: [
                { x: 0, y: 480, w: 600, h: 100 },
                { x: 400, y: 380, w: 200, h: 20 },
                { x: 700, y: 480, w: 300, h: 100 },
                { x: 1000, y: 480, w: 400, h: 100, isConveyor: true, conveyorSpeed: 2.5 },
                { x: 1500, y: 400, w: 300, h: 20 },
                { x: 1900, y: 480, w: 500, h: 100 },
                { x: 2100, y: 360, w: 200, h: 20 },
                { x: 2400, y: 480, w: 400, h: 100 }
            ],
            collectibles: [
                // 5 Facts
                {
                    x: 250, y: 440, w: 32, h: 32, type: "fact_node", factIndex: 0, read: false,
                    factText: "\"Dull\" jobs are highly repetitive, monotonous, and predictable tasks. Humans easily lose concentration or suffer from mental fatigue doing them, which leads to errors or repetitive strain injuries."
                },
                {
                    x: 500, y: 340, w: 32, h: 32, type: "fact_node", factIndex: 1, read: false,
                    factText: "Examples: Assembly line packing, sorting mail, data entry, and picking items in a warehouse."
                },
                {
                    x: 850, y: 440, w: 32, h: 32, type: "fact_node", factIndex: 2, read: false,
                    factText: "Performing these tasks causes severe mental fatigue and cognitive drift in humans, which naturally leads to costly drops in attention and mistakes."
                },
                {
                    x: 1650, y: 360, w: 32, h: 32, type: "fact_node", factIndex: 3, read: false,
                    factText: "A prominent real-world example of this is Amazon's Sparrow robot, an advanced robotic arm deployed in fulfillment centers to automate the incredibly repetitive task of item sorting."
                },
                {
                    x: 2200, y: 320, w: 32, h: 32, type: "fact_node", factIndex: 4, read: false,
                    factText: "Before Sparrow, human workers had to manually look at, pick up, and scan millions of individual products from large bins every single day."
                },
                // 5 Optional Cogwheels
                { x: 350, y: 340, w: 20, h: 20, type: "bonus_item", collected: false },
                { x: 750, y: 440, w: 20, h: 20, type: "bonus_item", collected: false },
                { x: 1200, y: 440, w: 20, h: 20, type: "bonus_item", collected: false },
                { x: 1600, y: 360, w: 20, h: 20, type: "bonus_item", collected: false },
                { x: 2150, y: 320, w: 20, h: 20, type: "bonus_item", collected: false }
            ],
            hazards: [
                { x: 300, y: 100, w: 30, h: 30, type: "box", vy: 3, spawnY: 50, maxY: 460 },
                { x: 850, y: 150, w: 30, h: 30, type: "box", vy: 3.5, spawnY: 50, maxY: 460 },
                { x: 2000, y: 80, w: 30, h: 30, type: "box", vy: 4, spawnY: 50, maxY: 460 },
                { x: 1550, y: 360, w: 10, h: 40, type: "spark", active: false, timer: 0 },
                { x: 1750, y: 360, w: 10, h: 40, type: "spark", active: false, timer: 0 }
            ],
            exit: { x: 2700, y: 400, w: 60, h: 80 }
        },
        2: {
            id: 2,
            title: "Level 2: Dirty Sewer",
            theme: "green",
            width: 2800,
            height: 580,
            startX: 100,
            startY: 400,
            totalRequired: 5,
            platforms: [
                { x: 0, y: 480, w: 500, h: 100 },
                { x: 600, y: 480, w: 400, h: 100 },
                { x: 1100, y: 480, w: 500, h: 100 },
                { x: 1700, y: 480, w: 500, h: 100 },
                { x: 2300, y: 480, w: 500, h: 100 },
                { x: 1350, y: 380, w: 200, h: 20 },
                { x: 1950, y: 380, w: 200, h: 20 }
            ],
            collectibles: [
                // 5 Facts
                {
                    x: 300, y: 440, w: 32, h: 32, type: "fact_node", factIndex: 0, read: false,
                    factText: "Dirty jobs take place in environments that are unsanitary, messy, or socially undesirable for humans, often involving exposure to fumes, waste, or contamination."
                },
                {
                    x: 800, y: 440, w: 32, h: 32, type: "fact_node", factIndex: 1, read: false,
                    factText: "Examples: Sewage pipe inspection, agricultural harvesting, waste management sorting, and industrial spray painting."
                },
                {
                    x: 1450, y: 340, w: 32, h: 32, type: "fact_node", factIndex: 2, read: false,
                    factText: "For human workers, these environments pose more than just an unpleasant smell; they carry genuine health risks."
                },
                {
                    x: 2050, y: 340, w: 32, h: 32, type: "fact_node", factIndex: 3, read: false,
                    factText: "Robots excel here because they have no biological vulnerabilities or senses to offend."
                },
                {
                    x: 2500, y: 440, w: 32, h: 32, type: "fact_node", factIndex: 4, read: false,
                    factText: "A real-world example of this is the Lely Discovery, an autonomous mobile robot used on modern dairy farms to handle the endless chore of manure management, since manure-covered barn floors create a slick, unhygienic environment that spreads bacteria."
                },
                // 5 Optional Disks
                { x: 200, y: 440, w: 20, h: 20, type: "bonus_item", collected: false },
                { x: 700, y: 440, w: 20, h: 20, type: "bonus_item", collected: false },
                { x: 1250, y: 440, w: 20, h: 20, type: "bonus_item", collected: false },
                { x: 1800, y: 440, w: 20, h: 20, type: "bonus_item", collected: false },
                { x: 2400, y: 440, w: 20, h: 20, type: "bonus_item", collected: false }
            ],
            hazards: [
                { x: 500, y: 520, w: 100, h: 60, type: "slime" },
                { x: 1000, y: 520, w: 100, h: 60, type: "slime" },
                { x: 1600, y: 520, w: 100, h: 60, type: "slime" },
                { x: 2200, y: 520, w: 100, h: 60, type: "slime" },
                { x: 200, y: 460, w: 20, h: 12, type: "rat", vx: 2, minX: 100, maxX: 400 },
                { x: 800, y: 460, w: 20, h: 12, type: "rat", vx: -2.5, minX: 650, maxX: 950 },
                { x: 1800, y: 460, w: 20, h: 12, type: "rat", vx: 2, minX: 1720, maxX: 2100 }
            ],
            exit: { x: 2700, y: 400, w: 60, h: 80 }
        },
        3: {
            id: 3,
            title: "Level 3: Dangerous Volcano",
            theme: "red",
            width: 2800,
            height: 580,
            startX: 100,
            startY: 400,
            totalRequired: 5,
            platforms: [
                { x: 0, y: 480, w: 400, h: 100 },
                { x: 500, y: 440, w: 300, h: 140 },
                { x: 900, y: 480, w: 400, h: 100 },
                { x: 1400, y: 400, w: 400, h: 180 },
                { x: 1950, y: 480, w: 300, h: 100 },
                { x: 2400, y: 480, w: 400, h: 100 },
                { x: 350, y: 350, w: 100, h: 20 },
                { x: 820, y: 360, w: 100, h: 20 },
                { x: 1320, y: 320, w: 100, h: 20 },
                { x: 1850, y: 360, w: 100, h: 20 },
                { x: 2300, y: 380, w: 100, h: 20 }
            ],
            collectibles: [
                // 5 Facts
                {
                    x: 220, y: 440, w: 32, h: 32, type: "fact_node", factIndex: 0, read: false,
                    factText: "Dangerous Jobs are high-risk jobs where human life or health is put in jeopardy. Deploying robots here keeps humans out of harm's way."
                },
                {
                    x: 650, y: 400, w: 32, h: 32, type: "fact_node", factIndex: 1, read: false,
                    factText: "Examples: Bomb disposal, mining, exploring active volcanoes, disaster zone search-and-rescue, and maintaining nuclear power plants."
                },
                {
                    x: 1100, y: 440, w: 32, h: 32, type: "fact_node", factIndex: 2, read: false,
                    factText: "For human workers, these positions mean constantly operating under extreme physical and psychological duress."
                },
                {
                    x: 1600, y: 360, w: 32, h: 32, type: "fact_node", factIndex: 3, read: false,
                    factText: "A prominent real-world example of this is Spot, the quadruped robot developed by Boston Dynamics, which is actively deployed to inspect high-risk sites like decommissioned nuclear power plants."
                },
                {
                    x: 2150, y: 440, w: 32, h: 32, type: "fact_node", factIndex: 4, read: false,
                    factText: "By sending Spot into these high-risk areas, human engineers can safely monitor the facility's vitals from miles away without ever exposing themselves to toxic radiation."
                },
                // 5 Optional Crystals
                { x: 380, y: 310, w: 20, h: 20, type: "bonus_item", collected: false },
                { x: 850, y: 320, w: 20, h: 20, type: "bonus_item", collected: false },
                { x: 1350, y: 280, w: 20, h: 20, type: "bonus_item", collected: false },
                { x: 1880, y: 320, w: 20, h: 20, type: "bonus_item", collected: false },
                { x: 2320, y: 340, w: 20, h: 20, type: "bonus_item", collected: false }
            ],
            hazards: [
                { x: 400, y: 530, w: 100, h: 50, type: "lava" },
                { x: 800, y: 530, w: 100, h: 50, type: "lava" },
                { x: 1300, y: 530, w: 100, h: 50, type: "lava" },
                { x: 1800, y: 530, w: 150, h: 50, type: "lava" },
                { x: 2250, y: 530, w: 150, h: 50, type: "lava" },
                { x: 550, y: 340, w: 30, h: 100, type: "steam", active: false, timer: 0 },
                { x: 1050, y: 380, w: 30, h: 100, type: "steam", active: false, timer: 0 },
                { x: 2050, y: 380, w: 30, h: 100, type: "steam", active: false, timer: 0 }
            ],
            exit: { x: 2700, y: 400, w: 60, h: 80 }
        },
        4: {
            id: 4,
            title: "Level 4: Dear Deep Sea",
            theme: "yellow",
            width: 2800,
            height: 580,
            startX: 100,
            startY: 200,
            totalRequired: 5,
            platforms: [
                { x: 0, y: 520, w: 700, h: 60 },
                { x: 850, y: 480, w: 600, h: 100 },
                { x: 1600, y: 520, w: 600, h: 60 },
                { x: 2350, y: 480, w: 450, h: 100 },
                { x: 400, y: 320, w: 120, h: 30 },
                { x: 1100, y: 280, w: 120, h: 30 },
                { x: 1800, y: 320, w: 120, h: 30 }
            ],
            collectibles: [
                // 5 Facts
                {
                    x: 350, y: 480, w: 32, h: 32, type: "fact_node", factIndex: 0, read: false,
                    factText: "In this context, \"dear\" means costly in terms of time, resources, or specialized human capital. Using automation or robotics in these fields helps democratize access and drastically lower operational costs."
                },
                {
                    x: 1100, y: 440, w: 32, h: 32, type: "fact_node", factIndex: 1, read: false,
                    factText: "Examples: Deep-sea oil exploration, space exploration, and processing massive datasets for laboratory research."
                },
                {
                    x: 1750, y: 480, w: 32, h: 32, type: "fact_node", factIndex: 2, read: false,
                    factText: "For human operations, the primary constraint is the massive cost of life support and safety."
                },
                {
                    x: 2000, y: 280, w: 32, h: 32, type: "fact_node", factIndex: 3, read: false,
                    factText: "Sending crews into outer space or the deep ocean requires specialized survival gear, transport vessels, heavy liability insurance, and highly rare technical experts, turning routine inspections or data gathering into multi-million-dollar logistical challenges."
                },
                {
                    x: 2500, y: 440, w: 32, h: 32, type: "fact_node", factIndex: 4, read: false,
                    factText: "A prime real-world example of mitigating \"dear\" costs is the Saab Seaeye Sabertooth, a hybrid autonomous underwater vehicle (AUV) used extensively in deep-sea energy and oil exploration."
                },
                // 5 Optional Pearls
                { x: 450, y: 280, w: 20, h: 20, type: "bonus_item", collected: false },
                { x: 900, y: 440, w: 20, h: 20, type: "bonus_item", collected: false },
                { x: 1150, y: 240, w: 20, h: 20, type: "bonus_item", collected: false },
                { x: 1720, y: 480, w: 20, h: 20, type: "bonus_item", collected: false },
                { x: 2400, y: 440, w: 20, h: 20, type: "bonus_item", collected: false }
            ],
            hazards: [
                { x: 600, y: 150, w: 32, h: 24, type: "creature", vy: 2, minY: 100, maxY: 420 },
                { x: 1350, y: 250, w: 32, h: 24, type: "creature", vy: -2.5, minY: 80, maxY: 400 },
                { x: 2100, y: 150, w: 32, h: 24, type: "creature", vy: 3, minY: 100, maxY: 420 }
            ],
            exit: { x: 2700, y: 400, w: 60, h: 80 }
        },
        5: {
            id: 5,
            title: "Level 5: Difficult Surgery",
            theme: "purple",
            width: 2500,
            height: 580,
            startX: 100,
            startY: 400,
            totalRequired: 5,
            platforms: [
                { x: 0, y: 480, w: 500, h: 100 },
                { x: 600, y: 400, w: 300, h: 180 },
                { x: 1050, y: 480, w: 400, h: 100 },
                { x: 1600, y: 400, w: 300, h: 180 },
                { x: 2050, y: 480, w: 450, h: 100 },
                { x: 420, y: 330, w: 100, h: 20 },
                { x: 960, y: 350, w: 100, h: 20 },
                { x: 1500, y: 320, w: 100, h: 20 },
                { x: 1475, y: 440, w: 75, h: 20 }
            ],
            collectibles: [
                // 5 Facts
                {
                    x: 300, y: 440, w: 32, h: 32, type: "fact_node", factIndex: 0, read: false,
                    factText: "Difficult Jobs require an extreme level of physical precision, endurance, or intricate maneuvers that push the absolute limits of human capability."
                },
                {
                    x: 750, y: 360, w: 32, h: 32, type: "fact_node", factIndex: 1, read: false,
                    factText: "Examples: Micro-soldering electronics, heavy cargo lifting in tight spaces, and assisting in high-precision laparoscopic surgeries."
                },
                {
                    x: 1250, y: 440, w: 32, h: 32, type: "fact_node", factIndex: 2, read: false,
                    factText: "For human workers, the primary limitations are biology and scale. Even the most skilled professional has microscopic, involuntary hand tremors and is limited by human eyesight, joint geometry, and physical fatigue."
                },
                {
                    x: 1750, y: 360, w: 32, h: 32, type: "fact_node", factIndex: 3, read: false,
                    factText: "A leading real-world example of this is the da Vinci 5 surgical system, which is actively used in operating rooms worldwide to perform complex, high-precision laparoscopic surgeries."
                },
                {
                    x: 2200, y: 440, w: 32, h: 32, type: "fact_node", factIndex: 4, read: false,
                    factText: "Robotic systems eliminate these physiological bottlenecks by introducing advanced mechanical stability and software manipulation."
                },
                // 5 Optional Capsules
                { x: 450, y: 290, w: 20, h: 20, type: "bonus_item", collected: false },
                { x: 850, y: 360, w: 20, h: 20, type: "bonus_item", collected: false },
                { x: 1150, y: 440, w: 20, h: 20, type: "bonus_item", collected: false },
                { x: 1550, y: 280, w: 20, h: 20, type: "bonus_item", collected: false },
                { x: 2100, y: 440, w: 20, h: 20, type: "bonus_item", collected: false }
            ],
            hazards: [
                { x: 920, y: 350, w: 8, h: 130, type: "spark", active: false, timer: 0 },
                { x: 1920, y: 350, w: 8, h: 130, type: "spark", active: false, timer: 0 }
            ],
            exit: { x: 2400, y: 400, w: 60, h: 80 }
        }
    };
    return list[num];
}

// Collisions bounding boxes helpers
function checkAABB(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.w &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.h &&
        rect1.y + rect1.height > rect2.y
    );
}

// Distance helper for interactions
function checkDistance(rect, obj, limit) {
    const rx = rect.x + rect.width / 2;
    const ry = rect.y + rect.height / 2;
    const ox = obj.x + obj.w / 2;
    const oy = obj.y + obj.h / 2;
    const dist = Math.hypot(rx - ox, ry - oy);
    return dist < limit;
}

const gameEngine = new GameEngine();
window.gameEngine = gameEngine;
