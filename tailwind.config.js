/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'wordle-green': '#6aaa64',
        'wordle-yellow': '#c9b458',
        'wordle-gray': '#787c7e',
        'wordle-dark-gray': '#3a3a3c',
      },
      animation: {
        'shake': 'shake 0.5s ease-in-out',
        'flip': 'flip 0.5s ease-in-out',
        'bounce': 'bounce 0.5s ease-in-out',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
        flip: {
          '0%': { transform: 'rotateX(0)' },
          '50%': { transform: 'rotateX(90deg)' },
          '100%': { transform: 'rotateX(0)' },
        }
      }
    },
  },
  plugins: [],
}
