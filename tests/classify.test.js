import { describe, it, expect } from 'vitest'
import { classifyDepth, classifyUndertone, depthGroup, ruleKey } from '../src/lib/classify'
import { rgbToLab, hexToRgb } from '../src/lib/color'
import monk from '../src/data/monk.json'

describe('Classification (classify.js)', () => {
  it('correctly classifies exact Monk swatch hex codes to their respective levels', () => {
    monk.forEach((item) => {
      const lab = rgbToLab(hexToRgb(item.hex))
      const { level } = classifyDepth(lab)
      expect(level).toBe(item.level)
    })
  })

  it('correctly maps Monk levels to depth groups', () => {
    expect(depthGroup(1)).toBe('fair')
    expect(depthGroup(2)).toBe('fair')
    expect(depthGroup(3)).toBe('fair')
    expect(depthGroup(4)).toBe('light-medium')
    expect(depthGroup(5)).toBe('light-medium')
    expect(depthGroup(6)).toBe('tan')
    expect(depthGroup(7)).toBe('tan')
    expect(depthGroup(8)).toBe('deep')
    expect(depthGroup(9)).toBe('deep')
    expect(depthGroup(10)).toBe('deep')
  })

  it('generates proper rule keys', () => {
    expect(ruleKey(1, 'cool')).toBe('fair-cool')
    expect(ruleKey(5, 'neutral')).toBe('light-medium-neutral')
    expect(ruleKey(6, 'warm')).toBe('tan-warm')
    expect(ruleKey(9, 'olive')).toBe('deep-olive')
  })

  it('classifies undertone based on hue angle and a* balance', () => {
    // Cool: hue < 50
    expect(classifyUndertone({ L: 60, a: 15, b: 12 })).toBe('cool')

    // Neutral: hue 50-60
    expect(classifyUndertone({ L: 60, a: 12, b: 17 })).toBe('neutral')

    // Warm: hue 60-68
    expect(classifyUndertone({ L: 60, a: 10, b: 20 })).toBe('warm')

    // Olive: hue >= 68 with low a* (less red)
    expect(classifyUndertone({ L: 60, a: 6, b: 22 })).toBe('olive')
  })
})
