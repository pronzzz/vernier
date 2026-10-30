import { ANSWERS } from './words'

/** Puzzle #1 is 31 October 2026. Days are counted in the player's own time zone. */
const LAUNCH = Date.UTC(2026, 9, 31)
const DAY = 86_400_000

export function dayNumber(now = new Date()) {
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.max(1, Math.floor((today - LAUNCH) / DAY) + 1)
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

let order: number[] | null = null
function shuffled() {
  if (order) return order
  const rand = mulberry32(0x7e41e7)
  order = ANSWERS.map((_, i) => i)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order
}

export const dailyAnswer = (n: number) => ANSWERS[shuffled()[(n - 1) % ANSWERS.length]]

export const randomAnswer = (not?: string) => {
  let w: string
  do w = ANSWERS[Math.floor(Math.random() * ANSWERS.length)]
  while (w === not)
  return w
}

export function msUntilTomorrow(now = new Date()) {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  return next.getTime() - now.getTime()
}
