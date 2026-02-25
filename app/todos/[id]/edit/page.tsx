"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TodoForm } from "@/components/todo-form"
import { useTodo, useUpdateTodo } from "@/lib/hooks/use-todos"
import { useToast } from "@/hooks/use-toast"
import type { CreateTodoInput } from "@/lib/types"

/**
 * Edit Todo Page
 * Allows users to modify existing todo title and description
 */
export default function EditTodoPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { toast } = useToast()

  const { data: todo, isLoading, error } = useTodo(id)
  const updateTodo = useUpdateTodo()

  const handleSubmit = async (data: CreateTodoInput) => {
    try {
      await updateTodo.mutateAsync({ id, data })
      toast({
        title: "Success",
        description: "Todo updated successfully",
      })
      router.push(`/todos/${id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    router.push(`/todos/${id}`)
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

  if (error || !todo) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container max-w-3xl mx-auto py-8 px-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              ← Back to List
            </Button>
          </Link>
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">
            <p className="font-medium">Error Loading Todo</p>
            <p className="text-sm">{error?.message || "Todo not found"}</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-3xl mx-auto py-4 sm:py-8 px-4">
        {/* Header */}
        <div className="mb-6">
          <Link href={`/todos/${id}`}>
            <Button variant="ghost" size="sm" className="mb-3 sm:mb-4 -ml-2">
              ← Back to Todo
            </Button>
          </Link>
        </div>

        {/* Edit Form */}
        <TodoForm
          mode="edit"
          initialValues={{
            title: todo.title,
            description: todo.description,
          }}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={updateTodo.isPending}
        />

        {/* Error Display */}
        {updateTodo.isError && (
          <div className="mt-4 bg-destructive/10 text-destructive px-4 py-3 rounded-lg">
            <p className="font-medium">Failed to update todo</p>
            <p className="text-sm">{updateTodo.error.message}</p>
          </div>
        )}
      </div>
    </main>
  )
}
