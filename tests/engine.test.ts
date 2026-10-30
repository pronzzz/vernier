import { describe, expect, it } from 'vitest'
import { ranges, score, shareGrid, strictProblem } from '../src/game/engine'
import { recordDaily, emptyStats, liveStreak } from '../src/game/storage'
import { dayNumber, dailyAnswer } from '../src/game/daily'
import { ANSWERS } from '../src/game/words'

describe('score', () => {
  it('points each slot toward the hidden letter', () => {
    expect(score('crane', 'plumb')).toEqual([1, -1, 1, -1, -1])
    expect(score('plumb', 'plumb')).toEqual([0, 0, 0, 0, 0])
  })
  it('treats repeated letters independently per slot', () => {
    expect(score('eerie', 'geese')).toEqual([1, 0, -1, 1, 0])
  })
})

describe('ranges', () => {
  it('narrows every slot', () => {
    const r = ranges(['mmmmm'], 'aazzm')
    expect(r[0]).toEqual({ lo: 0, hi: 11 })
    expect(r[2]).toEqual({ lo: 13, hi: 25 })
    expect(r[4]).toEqual({ lo: 12, hi: 12 })
  })
  it('stays consistent with the answer', () => {
    for (const answer of ANSWERS.slice(0, 200)) {
      const r = ranges(['crane', 'moist', 'pudgy'], answer)
      ;[...answer].forEach((ch, i) => {
        const c = ch.charCodeAt(0) - 97
        expect(c >= r[i].lo && c <= r[i].hi).toBe(true)
      })
    }
  })
})

describe('strict mode', () => {
  it('names the first slot that breaks a known bound', () => {
    const known = ranges(['mmmmm'], 'aazzm')
    expect(strictProblem('zzzzm', known)).toBe('Slot 1 sits between A and L')
    expect(strictProblem('aazza', known)).toBe('Slot 5 is M')
    expect(strictProblem('aazzm', known)).toBeNull()
  })
})

describe('share grid', () => {
  it('uses plain glyphs', () => {
    expect(shareGrid(['crane', 'plumb'], 'plumb')).toBe('▸◂▸◂◂\n■■■■■')
  })
})

describe('daily', () => {
  it('starts at #1 on launch day and is stable', () => {
    expect(dayNumber(new Date(2026, 9, 31, 23, 59))).toBe(1)
    expect(dayNumber(new Date(2026, 10, 1, 0, 1))).toBe(2)
    expect(dailyAnswer(5)).toBe(dailyAnswer(5))
    expect(new Set(Array.from({ length: 365 }, (_, i) => dailyAnswer(i + 1))).size).toBe(365)
  })
})

describe('stats', () => {
  it('builds and breaks streaks', () => {
    let s = emptyStats()
    s = recordDaily(s, 1, true, 3)
    s = recordDaily(s, 2, true, 4)
    expect(s.streak).toBe(2)
    expect(recordDaily(s, 2, true, 4)).toBe(s) // no double counting
    s = recordDaily(s, 4, true, 2)
    expect(s.streak).toBe(1)
    expect(s.best).toBe(2)
    expect(liveStreak(s, 6)).toBe(0)
    s = recordDaily(s, 5, false, 6)
    expect(s.streak).toBe(0)
    expect(s.dist).toEqual([0, 1, 1, 1, 0, 0])
  })
})
