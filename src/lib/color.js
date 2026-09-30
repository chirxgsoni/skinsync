/**
 * Color science utilities for SkinSync.
 * Converts sRGB to CIELAB and computes derived skin metrics.
 *
 * Reference white: D65 illuminant.
 */

/** Linearise a single sRGB channel (0-255) → linear (0-1) */
const lin = (c) => {
  c /= 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

/**
 * Convert an [R, G, B] (0-255) array to CIELAB { L, a, b }.
 * @param {number[]} rgb - [R, G, B] each 0–255
 * @returns {{ L: number, a: number, b: number }}
 */
export function rgbToLab([r, g, b]) {
  const R = lin(r), G = lin(g), B = lin(b)

  // sRGB → XYZ (D65)
  const X = (R * 0.4124 + G * 0.3576 + B * 0.1805) / 0.95047
  const Y = (R * 0.2126 + G * 0.7152 + B * 0.0722)
  const Z = (R * 0.0193 + G * 0.1192 + B * 0.9505) / 1.08883

  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116)

  return {
    L: 116 * f(Y) - 16,
    a: 500 * (f(X) - f(Y)),
    b: 200 * (f(Y) - f(Z)),
  }
}

/**
 * Individual Typology Angle — lower value → deeper skin.
 * @param {{ L: number, b: number }} lab
 * @returns {number}
 */
export const ita = ({ L, b }) => (Math.atan((L - 50) / b) * 180) / Math.PI

/**
 * Hue angle in degrees — higher → warmer/yellower, lower → pinker/cooler.
 * @param {{ a: number, b: number }} lab
 * @returns {number}
 */
export const hue = ({ a, b }) => (Math.atan2(b, a) * 180) / Math.PI

/**
 * Convert a hex string (e.g. "#f6ede4") to an [R, G, B] array.
 * @param {string} hex
 * @returns {number[]}
 */
export function hexToRgb(hex) {
  const h = hex.replace('#', '')
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ]
}

/**
 * Euclidean distance between two LAB colours.
 * @param {{ L: number, a: number, b: number }} lab1
 * @param {{ L: number, a: number, b: number }} lab2
 * @returns {number}
 */
export function labDistance(lab1, lab2) {
  return Math.hypot(lab1.L - lab2.L, lab1.a - lab2.a, lab1.b - lab2.b)
}

/**
 * Sample a square patch of pixels from a canvas and return the
 * per-channel median RGB (rejects highlights and blemishes).
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - center x
 * @param {number} y - center y
 * @param {number} size - patch side length in pixels (default 12)
 * @returns {number[]} [R, G, B]
 */
export function samplePatch(ctx, x, y, size = 12) {
  const half = Math.floor(size / 2)
  const { data } = ctx.getImageData(x - half, y - half, size, size)
  const px = []
  for (let i = 0; i < data.length; i += 4) {
    px.push([data[i], data[i + 1], data[i + 2]])
  }
  const med = (c) => {
    const sorted = px.map((p) => p[c]).sort((a, b) => a - b)
    return sorted[Math.floor(sorted.length / 2)]
  }
  return [med(0), med(1), med(2)]
}
