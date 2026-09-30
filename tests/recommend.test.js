import { describe, it, expect } from 'vitest'
import { getRecommendation, getAllRuleKeys } from '../src/lib/recommend'
import rules from '../src/data/rules.json'

describe('Recommendation Engine (recommend.js & rules.json)', () => {
  const depthGroups = ['fair', 'light-medium', 'tan', 'deep']
  const undertones = ['cool', 'neutral', 'warm', 'olive']

  it('contains exactly 16 rules covering all 4 depths x 4 undertones', () => {
    const keys = getAllRuleKeys()
    expect(keys.length).toBe(16)

    depthGroups.forEach((d) => {
      undertones.forEach((u) => {
        const expectedKey = `${d}-${u}`
        expect(rules).toHaveProperty(expectedKey)
      })
    })
  })

  it('each rule has all required fields with non-empty content', () => {
    Object.entries(rules).forEach(([key, rule]) => {
      expect(rule, `Rule ${key} should have label`).toHaveProperty('label')
      expect(typeof rule.label).toBe('string')

      expect(rule, `Rule ${key} should have foundation`).toHaveProperty('foundation')
      expect(typeof rule.foundation).toBe('string')

      expect(rule, `Rule ${key} should have shadeRange`).toHaveProperty('shadeRange')
      expect(typeof rule.shadeRange).toBe('string')

      expect(rule, `Rule ${key} should have correctors`).toHaveProperty('correctors')
      expect(typeof rule.correctors).toBe('string')

      expect(rule, `Rule ${key} should have blush array`).toHaveProperty('blush')
      expect(Array.isArray(rule.blush)).toBe(true)
      expect(rule.blush.length).toBeGreaterThan(0)

      expect(rule, `Rule ${key} should have lips array`).toHaveProperty('lips')
      expect(Array.isArray(rule.lips)).toBe(true)
      expect(rule.lips.length).toBeGreaterThan(0)

      expect(rule, `Rule ${key} should have highlighter array`).toHaveProperty('highlighter')
      expect(Array.isArray(rule.highlighter)).toBe(true)
      expect(rule.highlighter.length).toBeGreaterThan(0)

      expect(rule, `Rule ${key} should have techniques array`).toHaveProperty('techniques')
      expect(Array.isArray(rule.techniques)).toBe(true)
      expect(rule.techniques.length).toBeGreaterThan(0)

      expect(rule, `Rule ${key} should have avoid array`).toHaveProperty('avoid')
      expect(Array.isArray(rule.avoid)).toBe(true)
      expect(rule.avoid.length).toBeGreaterThan(0)
    })
  })

  it('complies with UX guidelines: never suggests lightening or whitening skin', () => {
    const prohibitedWords = ['lighten', 'whiten', 'brighten your tone', 'flawless', 'dark skin problem']

    Object.entries(rules).forEach(([, rule]) => {
      const jsonStr = JSON.stringify(rule).toLowerCase()
      prohibitedWords.forEach((word) => {
        // Exception: avoid list can say "avoid lightening" or "avoid white cast"
        const allowedInAvoidOnly = word === 'lighten' || word === 'whiten'
        if (allowedInAvoidOnly) {
          const positiveGuidance = `${rule.foundation} ${rule.correctors} ${rule.techniques.join(' ')}`.toLowerCase()
          expect(positiveGuidance).not.toContain('lighten')
          expect(positiveGuidance).not.toContain('whiten')
        } else {
          expect(jsonStr).not.toContain(word)
        }
      })
    })
  })

  it('getRecommendation returns valid rule object for monk levels 1-10', () => {
    for (let level = 1; level <= 10; level++) {
      undertones.forEach((u) => {
        const rec = getRecommendation(level, u)
        expect(rec).toBeDefined()
        expect(rec).not.toBeNull()
        expect(rec.foundation).toBeDefined()
      })
    }
  })
})
