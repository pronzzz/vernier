// README screenshots. Start `npm run preview -- --port 4191` first, then: npm run screenshots
import puppeteer from 'puppeteer-core'
import { existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs')
mkdirSync(out, { recursive: true })
const url = process.env.URL || 'http://localhost:4191/'
const chrome = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome'].find((p) => p && existsSync(p))

const browser = await puppeteer.launch({ executablePath: chrome, headless: true })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function capture({ file, width, height, dark, state, typed = '', sheet }) {
  const page = await browser.newPage()
  await page.setViewport({ width, height, deviceScaleFactor: 2 })
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: dark ? 'dark' : 'light' }])
  await page.goto(url, { waitUntil: 'networkidle0' })
  await page.evaluate(async (state) => {
    const prefs = { theme: 'system', strict: false, seenHelp: true, mode: 'daily' }
    localStorage.setItem('vernier:prefs', JSON.stringify(prefs))
    const key = Object.keys(localStorage).find((k) => k.startsWith('vernier:daily:'))
    const answer = JSON.parse(localStorage.getItem(key)).answer
    const guesses = state === 'won' ? ['crane', 'moist', answer] : ['crane', 'moist']
    localStorage.setItem(key, JSON.stringify({ answer, guesses, strict: false }))
    if (state === 'won') localStorage.setItem('vernier:stats', JSON.stringify({ played: 9, wins: 8, streak: 5, best: 6, lastWon: Number(key.split(':')[2]), lastPlayed: Number(key.split(':')[2]), dist: [0, 1, 3, 3, 1, 0] }))
  }, state)
  await page.reload({ waitUntil: 'networkidle0' })
  await sleep(900)
  for (const ch of typed) await page.keyboard.press(ch)
  if (sheet) {
    await page.click(`button[aria-label="${sheet}"]`)
    await sleep(1600)
  }
  await sleep(700)
  await page.screenshot({ path: join(out, file) })
  console.log('wrote', file)
  await page.close()
}

await capture({ file: 'desktop-light.png', width: 1280, height: 860, state: 'playing', typed: 'plu' })
await capture({ file: 'mobile-dark.png', width: 390, height: 844, dark: true, state: 'playing', typed: 'sh' })
await capture({ file: 'mobile-won.png', width: 390, height: 844, state: 'won' })
await capture({ file: 'mobile-help.png', width: 390, height: 844, dark: true, state: 'playing', sheet: 'How to play' })
await capture({ file: 'mobile-stats.png', width: 390, height: 844, state: 'won', sheet: 'Statistics' })
await browser.close()
