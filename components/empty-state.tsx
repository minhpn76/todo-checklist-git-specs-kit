import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

/**
 * EmptyState component displayed when no todos exist
 * Provides a call-to-action to create the first todo
 */
export function EmptyState() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="space-y-4 max-w-sm">
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold tracking-tight">No todos yet</h3>
            <p className="text-muted-foreground">
              Get started by creating your first todo item. Keep track of tasks, ideas, and goals.
            </p>
          </div>
          <Link href="/todos/new">
            <Button size="lg" className="mt-4">
              Create Your First Todo
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
