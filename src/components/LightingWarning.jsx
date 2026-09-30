/**
 * Lighting warning banner — amber with retake button.
 */
import { AlertTriangle } from 'lucide-react'
import Button from './Button'

export default function LightingWarning({ message, onRetake }) {
  return (
    <div
      className="flex items-start gap-3 p-4 rounded-xl bg-amber/10 border border-amber/30"
      role="alert"
      aria-live="polite"
    >
      <AlertTriangle size={20} className="text-amber flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-amber">{message}</p>
      </div>
      {onRetake && (
        <Button variant="secondary" onClick={onRetake} className="text-xs !px-3 !py-1.5 !min-h-[36px]">
          Retake
        </Button>
      )}
    </div>
  )
}
