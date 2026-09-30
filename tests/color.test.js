import { describe, it, expect } from 'vitest'
import { rgbToLab, ita, hue, hexToRgb, labDistance } from '../src/lib/color'

describe('Color Science (color.js)', () => {
  it('converts pure white [255, 255, 255] to CIELAB L ~100, a ~0, b ~0', () => {
    const lab = rgbToLab([255, 255, 255])
    expect(lab.L).toBeCloseTo(100, 0)
    expect(lab.a).toBeCloseTo(0, 0)
    expect(lab.b).toBeCloseTo(0, 0)
  })

  it('converts pure black [0, 0, 0] to CIELAB L ~0', () => {
    const lab = rgbToLab([0, 0, 0])
    expect(lab.L).toBeCloseTo(0, 1)
  })

  it('converts hex to RGB accurately', () => {
    expect(hexToRgb('#ffffff')).toEqual([255, 255, 255])
    expect(hexToRgb('#000000')).toEqual([0, 0, 0])
    expect(hexToRgb('#f6ede4')).toEqual([246, 237, 228])
  })

  it('calculates ITA with lower values for deeper skin', () => {
    const fairSkin = { L: 75, a: 10, b: 20 }
    const deepSkin = { L: 35, a: 12, b: 18 }
    expect(ita(fairSkin)).toBeGreaterThan(ita(deepSkin))
  })

  it('calculates hue angle correctly', () => {
    const warmSkin = { a: 10, b: 20 } // b > a -> atan2 > 45 deg
    const coolSkin = { a: 20, b: 10 } // a > b -> atan2 < 45 deg
    expect(hue(warmSkin)).toBeGreaterThan(hue(coolSkin))
  })

  it('calculates Euclidean distance in LAB space', () => {
    const c1 = { L: 50, a: 10, b: 10 }
    const c2 = { L: 53, a: 14, b: 10 }
    // hypot(3, 4, 0) = 5
    expect(labDistance(c1, c2)).toBeCloseTo(5, 4)
  })
})
