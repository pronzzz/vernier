// Renders the PNG icons and the social card from HTML with the system Chrome.
// Usage: npm run assets
import puppeteer from 'puppeteer-core'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pub = join(root, 'public')
// Inlined as data URLs: a page set with setContent cannot load file:// fonts.
const font = (pkg, file) => `data:font/woff2;base64,${readFileSync(join(root, 'node_modules/@fontsource-variable', pkg, 'files', file)).toString('base64')}`

const chrome = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].find((p) => p && existsSync(p))
if (!chrome) throw new Error('Set CHROME_PATH to a Chrome or Chromium binary')

const fonts = `
@font-face { font-family: Serif; font-style: italic; font-weight: 200 800; src: url(${font('newsreader', 'newsreader-latin-wght-italic.woff2')}); }
@font-face { font-family: Serif; font-style: normal; font-weight: 200 800; src: url(${font('newsreader', 'newsreader-latin-wght-normal.woff2')}); }
@font-face { font-family: GMono; font-weight: 100 900; src: url(${font('geist-mono', 'geist-mono-latin-wght-normal.woff2')}) format('woff2'); }
* { margin: 0; box-sizing: border-box; }
`

const icon = (size, pad) => `<html><head><style>${fonts}
body { width: ${size}px; height: ${size}px; background: ${pad ? '#002fa7' : 'transparent'}; display: grid; place-items: center; }
.mark { width: ${pad ? size * 0.72 : size}px; height: ${pad ? size * 0.72 : size}px; border-radius: ${pad ? 0 : size * 0.23}px; background: #002fa7; position: relative; display: grid; place-items: center; }
.v { font: italic 500 ${size * (pad ? 0.5 : 0.7)}px/1 Serif; color: #f2efe6; transform: translateY(-${size * 0.06}px); }
.ticks { position: absolute; left: 18%; right: 18%; bottom: 16%; height: ${size * 0.1}px; background: linear-gradient(to right, transparent calc(50% - ${size * 0.012}px), #f2efe6 0 calc(50% + ${size * 0.012}px), transparent 0) bottom / calc(100% / 7) 55% repeat-x; }
.ticks::after { content: ''; position: absolute; left: calc(50% - ${size * 0.016}px); width: ${size * 0.032}px; bottom: 0; top: -40%; background: #f2efe6; border-radius: 9px; }
</style></head><body><div class="mark"><span class="v">v</span><div class="ticks"></div></div></body></html>`

const tile = (ch, m) => `<div class="t ${m === 0 ? 'x' : m === 1 ? 'r' : 'l'}">${ch}${m ? `<svg viewBox="0 0 10 10"><path d="${m < 0 ? 'M6.5 1.5L3 5l3.5 3.5' : 'M3.5 1.5L7 5 3.5 8.5'}"/></svg>` : ''}</div>`
const score = (g, a) => [...g].map((c, i) => (a[i] === c ? 0 : a[i] > c ? 1 : -1))
const row = (g, a) => `<div class="row">${[...g].map((c, i) => tile(c, score(g, a)[i])).join('')}</div>`

const og = `<html><head><style>${fonts}
body { width: 1200px; height: 630px; background: #f2efe6; color: #16181d; padding: 80px 88px; display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 40px; font-family: Serif; }
h1 { font: italic 500 150px/0.9 Serif; letter-spacing: -0.03em; }
h1 i { display: inline-block; width: 26px; height: 26px; border-radius: 50%; background: #002fa7; margin-left: 6px; }
p { font: 400 38px/1.25 Serif; color: #3b3d44; margin-top: 28px; max-width: 520px; }
small { display: block; font: 500 20px GMono; letter-spacing: 0.08em; text-transform: uppercase; color: #85816f; margin-top: 44px; }
.board { display: grid; gap: 10px; }
.row { display: grid; grid-template-columns: repeat(5, 78px); gap: 10px; }
.t { position: relative; height: 78px; border-radius: 14px; border: 2px solid #d8d2c1; background: #faf8f2; display: grid; place-items: center; font: 600 34px GMono; text-transform: uppercase; }
.t.r { background: linear-gradient(to right, #faf8f2 45%, #dfe1ec); }
.t.l { background: linear-gradient(to left, #faf8f2 45%, #dfe1ec); }
.t.x { background: #002fa7; border-color: #002fa7; color: #f7f5ee; }
.t svg { position: absolute; top: 50%; width: 20px; height: 20px; translate: 0 -50%; fill: none; stroke: #002fa7; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
.t.l svg { left: 2px; } .t.r svg { right: 2px; }
.ruler { height: 16px; margin-top: 18px; position: relative; background: linear-gradient(to right, transparent calc(50% - 1px), #c9c2ae 0 calc(50% + 1px), transparent 0) bottom / calc(100% / 26) 55% repeat-x; }
.ruler b { position: absolute; inset: 0 auto 0 calc(100% / 26 * 3); width: calc(100% / 26 * 7); background: #002fa722; border-bottom: 3px solid #002fa7; border-radius: 4px; }
</style></head><body>
<div><h1>Vernier<i></i></h1><p>A daily word game of bounds. Every guess points toward the answer.</p><small>Five letters · six guesses · A to Z</small></div>
<div class="board">${row('crane', 'chart')}${row('cloth', 'chart')}${row('chart', 'chart')}<div class="ruler"><b></b></div></div>
</body></html>`

const browser = await puppeteer.launch({ executablePath: chrome, headless: true })
const page = await browser.newPage()
const shot = async (html, w, h, file, transparent = false) => {
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 })
  await page.setContent(html, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: join(pub, file), omitBackground: transparent })
  console.log('wrote', file)
}
await shot(icon(32, false), 32, 32, 'favicon-32.png', true)
await shot(icon(180, true), 180, 180, 'apple-touch-icon.png')
await shot(icon(192, false), 192, 192, 'icon-192.png', true)
await shot(icon(512, false), 512, 512, 'icon-512.png', true)
await shot(icon(512, true), 512, 512, 'icon-maskable.png')
await shot(og, 1200, 630, 'og.png')
await browser.close()
