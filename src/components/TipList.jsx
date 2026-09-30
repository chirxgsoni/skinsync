/**
 * Tip list — shows do's (check icon) or don'ts (X icon).
 */
import { Check, X } from 'lucide-react'

export default function TipList({ items = [], type = 'do' }) {
  if (!items.length) return null

  const Icon = type === 'do' ? Check : X
  const iconColor = type === 'do' ? 'text-sage' : 'text-brick'
  const iconBg = type === 'do' ? 'bg-sage/10' : 'bg-brick/10'

  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className={`flex-shrink-0 w-6 h-6 rounded-full ${iconBg} flex items-center justify-center mt-0.5`}>
            <Icon size={14} className={iconColor} />
          </span>
          <span className="text-sm text-espresso leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  )
}
