import React, { useEffect, useState } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import useWordle from './hooks/useWordle'
import useStats from './hooks/useStats'
import Header from './components/Header'
import Grid from './components/Grid'
import Keyboard from './components/Keyboard'
import Modal from './components/Modal'
import SOLUTIONS from './data/solutions.json'

function Game() {
  const [solution, setSolution] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const { stats, logWin, logLoss } = useStats()

  // Pick a random word on mount or load from storage
  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem('firewordle_state'))
    if (savedState && savedState.solution) {
      setSolution(savedState.solution)
    } else {
      const random = SOLUTIONS[Math.floor(Math.random() * SOLUTIONS.length)]
      setSolution(random)
    }
  }, [])

  const handleGameEnd = (isWin) => {
    if (isWin) {
      logWin()
      setTimeout(() => setShowModal(true), 2000)
    } else {
      logLoss()
      setTimeout(() => setShowModal(true), 2000)
    }
  }

  const { currentGuess, guesses, turn, isCorrect, usedKeys, handleKeyup, isInvalid } = useWordle(solution, handleGameEnd)

  // Handle Physical Keyboard
  useEffect(() => {
    const handleWindowKeyup = (e) => {
      handleKeyup({ key: e.key })
    }

    if (solution) {
      window.addEventListener('keyup', handleWindowKeyup)
    }

    // Stop listening if game is over
    if (isCorrect || turn > 5) {
      window.removeEventListener('keyup', handleWindowKeyup)
    }

    return () => window.removeEventListener('keyup', handleWindowKeyup)
  }, [handleKeyup, isCorrect, turn, solution])

  // NOTE: showModal logic moved to handleGameEnd callback to avoid double triggers/renders
  // But we need to keep the "turn > 5" check if user refreshes on a finished game?
  // Current implementation of useWordle saves isCorrect/turn.
  // We can just rely on the modal state? 
  // For V2 let's rely on handleGameEnd call.
  // HOWEVER, on refresh, if game is over, we might want to show modal?
  // Let's add a check on mount/update:
  useEffect(() => {
    if (solution && (isCorrect || turn > 5)) {
      // If we reload and game is done, show modal immediately (or after delay)
      // But avoid re-logging stats.
      // Since stats are only logged on transition, we are safe.
      setShowModal(true)
    }
  }, [isCorrect, turn, solution])


  // Handle Virtual Keyboard
  const handleVirtualKey = (key) => {
    handleKeyup({ key })
  }

  // Reload game
  const resetGame = () => {
    localStorage.removeItem('firewordle_state')
    setSolution(null) // trigger re-pick
    const random = SOLUTIONS[Math.floor(Math.random() * SOLUTIONS.length)]
    setSolution(random)
    window.location.reload() // simple reload for now cleaning state
  }

  if (!solution) return null

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Header stats={stats} />

      <div className="flex-grow flex flex-col justify-between p-2">
        <div className="flex-grow flex items-center justify-center">
          <Grid currentGuess={currentGuess} guesses={guesses} turn={turn} isInvalid={isInvalid} />
        </div>

        <Keyboard usedKeys={usedKeys} onKey={handleVirtualKey} />
      </div>

      {showModal && <Modal isCorrect={isCorrect} turn={turn} solution={solution} close={resetGame} stats={stats} />}
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
