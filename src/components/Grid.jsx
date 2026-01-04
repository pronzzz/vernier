import React from 'react'
import Row from './Row'

export default function Grid({ currentGuess, guesses, turn }) {
    return (
        <div className="pb-6">
            {guesses.map((g, i) => {
                if (turn === i) {
                    return <Row key={i} currentGuess={currentGuess} />
                }
                return <Row key={i} guess={g} />
            })}
        </div>
    )
}
