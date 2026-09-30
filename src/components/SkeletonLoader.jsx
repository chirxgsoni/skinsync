/**
 * Skeleton loader for content placeholders.
 */
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-sand overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-sand/60" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-sand/60 rounded w-3/4" />
        <div className="h-3 bg-sand/40 rounded w-1/2" />
        <div className="flex gap-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-6 h-6 rounded-full bg-sand/60" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 bg-sand/50 rounded"
          style={{ width: `${90 - i * 15}%` }}
        />
      ))}
    </div>
  )
}
