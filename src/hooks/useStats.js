import { useState, useEffect } from 'react'

const useStats = () => {
    const [stats, setStats] = useState({
        currentStreak: 0,
        maxStreak: 0,
        wins: 0,
        gamesPlayed: 0,
        lastPlayed: null
    })

    useEffect(() => {
        const savedStats = JSON.parse(localStorage.getItem('firewordle_stats'))
        if (savedStats) {
            // Check if streak should be reset (if missed a day)
            // For now, simpler logic: verify lastPlayed is yesterday or today.
            // If older, reset currentStreak.
            const today = new Date().setHours(0,0,0,0)
            const last = savedStats.lastPlayed ? new Date(savedStats.lastPlayed).setHours(0,0,0,0) : 0
            
            if (today - last > 86400000) {
                 savedStats.currentStreak = 0;
            }
            setStats(savedStats)
        }
    }, [])

    const saveStats = (newStats) => {
        localStorage.setItem('firewordle_stats', JSON.stringify(newStats))
        setStats(newStats)
    }

    const logWin = () => {
        const newStats = { ...stats }
        newStats.gamesPlayed += 1
        newStats.wins += 1
        newStats.currentStreak += 1
        if (newStats.currentStreak > newStats.maxStreak) {
            newStats.maxStreak = newStats.currentStreak
        }
        newStats.lastPlayed = new Date().toISOString()
        saveStats(newStats)
    }

    const logLoss = () => {
        const newStats = { ...stats }
        newStats.gamesPlayed += 1
        newStats.currentStreak = 0
        newStats.lastPlayed = new Date().toISOString()
        saveStats(newStats)
    }

    return { stats, logWin, logLoss }
}

export default useStats
