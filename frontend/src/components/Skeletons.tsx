export function CardSkeleton({ className = '' }: { className?: string }) {
  return <div className={`rounded-xl border h-64 bg-gray-100 overflow-hidden ${className}`}>
    <div className="h-40 bg-gray-200 animate-pulse" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/5 animate-pulse" />
      <div className="h-3 bg-gray-200 rounded w-4/5 animate-pulse" />
      <div className="h-3 bg-gray-200 rounded w-2/5 animate-pulse" />
    </div>
  </div>;
}

export function LineSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
      ))}
    </div>
  );
}

