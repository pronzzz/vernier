/** Rules of Vernier. Pure functions only, so they are easy to test. */

export const WORD_LENGTH = 5
export const MAX_GUESSES = 6
export const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'

/** Feedback for one slot: the hidden letter is earlier (-1), exact (0), or later (1). */
export type Mark = -1 | 0 | 1

export interface Range {
  lo: number // index into ALPHABET, inclusive
  hi: number
}

const idx = (ch: string) => ch.charCodeAt(0) - 97

export function score(guess: string, answer: string): Mark[] {
  return [...guess].map((ch, i) => {
    const a = answer.charCodeAt(i)
    const g = ch.charCodeAt(0)
    return a === g ? 0 : a > g ? 1 : -1
  })
}

export const isWin = (marks: Mark[]) => marks.every((m) => m === 0)

/** What every slot could still be, given the guesses so far. */
export function ranges(guesses: string[], answer: string): Range[] {
  const out: Range[] = Array.from({ length: WORD_LENGTH }, () => ({ lo: 0, hi: 25 }))
  for (const g of guesses) {
    score(g, answer).forEach((m, i) => {
      const r = out[i]
      const c = idx(g[i])
      if (m === 0) r.lo = r.hi = c
      else if (m === 1) r.lo = Math.max(r.lo, c + 1)
      else r.hi = Math.min(r.hi, c - 1)
    })
  }
  return out
}

export const inRange = (ch: string, r: Range) => idx(ch) >= r.lo && idx(ch) <= r.hi

/** In strict mode every letter must sit inside what is already known. */
export function strictProblem(guess: string, known: Range[]): string | null {
  for (let i = 0; i < WORD_LENGTH; i++) {
    const r = known[i]
    if (inRange(guess[i], r)) continue
    const lo = ALPHABET[r.lo].toUpperCase()
    const hi = ALPHABET[r.hi].toUpperCase()
    return r.lo === r.hi ? `Slot ${i + 1} is ${lo}` : `Slot ${i + 1} sits between ${lo} and ${hi}`
  }
  return null
}

export const SHARE_GLYPH: Record<Mark, string> = { [-1]: '◂', 0: '■', 1: '▸' }

export function shareGrid(guesses: string[], answer: string) {
  return guesses.map((g) => score(g, answer).map((m) => SHARE_GLYPH[m]).join('')).join('\n')
}

export function describe(guess: string, answer: string) {
  const words: Record<Mark, string> = { [-1]: 'earlier', 0: 'exact', 1: 'later' }
  return score(guess, answer)
    .map((m, i) => `${guess[i].toUpperCase()} ${words[m]}`)
    .join(', ')
}
