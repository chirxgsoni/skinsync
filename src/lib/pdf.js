/**
 * PDF generator for HueMatch Bridal Complexion Briefs using jsPDF.
 */
import { jsPDF } from 'jspdf'
import monk from '../data/monk.json'

/**
 * Generates and downloads a beautifully styled A4 PDF of the Complexion Brief.
 *
 * @param {object} data - Brief state data containing monkLevel, monkAlt, undertone, recommendation
 */
export function exportBriefToPdf(data) {
  if (!data || !data.recommendation) return

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const rec = data.recommendation
  const rangeMin = Math.min(data.monkLevel, data.monkAlt)
  const rangeMax = Math.max(data.monkLevel, data.monkAlt)
  const rangeStr = rangeMin === rangeMax ? `Monk ${rangeMin}` : `Monk ${rangeMin}–${rangeMax}`

  const swatch = monk.find((s) => s.level === data.monkLevel) || { hex: '#d7b899' }

  // Dimensions
  const pageWidth = 210
  const margin = 16
  const contentWidth = pageWidth - margin * 2
  let y = 18

  // Header Banner: Plum #5B1A3A
  doc.setFillColor(91, 26, 58)
  doc.rect(margin, y, contentWidth, 24, 'F')

  doc.setTextColor(251, 246, 239) // Ivory
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text('HueMatch Bridal', margin + 6, y + 10)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text('Your Complexion Brief — Enhanced, Not Erased', margin + 6, y + 17)

  y += 30

  // 1. Skin Profile Summary Box
  doc.setFillColor(255, 255, 255)
  doc.setDrawColor(232, 220, 207) // Sand
  doc.setLineWidth(0.5)
  doc.roundedRect(margin, y, contentWidth, 26, 3, 3, 'FD')

  // Swatch square
  const hex = swatch.hex.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  doc.setFillColor(r, g, b)
  doc.rect(margin + 6, y + 5, 16, 16, 'F')
  doc.setDrawColor(224, 165, 38) // Marigold border
  doc.rect(margin + 6, y + 5, 16, 16, 'D')

  // Profile text
  doc.setTextColor(43, 27, 23) // Espresso
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text(`Skin Depth: ${rangeStr}`, margin + 28, y + 11)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(107, 87, 80) // Cocoa
  doc.text(`Undertone: ${data.undertone.toUpperCase()}  |  Reference Swatch: ${swatch.hex.toUpperCase()}`, margin + 28, y + 18)

  y += 32

  // Helper to draw a section
  const drawSection = (title, content, extraText) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(91, 26, 58) // Plum
    doc.text(title, margin, y)
    y += 5

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9.5)
    doc.setTextColor(43, 27, 23)

    const lines = doc.splitTextToSize(content, contentWidth)
    doc.text(lines, margin, y)
    y += lines.length * 4.8

    if (extraText) {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9.5)
      doc.text(extraText, margin, y)
      y += 6
    } else {
      y += 3
    }
  }

  // 2. Foundation Guidance
  drawSection('Foundation Guidance', rec.foundation, `Recommended Shade Range: ${rec.shadeRange}`)

  // 3. Correctors
  drawSection('Color Correctors', rec.correctors)

  // 4. Color Palettes
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(91, 26, 58)
  doc.text('Curated Color Palettes', margin, y)
  y += 5

  const palettes = [
    { label: 'Blush', items: rec.blush },
    { label: 'Lips', items: rec.lips },
    { label: 'Highlighter', items: rec.highlighter },
  ]

  palettes.forEach((p) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9.5)
    doc.setTextColor(107, 87, 80)
    doc.text(`${p.label}:`, margin, y)

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(43, 27, 23)
    doc.text(p.items.join(', '), margin + 24, y)
    y += 5
  })
  y += 3

  // 5. Technique Tips (Must-Dos)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(91, 26, 58)
  doc.text('Pro Application Techniques', margin, y)
  y += 5

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(43, 27, 23)
  rec.techniques.forEach((tech) => {
    const lines = doc.splitTextToSize(`• ${tech}`, contentWidth - 4)
    doc.text(lines, margin + 2, y)
    y += lines.length * 4.5
  })
  y += 3

  // 6. What to Avoid
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(179, 56, 44) // Brick / Error
  doc.text('What to Avoid', margin, y)
  y += 5

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(43, 27, 23)
  rec.avoid.forEach((av) => {
    const lines = doc.splitTextToSize(`✗ ${av}`, contentWidth - 4)
    doc.text(lines, margin + 2, y)
    y += lines.length * 4.5
  })
  y += 3

  // 7. Trial-Day Checklist (if space permits)
  if (y < 255) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(91, 26, 58)
    doc.text('Trial-Day Checklist', margin, y)
    y += 5

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(107, 87, 80)
    const checklist = [
      'Test foundation on jawline AND neck in natural light',
      'Take a flash photo to test for white cast',
      'Confirm setting powder has no chalky residue',
    ]
    checklist.forEach((item) => {
      doc.text(`[ ] ${item}`, margin + 2, y)
      y += 4.5
    })
  }

  // Footer
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text(
    `Generated by HueMatch Bridal — Tested & calibrated against the Monk Skin Tone Scale (Google, CC BY 4.0)`,
    margin,
    287
  )

  doc.save(`HueMatch-Complexion-Brief-${rangeStr.replace(/\s+/g, '-')}.pdf`)
}
