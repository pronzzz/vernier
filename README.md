# FireWordle 🔥

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)

A modern, responsive, and performant clone of the popular game "Wordle", built with the Firebase ecosystem in mind. FireWordle features a clean UI, smooth animations, and persistent game state.

## ✨ Features

-   **Classic Gameplay**: Guess the 5-letter word in 6 tries.
-   **Rich Feedback**: Green (Correct), Yellow (Wrong Spot), Gray (Not in word) color cues.
-   **Responsive Design**: Fully playable on Desktop and Mobile devices.
-   **Dark Mode**: Sleek dark theme that persists according to user preference.
-   **Animations**: Polished "Shake" on invalid words and "Flip" reveals.
-   **Persistence**: Game state is saved to `localStorage`, so you never lose progress on refresh.
-   **Virtual Keyboard**: Interactive on-screen keyboard that tracks used letters.

## 🛠️ Tech Stack

-   **Frontend**: React (v18) + Vite
-   **Styling**: Tailwind CSS (Utility-first framework)
-   **Icons**: Phosphor Icons
-   **State Management**: React Hooks (`useState`, `useEffect`, Custom Hooks)
-   **Hosting**: Firebase Hosting (SPA configuration)
-   **CI/CD**: GitHub Actions for automated deployment

## 🚀 Getting Started

### Prerequisites

-   Node.js (v16 or higher)
-   npm (v7 or higher)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/pronzzz/firewordle.git
    cd firewordle
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

4.  **Build for production:**
    ```bash
    npm run build
    ```

## 📂 Project Structure

```text
/
├── public/              # Static assets
├── src/
│   ├── components/      # UI Components (Grid, Row, Keyboard, Modal)
│   ├── context/         # React Context (ThemeContext)
│   ├── data/            # Word lists and static data
│   ├── hooks/           # Custom Hooks (useWordle core logic)
│   ├── App.jsx          # Main Application Component
│   ├── main.jsx         # Entry point
│   └── index.css        # Tailwind imports & global styles
├── .github/             # GitHub Actions workflows
├── firebase.json        # Firebase Hosting configuration
└── vite.config.js       # Vite configuration
```

## 🧩 Architecture

The application relies heavily on the **`useWordle`** custom hook, which manages the entire game state:
-   `turn`: Current guess number (0-5).
-   `currentGuess`: The string currently being typed.
-   `guesses`: Array of formatted guesses (objects with letter and color).
-   `isCorrect`: Boolean flag for win condition.
-   `usedKeys`: Dictionary tracking the color status of each keyboard key.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
