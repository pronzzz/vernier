import React from 'react'

export default function Tile({ letter, color, delay = 0 }) {
    const baseClasses = "w-14 h-14 border-2 flex items-center justify-center text-3xl font-bold uppercase select-none transition-all duration-500"

    // Dynamic classes based on color/status
    let colorClasses = "border-gray-200 dark:border-gray-600 dark:text-gray-100" // default empty
    let animationClasses = ""

    if (letter) {
        colorClasses = "border-gray-400 dark:border-gray-400 text-black dark:text-gray-100 animate-pop"
    }

    if (color === 'wordle-green') {
        colorClasses = "bg-wordle-green border-wordle-green text-white"
        animationClasses = "animate-flip"
    }
    if (color === 'wordle-yellow') {
        colorClasses = "bg-wordle-yellow border-wordle-yellow text-white"
        animationClasses = "animate-flip"
    }
    if (color === 'wordle-gray') {
        colorClasses = "bg-wordle-gray border-wordle-gray text-white"
        animationClasses = "animate-flip"
    }

    const style = {
        animationDelay: `${delay}s`
    }

    return (
        <div className={`${baseClasses} ${colorClasses} ${animationClasses}`} style={style}>
            {letter}
        </div>
    )
}
