/**
 * Primary and secondary button component.
 * Pill shape, 48px height, ≥ 44px touch target. WCAG AA contrast.
 */
export default function Button({
  children,
  variant = 'primary',
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 min-h-[48px] min-w-[44px] font-medium text-base transition-all duration-200 ease-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-plum text-ivory hover:bg-mulberry active:scale-[0.97] shadow-sm hover:shadow-md',
    secondary:
      'border-2 border-plum text-plum bg-transparent hover:bg-plum/5 active:scale-[0.97]',
    ghost:
      'text-plum hover:bg-plum/5 underline-offset-2 hover:underline',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
