export default function DashboardLoading() {
  return (
    <div className="w-full space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="h-10 w-24 bg-muted animate-pulse rounded" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-6 border rounded-lg space-y-3">
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            <div className="h-8 w-32 bg-muted animate-pulse rounded" />
          </div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4 p-6 border rounded-lg space-y-4">
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          <div className="h-48 w-full bg-muted animate-pulse rounded" />
        </div>
        <div className="lg:col-span-3 p-6 border rounded-lg space-y-4">
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-4 w-full bg-muted animate-pulse rounded"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
