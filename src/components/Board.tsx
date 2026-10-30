import { MAX_GUESSES, WORD_LENGTH, score, type Mark } from '../game/engine'
import { Chevron } from './icons'

export function Tile({ ch, mark, i = 0, reveal, caret }: { ch?: string; mark?: Mark; i?: number; reveal?: boolean; caret?: boolean }) {
  const done = mark !== undefined
  const cls = ['tile', ch && !done && 'is-typed', caret && 'is-caret', done && 'is-done', mark === 0 && 'is-exact', mark === 1 && 'is-later', mark === -1 && 'is-earlier', reveal && 'is-reveal']
  return (
    <div class={cls.filter(Boolean).join(' ')} style={{ '--i': i }}>
      {ch}
      {mark ? <Chevron dir={mark} /> : null}
    </div>
  )
}

export function Row({ word, answer, reveal, win, shake, rowRef, caret }: { word: string; answer?: string; reveal?: boolean; win?: boolean; shake?: number; rowRef?: (el: HTMLDivElement | null) => void; caret?: number }) {
  const marks = answer ? score(word, answer) : null
  return (
    <div ref={rowRef} class={`row${shake ? ' is-shaking' : ''}${win ? ' is-win' : ''}`}>
      {Array.from({ length: WORD_LENGTH }, (_, i) => (
        <Tile key={i} i={i} ch={word[i]} mark={marks?.[i]} reveal={reveal} caret={caret === i} />
      ))}
    </div>
  )
}

interface BoardProps {
  guesses: string[]
  answer: string
  input: string
  fresh: number
  won: boolean
  showWin: boolean
  shake: number
  playing: boolean
  winRowRef: (el: HTMLDivElement | null) => void
}

export function Board({ guesses, answer, input, fresh, won, showWin, shake, playing, winRowRef }: BoardProps) {
  return (
    <div class="board" role="grid" aria-label="Guesses">
      {Array.from({ length: MAX_GUESSES }, (_, r) => {
        if (r < guesses.length) {
          const isWinRow = won && r === guesses.length - 1
          return <Row key={r} word={guesses[r]} answer={answer} reveal={r === fresh} win={isWinRow && showWin} rowRef={isWinRow ? winRowRef : undefined} />
        }
        if (r === guesses.length && playing) {
          return <Row key={`${r}-${shake}`} word={input} shake={shake} caret={input.length < WORD_LENGTH ? input.length : undefined} />
        }
        return <Row key={r} word="" />
      })}
    </div>
  )
}
