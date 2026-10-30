import { MAX_GUESSES } from './engine'

const PREFIX = 'vernier:'

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback
  } catch {
    return fallback
  }
}

export function save(key: string, value: unknown) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    /* private mode or storage full: the game still works, it just forgets */
  }
}

export interface Stats {
  played: number
  wins: number
  streak: number
  best: number
  lastWon: number // puzzle number of the last daily win
  lastPlayed: number
  dist: number[] // wins by guess count
}

export const emptyStats = (): Stats => ({
  played: 0,
  wins: 0,
  streak: 0,
  best: 0,
  lastWon: 0,
  lastPlayed: 0,
  dist: Array(MAX_GUESSES).fill(0),
})

export function recordDaily(stats: Stats, puzzle: number, won: boolean, guesses: number): Stats {
  if (stats.lastPlayed === puzzle) return stats
  const next = { ...stats, dist: [...stats.dist], played: stats.played + 1, lastPlayed: puzzle }
  if (won) {
    next.wins++
    next.dist[guesses - 1]++
    next.streak = stats.lastWon === puzzle - 1 ? stats.streak + 1 : 1
    next.best = Math.max(next.best, next.streak)
    next.lastWon = puzzle
  } else {
    next.streak = 0
  }
  return next
}

/** A streak only survives if yesterday (or today) was won. */
export const liveStreak = (s: Stats, today: number) => (s.lastWon >= today - 1 ? s.streak : 0)
