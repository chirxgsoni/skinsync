/**
 * Palette chip row — displays color swatches with text names.
 * Used for blush, lip, and highlighter recommendations.
 */
export default function PaletteChipRow({ label, items = [] }) {
  if (!items.length) return null

  return (
    <div className="mb-4">
      <p className="text-sm font-medium text-cocoa mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-white border border-sand text-espresso"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
