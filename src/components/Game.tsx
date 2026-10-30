import { useEffect, useMemo, useRef, useState } from 'preact/hooks'
import { MAX_GUESSES, WORD_LENGTH, describe, ranges, shareGrid, strictProblem } from '../game/engine'
import { dailyAnswer, msUntilTomorrow, randomAnswer } from '../game/daily'
import { load, save } from '../game/storage'
import { isWord } from '../game/words'
import { Board } from './Board'
import { Keyboard } from './Keyboard'
import { Scale } from './Scale'
import { Scramble, burst, useNow } from './effects'
import { NextIcon, ShareIcon, StatsIcon } from './icons'

export type Mode = 'daily' | 'practice'

export interface SavedGame {
  answer: string
  guesses: string[]
  strict: boolean
}

const REVEAL_MS = WORD_LENGTH * 110 + 500
const PRAISE = ['Dead on.', 'Precise.', 'Sharp.', 'Well measured.', 'Close tolerance.', 'Just in range.']

export const gameKey = (mode: Mode, puzzle: number) => (mode === 'daily' ? `daily:${puzzle}` : 'practice')

export function loadGame(mode: Mode, puzzle: number, strict: boolean): SavedGame {
  const answer = mode === 'daily' ? dailyAnswer(puzzle) : randomAnswer()
  const saved = load<SavedGame>(gameKey(mode, puzzle), { answer, guesses: [], strict })
  if (mode === 'daily') saved.answer = answer
  if (!saved.guesses.length) saved.strict = strict
  return saved
}

export function shareText(mode: Mode, puzzle: number, game: SavedGame) {
  const won = game.guesses.at(-1) === game.answer
  const head = `Vernier ${mode === 'daily' ? `No. ${puzzle}` : 'Practice'} ${won ? game.guesses.length : 'X'}/${MAX_GUESSES}${game.strict ? '*' : ''}`
  return `${head}\n${shareGrid(game.guesses, game.answer)}\n${location.origin}`
}

export async function share(text: string, toast: (m: string) => void) {
  try {
    if (navigator.share && matchMedia('(pointer: coarse)').matches) {
      await navigator.share({ text })
      return
    }
    await navigator.clipboard.writeText(text)
    toast('Copied to clipboard')
  } catch (e) {
    if ((e as Error).name !== 'AbortError') toast('Could not share')
  }
}

interface Props {
  mode: Mode
  puzzle: number
  strictPref: boolean
  paused: boolean
  toast: (msg: string, ms?: number) => void
  onDailyEnd: (won: boolean, guesses: number) => void
  openStats: () => void
}

export function Game({ mode, puzzle, strictPref, paused, toast, onDailyEnd, openStats }: Props) {
  const key = gameKey(mode, puzzle)
  const [game, setGame] = useState(() => loadGame(mode, puzzle, strictPref))
  const { answer, guesses } = game
  const [input, setInputState] = useState('')
  const [fresh, setFresh] = useState(-1)
  // Refs mirror state so fast key sequences never read a value from before the last render.
  const inputRef = useRef('')
  const busy = useRef(false)
  const live = useRef(game)
  live.current = game
  const setInput = (v: string) => {
    inputRef.current = v
    setInputState(v)
  }
  const [shake, setShake] = useState(0)
  const [announce, setAnnounce] = useState('')
  const won = guesses.at(-1) === answer
  const over = won || guesses.length >= MAX_GUESSES
  const [showResult, setShowResult] = useState(over)
  const winRow = useRef<HTMLDivElement | null>(null)
  const known = useMemo(() => ranges(guesses, answer), [guesses, answer])
  const active = over || input.length >= WORD_LENGTH ? -1 : input.length

  useEffect(() => save(key, game), [game])

  // Strict mode can change freely until the first guess of a game.
  useEffect(() => {
    if (!game.guesses.length && game.strict !== strictPref) setGame((g) => ({ ...g, strict: strictPref }))
  }, [strictPref])

  const reject = (msg: string) => {
    setShake((s) => s + 1)
    toast(msg)
    navigator.vibrate?.(24)
  }

  const finish = (all: string[]) => {
    const didWin = all.at(-1) === answer
    if (didWin) {
      toast(PRAISE[all.length - 1], 2200)
      setTimeout(() => {
        const r = winRow.current?.getBoundingClientRect()
        if (r) burst(r.left + r.width / 2, r.top + r.height / 2, 18)
      }, 250)
    } else if (all.length >= MAX_GUESSES) {
      toast(answer.toUpperCase(), 3200)
    } else return
    if (mode === 'daily') onDailyEnd(didWin, all.length)
    setTimeout(() => setShowResult(true), didWin ? 1100 : 900)
  }

  const submit = async () => {
    const input = inputRef.current
    const { guesses, answer } = live.current
    const known = ranges(guesses, answer)
    if (input.length < WORD_LENGTH) return reject('Five letters, please')
    if (guesses.includes(input)) return reject('Already measured')
    if (live.current.strict) {
      const problem = strictProblem(input, known)
      if (problem) return reject(problem)
    }
    busy.current = true
    if (!(await isWord(input))) {
      busy.current = false
      return reject('Not in the word list')
    }
    const all = [...guesses, input]
    live.current = { ...live.current, guesses: all }
    setGame(live.current)
    setFresh(all.length - 1)
    setInput('')
    setShake(0)
    setAnnounce(`Guess ${all.length}: ${describe(input, answer)}`)
    setTimeout(() => {
      busy.current = false
      finish(all)
    }, REVEAL_MS)
  }

  const onKey = (k: string) => {
    const g = live.current
    if (busy.current || g.guesses.at(-1) === g.answer || g.guesses.length >= MAX_GUESSES) return
    const s = inputRef.current
    if (k === 'Enter') submit()
    else if (k === 'Backspace') setInput(s.slice(0, -1))
    else if (/^[a-z]$/i.test(k) && s.length < WORD_LENGTH) setInput(s + k.toLowerCase())
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (paused || e.metaKey || e.ctrlKey || e.altKey) return
      const el = document.activeElement as HTMLElement | null
      const onControl = !!el?.closest?.('button, a')
      if (e.key === 'Enter' && onControl) return // let a focused button do its job
      if (e.key === 'Backspace' || /^[a-z]$/i.test(e.key)) {
        // Typing means playing: drop focus from any button so the next Enter submits the guess.
        if (onControl) el!.blur()
      }
      if (e.key === 'Enter' || e.key === 'Backspace' || /^[a-z]$/i.test(e.key)) {
        e.preventDefault()
        onKey(e.key)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  const nextWord = () => {
    setGame({ answer: randomAnswer(answer), guesses: [], strict: strictPref })
    setInput('')
    setFresh(-1)
    setShowResult(false)
  }

  return (
    <main class="stage">
      <Board
        guesses={guesses}
        answer={answer}
        input={input}
        fresh={fresh}
        won={won}
        showWin={fresh === guesses.length - 1 && showResult}
        shake={shake}
        playing={!over}
        winRowRef={(el) => (winRow.current = el)}
      />
      <Scale known={known} input={over ? '' : input} guesses={guesses} active={active} />
      {showResult && over ? (
        <Result mode={mode} puzzle={puzzle} game={game} won={won} toast={toast} openStats={openStats} nextWord={nextWord} />
      ) : (
        <Keyboard range={active >= 0 ? known[active] : null} onKey={onKey} />
      )}
      <p class="sr-only" aria-live="polite">
        {announce}
      </p>
    </main>
  )
}

function Result({ mode, puzzle, game, won, toast, openStats, nextWord }: { mode: Mode; puzzle: number; game: SavedGame; won: boolean; toast: (m: string) => void; openStats: () => void; nextWord: () => void }) {
  const n = game.guesses.length
  return (
    <section class="result" aria-live="polite">
      {won ? (
        <h2>
          Calibrated in <em>{n}</em>.
        </h2>
      ) : (
        <h2>Out of range.</h2>
      )}
      <div class="answer">
        <Scramble text={game.answer} delay={150} />
      </div>
      <div class="actions">
        <button type="button" class="btn is-primary" onClick={() => share(shareText(mode, puzzle, game), toast)}>
          <ShareIcon /> Share
        </button>
        {mode === 'daily' ? (
          <button type="button" class="btn" onClick={openStats}>
            <StatsIcon /> Stats
          </button>
        ) : (
          <button type="button" class="btn" onClick={nextWord}>
            Next word <NextIcon />
          </button>
        )}
      </div>
      {mode === 'daily' && <Countdown />}
    </section>
  )
}

export function Countdown({ label = 'Next word in' }: { label?: string }) {
  const now = useNow()
  const ms = msUntilTomorrow(now)
  const t = [ms / 3.6e6, (ms / 6e4) % 60, (ms / 1e3) % 60].map((v) => String(Math.floor(v)).padStart(2, '0')).join(':')
  return (
    <p class="meta">
      {label} <span class="clock" style={{ fontSize: '0.8rem' }}>{t}</span>
    </p>
  )
}
