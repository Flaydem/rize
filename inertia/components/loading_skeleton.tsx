export function CardSkeleton() {
  return (
    <div className="bg-nb-surface rounded-xl border border-nb-border p-5 animate-pulse">
      <div className="h-5 bg-nb-border-light rounded w-3/4 mb-3" />
      <div className="h-4 bg-nb-border rounded w-full mb-2" />
      <div className="flex gap-2 mt-3">
        <div className="h-5 bg-nb-border rounded w-16" />
        <div className="h-5 bg-nb-border rounded w-16" />
      </div>
    </div>
  )
}

export function PageSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}
