"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Error boundary for home page
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error("Home page error:", error)
  }, [error])

  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Todo List Manager</h1>
            <p className="text-muted-foreground mt-2">
              Organize your tasks and boost your productivity
            </p>
          </div>
        </div>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Something went wrong</CardTitle>
            <CardDescription>
              Unable to load your todos. This might be a temporary issue.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error.message && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded text-sm">
                {error.message}
              </div>
            )}
            <Button onClick={reset}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
