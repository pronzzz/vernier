import { ALPHABET, inRange, type Range } from '../game/engine'

/** The signature piece: one ruler per slot, A on the left, Z on the right. */
export function Scale({ known, input, guesses, active }: { known: Range[]; input: string; guesses: string[]; active: number }) {
  return (
    <section class="scale" aria-label="What each letter can still be">
      {known.map((r, i) => {
        const ch = input[i]
        const locked = r.lo === r.hi
        const lo = ALPHABET[r.lo].toUpperCase()
        const hi = ALPHABET[r.hi].toUpperCase()
        const tried = [...new Set(guesses.map((g) => g.charCodeAt(i) - 97))]
        return (
          <div key={i} class={`ruler${i === active ? ' is-active' : ''}${locked ? ' is-locked' : ''}`} aria-label={`Letter ${i + 1}: ${locked ? lo : `${lo} to ${hi}`}`}>
            <span aria-hidden="true">{i + 1}</span>
            <div class="ruler-track" aria-hidden="true">
              <div class="ruler-band" style={{ '--lo': r.lo, '--hi': r.hi }} />
              {tried.map((p) => (
                <i key={p} class="ruler-tried" style={{ '--p': p }} />
              ))}
              {ch && <div class={`ruler-needle${inRange(ch, r) ? '' : ' is-out'}`} style={{ '--p': ch.charCodeAt(0) - 97 }} />}
            </div>
            <span class="ruler-label" aria-hidden="true">
              {locked ? lo : `${lo}–${hi}`}
            </span>
          </div>
        )
      })}
    </section>
  )
}
