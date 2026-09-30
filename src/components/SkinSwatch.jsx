/**
 * Monk Skin Tone swatch circle.
 * 40px circle with a 3px ring when selected. Includes aria-label for screen readers.
 */
import monk from '../data/monk.json'

export function SkinSwatch({ level, selected = false, onClick, size = 40 }) {
  const swatch = monk.find((s) => s.level === level)
  if (!swatch) return null

  return (
    <button
      type="button"
      onClick={() => onClick?.(level)}
      aria-label={`Monk skin tone level ${level}`}
      aria-pressed={selected}
      className="rounded-full transition-all duration-150 ease-out cursor-pointer hover:scale-110 flex-shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: swatch.hex,
        border: selected ? '3px solid var(--color-marigold)' : '2px solid var(--color-sand)',
        boxShadow: selected ? '0 0 0 2px var(--color-ivory), 0 0 0 4px var(--color-marigold)' : 'none',
      }}
    />
  )
}

/**
 * Row of all 10 Monk swatches with optional selection.
 */
export function SwatchRow({ selectedLevels = [], onSelect, size = 36 }) {
  return (
    <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="Monk skin tone scale">
      {monk.map((s) => (
        <SkinSwatch
          key={s.level}
          level={s.level}
          selected={selectedLevels.includes(s.level)}
          onClick={onSelect}
          size={size}
        />
      ))}
    </div>
  )
}
