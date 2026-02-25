"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Error boundary for new todo page
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
    console.error("New todo page error:", error)
  }, [error])

  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-3xl mx-auto py-8 px-4">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Something went wrong</CardTitle>
            <CardDescription>An error occurred while loading the create todo page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error.message && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded text-sm">
                {error.message}
              </div>
            )}
            <div className="flex gap-3">
              <Button onClick={reset}>Try Again</Button>
              <Link href="/">
                <Button variant="outline">Back to List</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
