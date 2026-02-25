"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DeleteConfirmation } from "@/components/delete-confirmation"
import { useTodo, useUpdateTodo, useDeleteTodo } from "@/lib/hooks/use-todos"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import { cn } from "@/lib/utils"

/**
 * Todo Detail Page
 * Displays full details of a single todo item
 */
export default function TodoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { toast } = useToast()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { data: todo, isLoading, error } = useTodo(id)
  const updateTodo = useUpdateTodo()
  const deleteTodo = useDeleteTodo()

  const handleToggleComplete = (checked: boolean) => {
    updateTodo.mutate({ id, data: { completed: checked } })
  }

  const handleDelete = async () => {
    try {
      await deleteTodo.mutateAsync(id)
      toast({
        title: "Success",
        description: "Todo deleted successfully",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive",
      })
      setShowDeleteDialog(false)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container max-w-3xl mx-auto py-8 px-4">
          <div className="space-y-4">
            <div className="h-10 w-32 bg-muted animate-pulse rounded" />
            <div className="h-64 bg-muted animate-pulse rounded-lg" />
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container max-w-3xl mx-auto py-8 px-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              ← Back to List
            </Button>
          </Link>
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Error Loading Todo</CardTitle>
              <CardDescription>{error.message}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/">
                <Button>Return to List</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  if (!todo) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-3xl mx-auto py-4 sm:py-8 px-4">
        {/* Header */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-3 sm:mb-4 -ml-2">
              ← Back to List
            </Button>
          </Link>
        </div>

        {/* Todo Details Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <Checkbox
                id="completed"
                checked={todo.completed}
                onCheckedChange={handleToggleComplete}
                className="mt-1"
              />
              <div className="flex-1">
                <CardTitle
                  className={cn("text-2xl", todo.completed && "line-through text-muted-foreground")}
                >
                  {todo.title}
                </CardTitle>
                {todo.description && (
                  <CardDescription className="mt-2 text-base whitespace-pre-wrap">
                    {todo.description}
                  </CardDescription>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
                    todo.completed
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  )}
                >
                  {todo.completed ? "Completed" : "Active"}
                </span>
              </div>

              {/* Metadata */}
              <div className="pt-4 border-t space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span>{formatDateTime(todo.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated:</span>
                  <span>{formatDateTime(todo.updatedAt)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link href={`/todos/${todo.id}/edit`} className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Edit Todo
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="w-full sm:w-auto"
                >
                  Back to List
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                  className="w-full sm:w-auto"
                >
                  Delete Todo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmation
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={handleDelete}
          title="Delete Todo?"
          description="This action cannot be undone. This will permanently delete this todo item."
          isDeleting={deleteTodo.isPending}
        />
      </div>
    </main>
  )
}
