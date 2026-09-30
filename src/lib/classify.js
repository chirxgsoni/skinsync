/**
 * Skin depth and undertone classification for SkinSync.
 *
 * Depth: nearest-neighbour in CIELAB against the 10 Monk Skin Tone swatches.
 * Undertone: hue-angle thresholds (MUST be calibrated with diverse test photos).
 */

import monk from '../data/monk.json'
import { rgbToLab, hue, hexToRgb, labDistance } from './color'

/**
 * Classify skin depth on the Monk 1-10 scale.
 * Returns primary level and the runner-up to present a range.
 *
 * @param {{ L: number, a: number, b: number }} lab
 * @returns {{ level: number, alt: number }}
 */
export function classifyDepth(lab) {
  let best = { level: 1, d: Infinity }
  let second = { level: 1, d: Infinity }

  for (const s of monk) {
    const monkLab = rgbToLab(hexToRgb(s.hex))
    const d = labDistance(lab, monkLab)

    if (d < best.d) {
      second = { ...best }
      best = { level: s.level, d }
    } else if (d < second.d) {
      second = { level: s.level, d }
    }
  }

  return { level: best.level, alt: second.level }
}

/**
 * Classify skin undertone based on LAB hue angle and a-star/b-star balance.
 *
 * ⚠️ These thresholds are a STARTING POINT.
 * Calibrate with 15-20 volunteers across the full Monk range.
 *
 * @param {{ L: number, a: number, b: number }} lab
 * @returns {'cool' | 'neutral' | 'warm' | 'olive'}
 */
export function classifyUndertone(lab) {
  const h = hue(lab)

  // Olive check: yellow-green leaning with low a* (less redness)
  if (h >= 68 && lab.a < 8) return 'olive'

  if (h < 50) return 'cool'      // pink / red leaning
  if (h < 60) return 'neutral'
  if (h < 68) return 'warm'      // golden / peach
  return 'warm'                   // fallback for high hue with normal a*
}

/**
 * Map a Monk level to a depth group name.
 * @param {number} level - Monk level 1-10
 * @returns {'fair' | 'light-medium' | 'tan' | 'deep'}
 */
export function depthGroup(level) {
  if (level <= 3) return 'fair'
  if (level <= 5) return 'light-medium'
  if (level <= 7) return 'tan'
  return 'deep'
}

/**
 * Build the rule key used to look up recommendations.
 * @param {number} monkLevel
 * @param {string} undertone
 * @returns {string} e.g. "deep-warm"
 */
export function ruleKey(monkLevel, undertone) {
  return `${depthGroup(monkLevel)}-${undertone}`
}
