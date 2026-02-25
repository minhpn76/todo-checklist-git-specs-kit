/**
 * Loading state for todo detail page
 */
export default function Loading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-3xl mx-auto py-8 px-4">
        <div className="space-y-6">
          {/* Back button skeleton */}
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />

          {/* Card skeleton */}
          <div className="bg-card border rounded-lg">
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-5 w-5 bg-muted animate-pulse rounded" />
                <div className="flex-1 space-y-3">
                  <div className="h-8 w-3/4 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-full bg-muted animate-pulse rounded" />
                  <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
                </div>
              </div>
            </div>
            <div className="px-6 pb-6 space-y-4">
              <div className="h-8 w-32 bg-muted animate-pulse rounded" />
              <div className="pt-4 border-t space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded" />
                <div className="h-4 bg-muted animate-pulse rounded" />
              </div>
              <div className="flex gap-3 pt-4">
                <div className="h-10 w-28 bg-muted animate-pulse rounded" />
                <div className="h-10 w-32 bg-muted animate-pulse rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
