import React, { useEffect } from 'react'

export default function Keyboard({ usedKeys, onKey }) {
    const keys = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['Del', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Enter']
    ]

    return (
        <div className="pb-8">
            {keys.map((row, i) => (
                <div key={i} className="flex justify-center gap-1.5 my-1.5 touch-manipulation">
                    {row.map((key) => {
                        const extraClass = usedKeys[key] ? usedKeys[key] : '' // e.g. 'green'

                        // Map the simple color names to full Tailwind classes if needed
                        // But usedKeys stores 'wordle-green', 'wordle-yellow' etc from the hook

                        // We need to map 'wordle-green' to 'bg-wordle-green' etc.
                        let colorClass = 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                        if (usedKeys[key] === 'wordle-green') {
                            colorClass = 'bg-wordle-green text-white'
                        } else if (usedKeys[key] === 'wordle-yellow') {
                            colorClass = 'bg-wordle-yellow text-white'
                        } else if (usedKeys[key] === 'wordle-gray') {
                            colorClass = 'bg-wordle-gray text-white'
                        }

                        // Handle special keys width
                        let widthClass = "w-10"
                        if (key === 'Enter' || key === 'Del') {
                            widthClass = "w-16 px-2 text-sm"
                        }

                        return (
                            <button
                                key={key}
                                onClick={() => {
                                    if (key === 'Del') onKey('Backspace')
                                    else onKey(key)
                                }}
                                className={`${widthClass} ${colorClass} h-14 rounded font-bold uppercase cursor-pointer transition-all active:scale-95 select-none`}
                            >
                                {key}
                            </button>
                        )
                    })}
                </div>
            ))}
        </div>
    )
}
