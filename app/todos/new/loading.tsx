/**
 * Loading state for new todo page
 */
export default function Loading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-3xl mx-auto py-8 px-4">
        <div className="space-y-6">
          {/* Header skeleton */}
          <div className="space-y-4">
            <div className="h-8 w-32 bg-muted animate-pulse rounded" />
            <div className="h-10 w-64 bg-muted animate-pulse rounded" />
          </div>

          {/* Form skeleton */}
          <div className="bg-card border rounded-lg p-6 space-y-6">
            <div className="space-y-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              <div className="h-10 bg-muted animate-pulse rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-32 bg-muted animate-pulse rounded" />
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-32 bg-muted animate-pulse rounded" />
              <div className="h-10 w-24 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
