import { useEffect, useRef, useState } from 'preact/hooks'

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches

/** A burst of sparks from a point, after React Bits' <ClickSpark>. One shared canvas, created on demand. */
let canvas: HTMLCanvasElement | null = null
type Spark = { x: number; y: number; a: number; t: number; len: number; dist: number }
let sparks: Spark[] = []

export function burst(x: number, y: number, count = 14) {
  if (reduced()) return
  if (!canvas) {
    canvas = document.createElement('canvas')
    canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:70'
    document.body.append(canvas)
  }
  const now = performance.now()
  for (let i = 0; i < count; i++) {
    sparks.push({ x, y, a: (Math.PI * 2 * i) / count + Math.random() * 0.3, t: now + Math.random() * 120, len: 10 + Math.random() * 10, dist: 50 + Math.random() * 60 })
  }
  if (sparks.length === count) requestAnimationFrame(draw)
}

function draw(now: number) {
  if (!canvas) return
  const dpr = devicePixelRatio || 1
  if (canvas.width !== innerWidth * dpr) {
    canvas.width = innerWidth * dpr
    canvas.height = innerHeight * dpr
    canvas.style.width = innerWidth + 'px'
    canvas.style.height = innerHeight + 'px'
  }
  const ctx = canvas.getContext('2d')!
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, innerWidth, innerHeight)
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent')
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  sparks = sparks.filter((s) => {
    const p = (now - s.t) / 700
    if (p < 0) return true
    if (p >= 1) return false
    const e = 1 - (1 - p) ** 3
    const d = e * s.dist
    const l = s.len * (1 - e)
    ctx.beginPath()
    ctx.moveTo(s.x + Math.cos(s.a) * d, s.y + Math.sin(s.a) * d)
    ctx.lineTo(s.x + Math.cos(s.a) * (d + l), s.y + Math.sin(s.a) * (d + l))
    ctx.stroke()
    return true
  })
  if (sparks.length) requestAnimationFrame(draw)
  else ctx.clearRect(0, 0, innerWidth, innerHeight)
}

/** Text that decodes itself letter by letter, after React Bits' <DecryptedText>. */
export function Scramble({ text, delay = 0, speed = 40 }: { text: string; delay?: number; speed?: number }) {
  const [shown, setShown] = useState(reduced() ? text : text.replace(/\S/g, ' '))
  useEffect(() => {
    if (reduced()) return setShown(text)
    const pool = 'abcdefghijklmnopqrstuvwxyz'
    let frame = 0
    let timer = 0
    const start = window.setTimeout(() => {
      timer = window.setInterval(() => {
        frame++
        const settled = Math.floor(frame / 3)
        setShown(
          [...text]
            .map((ch, i) => (i < settled || ch === ' ' ? ch : pool[Math.floor(Math.random() * 26)]))
            .join(''),
        )
        if (settled >= text.length) clearInterval(timer)
      }, speed)
    }, delay)
    return () => {
      clearTimeout(start)
      clearInterval(timer)
    }
  }, [text])
  return (
    <span aria-label={text}>
      <span aria-hidden="true">{shown}</span>
    </span>
  )
}

/** Rolling odometer digits, after React Bits' <Counter>. */
export function Counter({ value }: { value: number }) {
  const [v, setV] = useState(0)
  const ref = useRef(0)
  useEffect(() => {
    ref.current = requestAnimationFrame(() => setV(value))
    return () => cancelAnimationFrame(ref.current)
  }, [value])
  const digits = String(v).padStart(String(value).length, '0')
  return (
    <span class="counter" aria-label={String(value)}>
      {[...digits].map((d, i) => (
        <span key={i} style={{ '--d': d }} aria-hidden="true">
          {'0123456789'.split('').map((n) => (
            <span key={n}>{n}</span>
          ))}
        </span>
      ))}
    </span>
  )
}

export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(t)
  }, [intervalMs])
  return now
}
