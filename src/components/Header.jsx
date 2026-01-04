import React from 'react'
import { useTheme } from '../context/ThemeContext'
import { Moon, Sun } from '@phosphor-icons/react'

export default function Header() {
    const { theme, toggleTheme } = useTheme()

    return (
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 w-full max-w-lg mx-auto">
            <div className="w-8"></div> {/* Spacer for center alignment */}
            <h1 className="text-3xl font-bold tracking-wider dark:text-white uppercase font-serif">FireWordle</h1>
            <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                aria-label="Toggle Theme"
            >
                {theme === 'light' ?
                    <Moon size={24} weight="fill" className="text-gray-700" /> :
                    <Sun size={24} weight="fill" className="text-yellow-400" />
                }
            </button>
        </header>
    )
}
