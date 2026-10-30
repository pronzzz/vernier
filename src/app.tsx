import { useEffect, useRef, useState } from 'preact/hooks'
import { dayNumber, msUntilTomorrow } from './game/daily'
import { emptyStats, load, recordDaily, save } from './game/storage'
import { Game, loadGame, type Mode } from './components/Game'
import { HelpSheet, StatsSheet, type Theme } from './components/Sheets'
import { HelpIcon, StatsIcon, ThemeIcon } from './components/icons'
import { Scramble } from './components/effects'

interface Prefs {
  theme: Theme
  strict: boolean
  seenHelp: boolean
  mode: Mode
}

const resolved = (t: Theme) => (t === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : t)

function applyTheme(t: Theme) {
  const root = document.documentElement
  if (t === 'system') root.removeAttribute('data-theme')
  else root.dataset.theme = t
  const color = getComputedStyle(root).getPropertyValue('--bg').trim()
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color)
}

const dateLabel = (d: Date) => d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })

export function App() {
  const [prefs, setPrefs] = useState<Prefs>(() => load('prefs', { theme: 'system', strict: false, seenHelp: false, mode: 'daily' }))
  const [puzzle, setPuzzle] = useState(dayNumber)
  const [stats, setStats] = useState(() => load('stats', emptyStats()))
  const [sheet, setSheet] = useState<'help' | 'stats' | null>(() => (prefs.seenHelp ? null : 'help'))
  const [toastMsg, setToastMsg] = useState<{ text: string; id: number; leaving?: boolean } | null>(null)
  const toastTimer = useRef(0)
  // Bumped when practice state is reset or strict changes so the sheets re-read storage.
  const [, setTick] = useState(0)

  const update = (p: Partial<Prefs>) =>
    setPrefs((old) => {
      const next = { ...old, ...p }
      save('prefs', next)
      return next
    })

  useEffect(() => applyTheme(prefs.theme), [prefs.theme])

  // Roll over to the next daily word at local midnight, or when the tab wakes up on a new day.
  useEffect(() => {
    const check = () => setPuzzle(dayNumber())
    const t = setTimeout(check, msUntilTomorrow() + 500)
    document.addEventListener('visibilitychange', check)
    return () => {
      clearTimeout(t)
      document.removeEventListener('visibilitychange', check)
    }
  }, [puzzle])

  const toast = (text: string, ms = 1600) => {
    clearTimeout(toastTimer.current)
    const id = Date.now()
    setToastMsg({ text, id })
    toastTimer.current = window.setTimeout(() => {
      setToastMsg((m) => (m && m.id === id ? { ...m, leaving: true } : m))
      toastTimer.current = window.setTimeout(() => setToastMsg((m) => (m && m.id === id ? null : m)), 300)
    }, ms)
  }

  const closeSheet = () => {
    if (sheet === 'help' && !prefs.seenHelp) update({ seenHelp: true })
    setSheet(null)
  }

  const onDailyEnd = (won: boolean, n: number) => {
    setStats((s) => {
      const next = recordDaily(s, puzzle, won, n)
      save('stats', next)
      return next
    })
    setTimeout(() => setSheet((s) => s ?? 'stats'), 2600)
  }

  // Circular reveal from the button when switching theme (View Transitions API).
  const toggleTheme = (e: MouseEvent) => {
    const next: Theme = resolved(prefs.theme) === 'dark' ? 'light' : 'dark'
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } }
    if (!doc.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return update({ theme: next })
    const x = e.clientX || innerWidth - 40
    const y = e.clientY || 30
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    const t = doc.startViewTransition(() => {
      applyTheme(next)
      update({ theme: next })
    })
    t.ready.then(() =>
      document.documentElement.animate(
        { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 520, easing: 'cubic-bezier(.22,1,.36,1)', pseudoElement: '::view-transition-new(root)' },
      ),
    )
  }

  const daily = loadGame('daily', puzzle, prefs.strict)
  const current = loadGame(prefs.mode, puzzle, prefs.strict)
  const modes: Mode[] = ['daily', 'practice']

  return (
    <>
      <div class="grain" aria-hidden="true" />
      <div class="app">
        <header class="top">
          <h1 class="wordmark">
            <Scramble text="Vernier" delay={200} speed={45} />
            <span class="wordmark-dot" aria-hidden="true" />
          </h1>
          <nav class="icons" aria-label="Menu">
            <button type="button" class="icon-btn" onClick={() => setSheet('help')} aria-label="How to play">
              <HelpIcon />
            </button>
            <button type="button" class="icon-btn" onClick={() => setSheet('stats')} aria-label="Statistics">
              <StatsIcon />
            </button>
            <button type="button" class="icon-btn" onClick={toggleTheme} aria-label="Switch theme">
              <ThemeIcon />
            </button>
          </nav>
        </header>
        <div class="modebar">
          <div class="seg" style={{ '--n': 2, '--i': modes.indexOf(prefs.mode) }}>
            <span class="seg-thumb" />
            {modes.map((m) => (
              <button type="button" key={m} aria-pressed={prefs.mode === m} onClick={() => update({ mode: m })}>
                {m === 'daily' ? 'Daily' : 'Practice'}
              </button>
            ))}
          </div>
          <span class="meta">{prefs.mode === 'daily' ? `No. ${String(puzzle).padStart(3, '0')} · ${dateLabel(new Date())}` : 'Unlimited'}</span>
        </div>
        <Game
          key={`${prefs.mode}:${puzzle}`}
          mode={prefs.mode}
          puzzle={puzzle}
          strictPref={prefs.strict}
          paused={sheet !== null}
          toast={toast}
          onDailyEnd={onDailyEnd}
          openStats={() => setSheet('stats')}
        />
      </div>

      <HelpSheet
        open={sheet === 'help'}
        onClose={closeSheet}
        strict={prefs.strict}
        strictLocked={current.guesses.length > 0 && current.guesses.length < 6 && current.guesses.at(-1) !== current.answer}
        setStrict={(v) => {
          update({ strict: v })
          setTick((n) => n + 1)
        }}
        theme={prefs.theme}
        setTheme={(t) => update({ theme: t })}
      />
      <StatsSheet open={sheet === 'stats'} onClose={closeSheet} stats={stats} puzzle={puzzle} today={daily} toast={toast} />

      {toastMsg && (
        <div key={toastMsg.id} class={`toast${toastMsg.leaving ? ' is-leaving' : ''}`} role="status">
          {toastMsg.text}
        </div>
      )}

      <p class="corner is-left">
        <a href="https://pronzzz.vercel.app" target="_blank" rel="noopener">
          Pranav Dwivedi
        </a>{' '}
        / Vernier
      </p>
      <p class="corner is-right">Type · Enter · ⌫</p>
    </>
  )
}
