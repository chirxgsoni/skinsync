/**
 * Undertone chip: icon + text label.
 * Meaning is never conveyed by color alone (WCAG compliance).
 */
import { Sun, Snowflake, Leaf, Circle } from 'lucide-react'

const config = {
  cool: { icon: Snowflake, label: 'Cool', bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  neutral: { icon: Circle, label: 'Neutral', bg: 'bg-gray-50', text: 'text-gray-800', border: 'border-gray-200' },
  warm: { icon: Sun, label: 'Warm', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  olive: { icon: Leaf, label: 'Olive', bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200' },
}

export default function UndertoneChip({ undertone, selected = false, onClick }) {
  const c = config[undertone]
  if (!c) return null
  const Icon = c.icon

  return (
    <button
      type="button"
      onClick={() => onClick?.(undertone)}
      aria-label={`${c.label} undertone`}
      aria-pressed={selected}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 cursor-pointer
        ${c.bg} ${c.text} ${c.border}
        ${selected ? 'ring-2 ring-marigold ring-offset-1' : 'hover:shadow-sm'}
      `}
    >
      <Icon size={16} />
      {c.label}
    </button>
  )
}
