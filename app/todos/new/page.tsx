"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TodoForm } from "@/components/todo-form"
import { useCreateTodo } from "@/lib/hooks/use-todos"
import type { CreateTodoInput } from "@/lib/types"

/**
 * New Todo Page
 * Allows users to create a new todo item
 */
export default function NewTodoPage() {
  const router = useRouter()
  const createTodo = useCreateTodo()

  const handleSubmit = async (data: CreateTodoInput) => {
    await createTodo.mutateAsync(data)
    router.push("/")
  }

  const handleCancel = () => {
    router.push("/")
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Create New Todo</h1>
        </div>

        {/* Form */}
        <TodoForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={createTodo.isPending}
        />

        {/* Error Message */}
        {createTodo.isError && (
          <div className="mt-4 bg-destructive/10 text-destructive px-4 py-3 rounded-lg">
            <p className="font-medium">Failed to create todo</p>
            <p className="text-sm">{createTodo.error.message}</p>
          </div>
        )}
      </div>
    </main>
  )
}
