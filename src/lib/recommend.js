/**
 * Recommendation engine for SkinSync.
 * Deterministic lookup — no runtime AI calls.
 */

import rules from '../data/rules.json'
import { ruleKey } from './classify'

/**
 * Get the full recommendation object for a given depth level and undertone.
 *
 * @param {number} monkLevel - Monk skin tone level 1-10
 * @param {string} undertone - 'cool' | 'neutral' | 'warm' | 'olive'
 * @returns {object|null} Recommendation object or null if not found
 */
export function getRecommendation(monkLevel, undertone) {
  const key = ruleKey(monkLevel, undertone)
  return rules[key] || null
}

/**
 * Get the rule key string for saving to the database.
 * Re-exported for convenience.
 */
export { ruleKey }

/**
 * Get all available rule keys (for admin/debug purposes).
 * @returns {string[]}
 */
export function getAllRuleKeys() {
  return Object.keys(rules)
}
