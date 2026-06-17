# Robot Hero Mission – Educational Adventure Game

"Robot Hero Mission" is a browser-based, interactive 2D side-scrolling platformer designed to teach students ages 12–18 about the **5 D's of Jobs in Robotics** (Dull, Dirty, Dangerous, Dear, Difficult).

The game is built entirely using vanilla web technologies (HTML5 Canvas, CSS Grid/Flexbox, and JavaScript) and features a fully synthesized sound system utilizing the Web Audio API, removing all external assets requirements.

## Game Structure & Concept

Players control a heroic robot tasked with completing critical missions in five environments representing the 5 D's:

1. 🟦 **Dull Factory** (Manufacturing): Collect 10 missing parts, navigate conveyor belts, and repair assembly components. Unlocks the **Speed Boost** upgrade.
2. 🟩 **Dirty Sewer** (Sanitation): Clean up 8 sewage waste blockages, recover sensor data, and avoid acidic puddles. Unlocks the **Waterproof Armor** upgrade.
3. 🟥 **Dangerous Volcano** (Extreme Environments): Retrieve 5 volcanic research modules, avoid glowing magma streams, and dodge ceiling eruptions. Unlocks the **Heat Shield** upgrade.
4. 🟨 **Dear Deep Sea** (Expensive Subsea Ops): Repair 6 sonar devices, collect marine pearls under floaty water physics, and avoid dangerous angler creatures. Unlocks the **Sonar Scanner** upgrade.
5. 🟪 **Difficult Surgery** (Precision Healthcare): Manage patient vitals stability, fetch active clinical tools (Scalpels, Forceps, Lasers) from tool cupboards, and perform micro-surgical adjustments. Unlocks the **Master Surgeon Module**.

### Core Systems

- **Visual Upgrade System**: Each unlocked upgrade physically transforms the robot hero sprite, rendering items like glowing thruster jets, waterproof hulls, glowing heat shields, head-mounted sonar plates, or micro-surgical arm claws.
- **Scoring & Quizzes**: Each level concludes with a 3-question MCQ quiz testing the student on robotics concepts related to the cleared environment. 100 points are awarded per answer, plus a 150-point bonus for a perfect score.
- **Save State Persistence**: Automatically saves user progress, high scores, and active modules using browser `localStorage`.
- **Procedural Sound Synthesizer**: Uses standard oscillators and gains to play authentic chiptunes and retro sound effects on trigger without assets footprint.

## Controls

### Keyboard Controls
- **A / D** or **Left / Right Arrow**: Move horizontal.
- **W** or **Up Arrow** or **Space**: Jump (or swim vertically underwater).
- **E**: Interact, clean waste, or repair sensors.
- **Escape**: Pause mission / Open menu.

### Touch Controls
Includes clean, on-screen touch buttons for mobile browser players:
- **Left / Right D-Pad**: Move horizontal.
- **JUMP**: Jump / Swim.
- **ACTION**: Interact / Repair.

## Running Locally

To run the game, simply open `index.html` in any web browser. 

For the best experience (including full audio features which some browsers restrict on raw local files due to strict autoplay policies), host it on a simple local server:

```bash
# Using python
python -m http.server 8000

# Using Node.js
npx http-server
```
Then open `http://localhost:8000` in your browser.

## 🚀 Deploying to GitHub Pages

GitHub Pages provides free, secure HTTPS hosting, which is perfect for this game and enables PWA app installation on Android and iOS.

### Step 1: Create a GitHub Repository
1. Log in to [GitHub](https://github.com/).
2. Create a new repository named `robot-hero-mission` (keep it **Public**).
3. Do **not** initialize it with a README, `.gitignore`, or license.

### Step 2: Push Your Code using Git
Open your terminal (PowerShell, Command Prompt, or Git Bash) inside the project folder (`C:\Users\johnb\.gemini\antigravity\scratch\robot-hero-mission\`) and run:

```bash
# Initialize local git repository
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial release with facts, collectibles, PWA support, and creator credits"

# Rename branch to main
git branch -M main

# Link local repository to your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/robot-hero-mission.git

# Push files to GitHub
git push -u origin main
```
*(Make sure to replace `YOUR_USERNAME` with your actual GitHub username!)*

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub.
2. Click **Settings** (tab at the top).
3. Select **Pages** (in the left-hand sidebar).
4. Under **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: Select **main** and folder **/ (root)**
5. Click **Save**.

Within 1-2 minutes, GitHub will deploy your game. It will be live at:
`https://YOUR_USERNAME.github.io/robot-hero-mission/`

