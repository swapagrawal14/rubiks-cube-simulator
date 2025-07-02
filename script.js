# 3D Rubik's Cube Simulator

An outstanding, fully functional Rubik's Cube web app built with pure HTML, CSS, and JavaScript. No dependencies required!

 
*(You should replace this with a real screenshot of your app!)*

[**▶️ Live Demo Here**](https://your-github-username.github.io/your-repository-name/) 
*(After deploying to GitHub Pages, update this link)*

---

## ✨ Features

- **Full 3D Interaction**: Click and drag the mouse to rotate the entire cube in any direction.
- **Smooth Animations**: All face turns and cube rotations are smoothly animated using CSS transitions.
- **Complete Controls**:
    - On-screen buttons for all 12 standard face moves (U, U', D, D', etc.).
    - Keyboard shortcuts for all moves (e.g., 'U' for Up, 'Shift+U' for Up-Prime).
- **Dynamic Info Panel**:
    - **Timer**: Automatically starts on your first move and tracks your solve time.
    - **Move Counter**: Keeps a count of all your moves.
- **Core Cube Actions**:
    - **Scramble**: Instantly shuffles the cube with a 20-move random sequence.
    - **Reset**: Returns the cube to its solved state.
- **Persistent State**: Your cube's state, time, and move count are automatically saved to your browser's `localStorage`. Come back later and continue where you left off!
- **Modern & Responsive UI**: Clean, dark-mode interface that looks great on both desktop and mobile devices.
- **Zero Dependencies**: Built with vanilla HTML, CSS, and JavaScript. Lightweight and easy to understand.

## 🚀 How to Use & Deploy

### Using the Simulator
- **Rotate the Cube**: Click and drag anywhere on the cube or the surrounding area.
- **Turn a Face**: 
    - Click the on-screen buttons.
    - Use your keyboard. The keys `U, D, L, R, F, B` correspond to the standard moves. Hold `Shift` while pressing a key for the prime (counter-clockwise) move (e.g., `Shift+U` for U').
- **Scramble/Reset**: Use the dedicated buttons in the control panel.

### Deploying on GitHub Pages
This project is perfectly set up for GitHub Pages.
1. Create a new repository on GitHub.
2. Upload the `index.html`, `style.css`, and `script.js` files to the repository.
3. In your repository's settings, go to the "Pages" tab.
4. Under "Build and deployment", select the source as **Deploy from a branch**.
5. Choose the `main` (or `master`) branch and the `/ (root)` folder.
6. Click **Save**. Your site will be live in a few minutes at `https://your-username.github.io/your-repo-name/`.

## 🛠️ Tech Stack
- **HTML5**
- **CSS3**
    - CSS Variables for easy theming.
    - Flexbox and Grid for layout.
    - **3D Transforms & Perspective** for the cube rendering.
- **Vanilla JavaScript (ES6+)**
    - DOM manipulation for cube creation and state changes.
    - Event handling for all user interactions.
    - `localStorage` API for state persistence.

---
Enjoy your cube!
