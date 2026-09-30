import { useEffect } from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

/**
 * Accessible toast notification component.
 * Displays at the bottom on mobile, top-right on desktop.
 *
 * @param {object} props
 * @param {string} props.message - Toast message
 * @param {'success' | 'error' | 'info'} [props.type='success'] - Toast variant
 * @param {() => void} props.onClose - Dismiss callback
 * @param {number} [props.duration=4000] - Auto-close delay in ms (0 to disable)
 */
export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    if (!duration || !onClose) return
    const timer = setTimeout(() => {
      onClose()
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!message) return null

  const icons = {
    success: <CheckCircle size={18} className="text-sage flex-shrink-0" />,
    error: <AlertCircle size={18} className="text-brick flex-shrink-0" />,
    info: <Info size={18} className="text-plum flex-shrink-0" />,
  }

  const borderColors = {
    success: 'border-sage/30',
    error: 'border-brick/30',
    info: 'border-plum/30',
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed z-50 bottom-4 inset-x-4 sm:inset-x-auto sm:top-5 sm:right-5 sm:bottom-auto max-w-sm w-full no-print"
    >
      <div
        className={`flex items-center gap-3 p-4 rounded-xl bg-white shadow-lg border ${borderColors[type] || 'border-sand'} animate-fade-in`}
      >
        {icons[type]}
        <p className="text-sm font-medium text-espresso flex-1 leading-snug">{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close notification"
            className="text-cocoa/50 hover:text-cocoa cursor-pointer p-1 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
