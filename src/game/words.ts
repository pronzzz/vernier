import answersRaw from '../words/answers.txt?raw'

const unpack = (s: string) => {
  const out: string[] = []
  for (let i = 0; i < s.length; i += 5) out.push(s.slice(i, i + 5))
  return out
}

export const ANSWERS = unpack(answersRaw.trim())
const answerSet = new Set(ANSWERS)

// The longer list of guessable words loads in its own chunk after first paint.
let allowed: Set<string> | null = null
const loading = import('../words/allowed.txt?raw').then((m) => {
  allowed = new Set(unpack(m.default.trim()))
  return allowed
})

export async function isWord(word: string) {
  if (answerSet.has(word)) return true
  return (allowed ?? (await loading)).has(word)
}
