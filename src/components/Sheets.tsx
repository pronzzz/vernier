import { MAX_GUESSES } from '../game/engine'
import { liveStreak, type Stats } from '../game/storage'
import { Row, Tile } from './Board'
import { Sheet } from './Sheet'
import { Counter } from './effects'
import { Countdown, share, shareText, type SavedGame } from './Game'
import { ShareIcon } from './icons'

export type Theme = 'system' | 'light' | 'dark'

interface HelpProps {
  open: boolean
  onClose: () => void
  strict: boolean
  strictLocked: boolean
  setStrict: (v: boolean) => void
  theme: Theme
  setTheme: (t: Theme) => void
}

export function HelpSheet({ open, onClose, strict, strictLocked, setStrict, theme, setTheme }: HelpProps) {
  const themes: Theme[] = ['system', 'light', 'dark']
  return (
    <Sheet open={open} onClose={onClose} title="How to play">
      <p>Find the hidden five-letter word in six guesses.</p>
      <p>Each letter you play points toward its hidden letter in the alphabet: left toward A, right toward Z.</p>
      <Row word="crane" answer="chart" />
      <ul class="legend">
        <li>
          <Tile ch="c" mark={0} /> Exact. C is in the right place.
        </li>
        <li>
          <Tile ch="r" mark={-1} /> The hidden letter comes earlier, somewhere from A to Q.
        </li>
        <li>
          <Tile ch="n" mark={1} /> The hidden letter comes later, somewhere from O to Z.
        </li>
      </ul>
      <h3>The scale</h3>
      <p>Under the board, five rulers show what each letter can still be. The keyboard dims letters that no longer fit the slot you are typing.</p>
      <h3>Options</h3>
      <div class="option">
        <div>
          <strong>Strict</strong>
          <span>{strictLocked ? 'Change it before your first guess.' : 'Every guess must fit the known ranges.'}</span>
        </div>
        <button type="button" role="switch" class="switch" aria-checked={strict} aria-label="Strict mode" disabled={strictLocked} onClick={() => setStrict(!strict)} />
      </div>
      <div class="option">
        <div>
          <strong>Theme</strong>
        </div>
        <div class="seg" style={{ '--n': 3, '--i': themes.indexOf(theme) }}>
          <span class="seg-thumb" />
          {themes.map((t) => (
            <button type="button" key={t} aria-pressed={theme === t} onClick={() => setTheme(t)}>
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <p class="foot">
        A new daily word arrives at midnight, wherever you are. Practice has no limit. Made by{' '}
        <a href="https://pronzzz.vercel.app" target="_blank" rel="noopener">
          Pranav Dwivedi
        </a>
        {' · '}
        <a href="https://github.com/pronzzz/vernier" target="_blank" rel="noopener">
          Source
        </a>
      </p>
    </Sheet>
  )
}

interface StatsProps {
  open: boolean
  onClose: () => void
  stats: Stats
  puzzle: number
  today: SavedGame | null
  toast: (m: string) => void
}

export function StatsSheet({ open, onClose, stats, puzzle, today, toast }: StatsProps) {
  const winPct = stats.played ? Math.round((stats.wins / stats.played) * 100) : 0
  const max = Math.max(1, ...stats.dist)
  const done = today && (today.guesses.at(-1) === today.answer || today.guesses.length >= MAX_GUESSES)
  const todayRow = done && today.guesses.at(-1) === today.answer ? today.guesses.length - 1 : -1
  return (
    <Sheet open={open} onClose={onClose} title="Statistics">
      {open && (
        <>
          <div class="numbers">
            <div>
              <b>
                <Counter value={stats.played} />
              </b>
              <span>Played</span>
            </div>
            <div>
              <b>
                <Counter value={winPct} />
              </b>
              <span>Win %</span>
            </div>
            <div>
              <b>
                <Counter value={liveStreak(stats, puzzle)} />
              </b>
              <span>Streak</span>
            </div>
            <div>
              <b>
                <Counter value={stats.best} />
              </b>
              <span>Best</span>
            </div>
          </div>
          <h3>Guesses</h3>
          <div class="dist">
            {stats.dist.map((n, i) => (
              <div key={i}>
                <span>{i + 1}</span>
                <i class={i === todayRow ? 'is-today' : ''} style={{ '--w': `${(n / max) * 100}%`, '--i': i }}>
                  {n}
                </i>
              </div>
            ))}
          </div>
          <div class="next">
            <Countdown label="Next" />
            {done && (
              <button type="button" class="btn is-primary" onClick={() => share(shareText('daily', puzzle, today), toast)}>
                <ShareIcon /> Share
              </button>
            )}
          </div>
        </>
      )}
    </Sheet>
  )
}
