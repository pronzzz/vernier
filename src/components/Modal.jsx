import React from 'react'

export default function Modal({ isCorrect, turn, solution, close }) {
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 p-10 rounded-lg shadow-xl dark:shadow-gray-900/50 max-w-sm w-full text-center animate-bounce">
                {isCorrect && (
                    <div>
                        <h1 className="text-2xl font-bold mb-4 dark:text-white">You Win!</h1>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            You found the solution <span className="text-wordle-green font-bold uppercase">{solution}</span> in {turn} guesses :)
                        </p>
                    </div>
                )}
                {!isCorrect && (
                    <div>
                        <h1 className="text-2xl font-bold mb-4 dark:text-white">Unlucky!</h1>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            The solution was <span className="text-wordle-green font-bold uppercase">{solution}</span>.
                        </p>
                    </div>
                )}
                <button
                    onClick={close}
                    className="bg-wordle-green hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    )
}
