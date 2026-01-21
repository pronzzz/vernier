import React from 'react'
import { useTheme } from '../context/ThemeContext'
import { Moon, Sun } from '@phosphor-icons/react'

export default function Header({ stats }) {
    const { theme, toggleTheme } = useTheme()

    return (
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 w-full max-w-lg mx-auto">
            <div className="flex items-center w-20">
                {stats && stats.currentStreak > 0 && (
                    <div className="flex items-center space-x-1 animate-pulse text-orange-500 font-bold">
                        <span>🔥</span>
                        <span>{stats.currentStreak}</span>
                    </div>
                )}
            </div>
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
