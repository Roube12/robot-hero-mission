// Web Audio API Synthesizer for Robot Hero Mission

class SoundManager {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.bgmInterval = null;
        this.isMuted = false;
        this.isPlayingBGM = false;
        this.bgmVolume = 0.15;
        this.sfxVolume = 0.35;
    }

    init() {
        if (this.ctx) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 1.0;
            this.masterGain.connect(this.ctx.destination);
        } catch (e) {
            console.error("Web Audio API is not supported in this browser", e);
        }
    }

    resume() {
        this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.masterGain) {
            this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1.0, this.ctx.currentTime);
        }
        return this.isMuted;
    }

    // SFX: Robot Jump
    playJump() {
        this.resume();
        if (!this.ctx || this.isMuted) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.type = 'triangle';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);

        gain.gain.setValueAtTime(this.sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.start(now);
        osc.stop(now + 0.15);
    }

    // SFX: Collect Part/Item
    playCollect() {
        this.resume();
        if (!this.ctx || this.isMuted) return;

        const now = this.ctx.currentTime;
        
        // Double chime
        const playTone = (freq, time, duration) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, time);
            
            gain.gain.setValueAtTime(this.sfxVolume, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

            osc.start(time);
            osc.stop(time + duration);
        };

        playTone(523.25, now, 0.08); // C5
        playTone(659.25, now + 0.06, 0.12); // E5
    }

    // SFX: Take Damage
    playDamage() {
        this.resume();
        if (!this.ctx || this.isMuted) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.linearRampToValueAtTime(40, now + 0.2);

        gain.gain.setValueAtTime(this.sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        osc.start(now);
        osc.stop(now + 0.2);
    }

    // SFX: Clean/Repair Task Complete
    playTaskComplete() {
        this.resume();
        if (!this.ctx || this.isMuted) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.type = 'square';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554.37, now + 0.08); // C#5
        osc.frequency.setValueAtTime(659.25, now + 0.16); // E5
        osc.frequency.setValueAtTime(880, now + 0.24); // A5

        gain.gain.setValueAtTime(this.sfxVolume * 0.7, now);
        gain.gain.setValueAtTime(this.sfxVolume * 0.7, now + 0.24);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

        osc.start(now);
        osc.stop(now + 0.4);
    }

    // SFX: Correct Answer
    playCorrect() {
        this.resume();
        if (!this.ctx || this.isMuted) return;

        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.06);
            gain.gain.setValueAtTime(this.sfxVolume * 0.8, now + i * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.06 + 0.25);

            osc.start(now + i * 0.06);
            osc.stop(now + i * 0.06 + 0.25);
        });
    }

    // SFX: Wrong Answer
    playWrong() {
        this.resume();
        if (!this.ctx || this.isMuted) return;

        const now = this.ctx.currentTime;
        const playBuzz = (time) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(140, time);
            osc.frequency.linearRampToValueAtTime(110, time + 0.15);

            gain.gain.setValueAtTime(this.sfxVolume, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.18);

            osc.start(time);
            osc.stop(time + 0.18);
        };

        playBuzz(now);
        playBuzz(now + 0.1);
    }

    // SFX: Upgrade Unlocked / Game Victory
    playVictoryFanfare() {
        this.resume();
        if (!this.ctx || this.isMuted) return;

        const now = this.ctx.currentTime;
        const notes = [
            { f: 261.63, d: 0.15 }, // C4
            { f: 329.63, d: 0.15 }, // E4
            { f: 392.00, d: 0.15 }, // G4
            { f: 523.25, d: 0.30 }, // C5
            { f: 392.00, d: 0.15 }, // G4
            { f: 523.25, d: 0.60 }  // C5
        ];

        let timeOffset = 0;
        notes.forEach(note => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(note.f, now + timeOffset);
            gain.gain.setValueAtTime(this.sfxVolume, now + timeOffset);
            gain.gain.exponentialRampToValueAtTime(0.01, now + timeOffset + note.d);

            osc.start(now + timeOffset);
            osc.stop(now + timeOffset + note.d);
            timeOffset += note.d * 0.9;
        });
    }

    // Play a click sound
    playClick() {
        this.resume();
        if (!this.ctx || this.isMuted) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.type = 'sine';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(1000, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.03);

        gain.gain.setValueAtTime(this.sfxVolume * 0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);

        osc.start(now);
        osc.stop(now + 0.03);
    }

    // Loop Background Music (8-bit style retro sequence)
    startBGM() {
        this.resume();
        if (this.isPlayingBGM) return;
        this.isPlayingBGM = true;

        const tempo = 115; // BPM
        const beatLength = 60 / tempo; // duration of a beat in seconds
        
        const chords = [
            [261.63, 329.63, 392.00, 523.25], // C Major: C4, E4, G4, C5
            [349.23, 440.00, 523.25, 698.46], // F Major: F4, A4, C5, F5
            [392.00, 493.88, 587.33, 783.99], // G Major: G4, B4, D5, G5
            [261.63, 329.63, 392.00, 523.25]  // C Major
        ];

        let chordIndex = 0;
        let step = 0;

        const playBGMStep = () => {
            if (!this.isPlayingBGM || this.isMuted) return;

            const now = this.ctx.currentTime;
            const currentChord = chords[chordIndex];
            
            // Bassline (plays on beats 1 and 3)
            if (step % 4 === 0) {
                const bassOsc = this.ctx.createOscillator();
                const bassGain = this.ctx.createGain();
                bassOsc.connect(bassGain);
                bassGain.connect(this.masterGain);

                bassOsc.type = 'triangle';
                bassOsc.frequency.setValueAtTime(currentChord[0] / 2, now); // Root note an octave lower
                bassGain.gain.setValueAtTime(this.bgmVolume * 0.8, now);
                bassGain.gain.exponentialRampToValueAtTime(0.01, now + beatLength * 1.5);

                bassOsc.start(now);
                bassOsc.stop(now + beatLength * 1.5);
            }

            // Arpeggio melody
            const noteIndex = step % 4;
            const noteFreq = currentChord[noteIndex];

            const melOsc = this.ctx.createOscillator();
            const melGain = this.ctx.createGain();
            melOsc.connect(melGain);
            melGain.connect(this.masterGain);

            melOsc.type = 'sine';
            melOsc.frequency.setValueAtTime(noteFreq, now);

            // Vibrato
            melOsc.frequency.linearRampToValueAtTime(noteFreq * 1.015, now + beatLength * 0.25);
            melOsc.frequency.linearRampToValueAtTime(noteFreq, now + beatLength * 0.5);

            melGain.gain.setValueAtTime(this.bgmVolume * 0.45, now);
            melGain.gain.exponentialRampToValueAtTime(0.01, now + beatLength * 0.45);

            melOsc.start(now);
            melOsc.stop(now + beatLength * 0.5);

            // Advance step
            step++;
            if (step >= 8) {
                step = 0;
                chordIndex = (chordIndex + 1) % chords.length;
            }
        };

        const intervalTime = beatLength * 500; // 8th note interval in ms
        this.bgmInterval = setInterval(playBGMStep, intervalTime);
    }

    stopBGM() {
        this.isPlayingBGM = false;
        if (this.bgmInterval) {
            clearInterval(this.bgmInterval);
            this.bgmInterval = null;
        }
    }
}

const sounds = new SoundManager();
window.sounds = sounds;
