import { inRange, type Range } from '../game/engine'
import { BackIcon, EnterIcon } from './icons'

const ROWS = ['abcdefghi', 'jklmnopqr', 'stuvwxyz']

/** An alphabetical keyboard that fades letters that no longer fit the slot being typed. */
export function Keyboard({ range, onKey }: { range: Range | null; onKey: (key: string) => void }) {
  const press = (key: string) => (e: Event) => {
    e.preventDefault()
    onKey(key)
  }
  // Keep focus where it is so a later Enter on the hardware keyboard never re-clicks a key.
  const keep = (e: Event) => e.preventDefault()

  const letter = (ch: string, first: boolean) => {
    const out = range && !inRange(ch, range)
    const exact = range && range.lo === range.hi && inRange(ch, range)
    return (
      <button key={ch} type="button" class={`key${first ? ' is-first' : ''}${out ? ' is-out' : ''}${exact ? ' is-exact' : ''}`} onMouseDown={keep} onClick={press(ch)} aria-label={ch.toUpperCase()}>
        {ch}
      </button>
    )
  }

  return (
    <div class="kb" role="group" aria-label="Keyboard">
      {ROWS[0].split('').map((ch, i) => letter(ch, i === 0))}
      {ROWS[1].split('').map((ch, i) => letter(ch, i === 0))}
      <button type="button" class="key" onMouseDown={keep} onClick={press('Enter')} aria-label="Enter">
        <EnterIcon />
      </button>
      {ROWS[2].split('').map((ch) => letter(ch, false))}
      <button type="button" class="key" onMouseDown={keep} onClick={press('Backspace')} aria-label="Delete">
        <BackIcon />
      </button>
    </div>
  )
}
