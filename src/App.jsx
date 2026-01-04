import React, { useEffect, useState } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import useWordle from './hooks/useWordle'
import Header from './components/Header'
import Grid from './components/Grid'
import Keyboard from './components/Keyboard'
import Modal from './components/Modal'
import { WORDS } from './data/words'

function Game() {
  const [solution, setSolution] = useState(null)
  const [showModal, setShowModal] = useState(false)

  // Pick a random word on mount or load from storage
  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem('firewordle_state'))
    if (savedState && savedState.solution) {
      setSolution(savedState.solution)
    } else {
      const random = WORDS[Math.floor(Math.random() * WORDS.length)]
      setSolution(random)
    }
  }, [])

  const { currentGuess, guesses, turn, isCorrect, usedKeys, handleKeyup } = useWordle(solution)

  // Handle Physical Keyboard
  useEffect(() => {
    const handleWindowKeyup = (e) => {
      handleKeyup({ key: e.key })
    }

    window.addEventListener('keyup', handleWindowKeyup)

    // Stop listening if game is over
    if (isCorrect || turn > 5) {
      window.removeEventListener('keyup', handleWindowKeyup)
    }

    return () => window.removeEventListener('keyup', handleWindowKeyup)
  }, [handleKeyup, isCorrect, turn])

  // Show modal when game ends
  useEffect(() => {
    if (isCorrect) {
      setTimeout(() => setShowModal(true), 2000)
    }
    if (turn > 5) {
      setTimeout(() => setShowModal(true), 2000)
    }
  }, [isCorrect, turn])

  // Handle Virtual Keyboard
  const handleVirtualKey = (key) => {
    // Mimic the event object 
    // If user clicks Enter on virtual keyboard, we pass 'Enter'
    // If user clicks Del, Keyboard component already converts it to 'Backspace'
    // but let's just make sure.
    // In Keyboard.jsx: if (key === 'Del') onKey('Backspace') else onKey(key)
    // So 'key' here is already 'Backspace' or a letter or 'Enter'.
    handleKeyup({ key })
  }

  // Reload game
  const resetGame = () => {
    localStorage.removeItem('firewordle_state')
    setSolution(null)
    window.location.reload()
  }

  if (!solution) return null

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Header />

      <div className="flex-grow flex flex-col justify-between p-2">
        <div className="flex-grow flex items-center justify-center">
          <Grid currentGuess={currentGuess} guesses={guesses} turn={turn} />
        </div>

        <Keyboard usedKeys={usedKeys} onKey={handleVirtualKey} />
      </div>

      {showModal && <Modal isCorrect={isCorrect} turn={turn} solution={solution} close={resetGame} />}
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <Game />
    </ThemeProvider>
  )
}

export default App
