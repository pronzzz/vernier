import React from 'react'
import Tile from './Tile'

export default function Row({ guess, currentGuess }) {

    if (guess) {
        return (
            <div className="flex justify-center gap-1 mb-1">
                {guess.map((l, i) => (
                    <Tile key={i} letter={l.key} color={l.color} delay={i * 0.1} />
                ))}
            </div>
        )
    }

    if (currentGuess) {
        let letters = currentGuess.split('')

        return (
            <div className="flex justify-center gap-1 mb-1">
                {letters.map((letter, i) => (
                    <Tile key={i} letter={letter} />
                ))}
                {[...Array(5 - letters.length)].map((_, i) => (
                    <Tile key={i} />
                ))}
            </div>
        )
    }

    return (
        <div className="flex justify-center gap-1 mb-1">
            <Tile />
            <Tile />
            <Tile />
            <Tile />
            <Tile />
        </div>
    )
}
