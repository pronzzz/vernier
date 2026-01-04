# FireWordle - Developer Guide

## 🧠 Core Game Logic (`useWordle.js`)

The heart of the game resides in the `useWordle` hook. Here's how it processes guesses:

1.  **Input Handling**: Listens for `keydown` events. It filters for alphabetical keys, `Backspace`, and `Enter`.
2.  **Formatting**: When `Enter` is pressed, the `formatGuess` function is called:
    -   It converts the guess string into an array of objects: `{ key: 'a', color: 'grey' }`.
    -   **Pass 1 (Green)**: Checks for letters that match the solution at the exact same index. marks them 'green'.
    -   **Pass 2 (Yellow)**: Checks remaining letters. If the letter exists in the solution (and hasn't been "claimed" by a green match), marks it 'yellow' and removes that instance from the solution check array to handle duplicates correctly.
3.  **State Update**: The formatted guess is added to the `guesses` array, turn count increments, and `usedKeys` map is updated to reflect the "best" color achieved for each letter.

## 🎨 Styling Architecture

We use **Tailwind CSS** for rapid styling.

-   **Grid Layout**: Flexbox is used for the rows and tiles to ensure they center correctly on all screen sizes.
-   **Dynamic Colors**:
    -   `bg-wordle-green`: Correct (#6aaa64)
    -   `bg-wordle-yellow`: Present (#c9b458)
    -   `bg-wordle-gray`: Absent (#787c7e)
-   **Animations**:
    -   Defined in `tailwind.config.js`.
    -   `animate-flip`: Triggered by applying a transition delay to each tile in a row (0.2s, 0.4s, etc.).

## ☁️ Deployment Guide (Firebase)

### 1. Manual Deployment (CLI)

You can deploy directly from your terminal if you have `firebase-tools` installed and authenticated.

```bash
# Build the project
npm run build

# Deploy to Hosting
firebase deploy --only hosting
```

### 2. CI/CD with GitHub Actions

This project includes a workflow file `.github/workflows/firebase-hosting-merge.yml` that automatically deploys to Firebase Hosting when you push to the `main` branch.

**Prerequisites setup:**

1.  **Initialize Hosting**:
    ```bash
    firebase init hosting
    ```
2.  **GitHub Integration**:
    During initialization, answer "Yes" to "Set up automatic builds and deploys with GitHub?".
    -   Login to GitHub when prompted.
    -   Select your repository (`pronzzz/firewordle`).
    -   This will automatically generate a service account key and save it to your GitHub Repository Secrets.

**Secrets Required:**
If setting up manually, you need to add the following secret to your GitHub Repo:
-   `FIREBASE_SERVICE_ACCOUNT_FIREWORDLE`

Once set up, any push to `main` triggers:
1.  `npm ci` (Clean Install)
2.  `npm run build` (Vite Build)
3.  Deploy to Firebase Hosting using the service account.
