import { useState, useEffect } from 'react'

const useWordle = (solution) => {
    const [turn, setTurn] = useState(0)
    const [currentGuess, setCurrentGuess] = useState('')
    const [guesses, setGuesses] = useState([...Array(6)]) // each guess is an array of formatted letters
    const [history, setHistory] = useState([]) // each guess is a string
    const [isCorrect, setIsCorrect] = useState(false)
    const [usedKeys, setUsedKeys] = useState({}) // {a: 'green', b: 'yellow', c: 'grey'}

    // format a guess into an array of letter objects 
    // e.g. [{key: 'a', color: 'yellow'}]
    const formatGuess = () => {
        let solutionArray = [...solution]
        let formattedGuess = [...currentGuess].map((l) => {
            return { key: l, color: 'wordle-gray' } // default to gray
        })

        // find any green letters
        formattedGuess.forEach((l, i) => {
            if (solution[i] === l.key) {
                formattedGuess[i].color = 'wordle-green'
                solutionArray[i] = null
            }
        })

        // find any yellow letters
        formattedGuess.forEach((l, i) => {
            if (l.color !== 'wordle-green' && solutionArray.includes(l.key)) {
                formattedGuess[i].color = 'wordle-yellow'
                solutionArray[solutionArray.indexOf(l.key)] = null
            }
        })

        return formattedGuess
    }

    // add a new guess to the guesses state
    // update the isCorrect state if the guess is correct
    // add one to the turn state
    const addNewGuess = (formattedGuess) => {
        if (currentGuess === solution) {
            setIsCorrect(true)
        }
        setGuesses((prevGuesses) => {
            let newGuesses = [...prevGuesses]
            newGuesses[turn] = formattedGuess
            return newGuesses
        })
        setHistory((prevHistory) => {
            return [...prevHistory, currentGuess]
        })
        setTurn((prevTurn) => {
            return prevTurn + 1
        })
        setUsedKeys((prevUsedKeys) => {
            let newKeys = { ...prevUsedKeys }

            formattedGuess.forEach((l) => {
                const currentColor = newKeys[l.key]

                if (l.color === 'wordle-green') {
                    newKeys[l.key] = 'wordle-green'
                    return
                }
                if (l.color === 'wordle-yellow' && currentColor !== 'wordle-green') {
                    newKeys[l.key] = 'wordle-yellow'
                    return
                }
                if (l.color === 'wordle-gray' && currentColor !== 'wordle-green' && currentColor !== 'wordle-yellow') {
                    newKeys[l.key] = 'wordle-gray'
                    return
                }
            })

            return newKeys
        })
        setCurrentGuess('')
    }

    // handle keyup event & track current guess
    // if user presses enter, add the new guess
    const handleKeyup = ({ key }) => {
        if (key === 'Enter') {
            // only add guess if turn is less than 5
            if (turn > 5) {
                // console.log('you used all your guesses')
                return
            }
            // do not allow duplicate words
            if (history.includes(currentGuess)) {
                // console.log('you already tried that word')
                return
            }
            // check word is 5 chars long
            if (currentGuess.length !== 5) {
                // console.log('word must be 5 chars long')
                return
            }
            const formatted = formatGuess()
            addNewGuess(formatted)
        }
        if (key === 'Backspace') {
            setCurrentGuess((prev) => {
                return prev.slice(0, -1)
            })
            return
        }
        if (/^[A-Za-z]$/.test(key)) {
            if (currentGuess.length < 5) {
                setCurrentGuess((prev) => {
                    return prev + key
                })
            }
        }
    }

    // Load from local storage on mount
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('firewordle_state'))
        if (saved) {
            // Check if the solution matches (if we want to ensure consistency) - simplified for now
            // Actually we just load the state. 
            // NOTE: If solution changed in App but we load old guesses, it's bad.
            // So we will assume App handles clearing state if solution changes (e.g. new game)
            // OR we check if saved.solution === solution
            if (saved.solution === solution) {
                setTurn(saved.turn)
                setGuesses(saved.guesses)
                setHistory(saved.history)
                setIsCorrect(saved.isCorrect)
                setUsedKeys(saved.usedKeys)
            }
        }
    }, [solution])

    // Save to local storage whenever state changes
    useEffect(() => {
        if (!solution) return

        localStorage.setItem('firewordle_state', JSON.stringify({
            solution,
            turn,
            guesses,
            history,
            isCorrect,
            usedKeys
        }))
    }, [turn, guesses, history, isCorrect, usedKeys, solution])

    return { turn, currentGuess, guesses, isCorrect, usedKeys, handleKeyup }
}

export default useWordle
