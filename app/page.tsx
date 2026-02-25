"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TodoList } from "@/components/todo-list"
import { useTodos, useUpdateTodo, useDeleteTodo } from "@/lib/hooks/use-todos"
import { useToast } from "@/hooks/use-toast"
import type { TodoFilters } from "@/lib/types"

type FilterType = "all" | "active" | "completed"

export default function Home() {
  const [filter, setFilter] = useState<FilterType>("all")
  const { toast } = useToast()

  // Convert filter to TodoFilters format
  const filters: TodoFilters = filter === "all" ? {} : { completed: filter === "completed" }

  const { data: todos = [], isLoading, error } = useTodos(filters)
  const updateTodo = useUpdateTodo()
  const deleteTodo = useDeleteTodo()

  useEffect(() => {
    // Initialize MSW in development
    if (process.env.NODE_ENV === "development") {
      import("@/mocks/browser").then(({ startMockServiceWorker }) => {
        startMockServiceWorker()
      })
    }
  }, [])

  const handleToggleComplete = (id: string, completed: boolean) => {
    updateTodo.mutate({ id, data: { completed } })
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo.mutateAsync(id)
      toast({
        title: "Success",
        description: "Todo deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive",
      })
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-4 sm:py-8 px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Todo List Manager</h1>
            <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
              Organize your tasks and boost your productivity
            </p>
          </div>
          <Link href="/todos/new" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto">
              Add Todo
            </Button>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              filter === "all"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              filter === "active"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              filter === "completed"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Completed
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Failed to load todos</p>
            <p className="text-sm">{error.message}</p>
          </div>
        )}

        {/* Todo List */}
        <TodoList
          todos={todos}
          isLoading={isLoading}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDelete}
          isDeleting={deleteTodo.isPending}
        />

        {/* Stats */}
        {!isLoading && todos.length > 0 && (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {todos.filter((t) => t.completed).length} of {todos.length} tasks completed
          </div>
        )}
      </div>
    </main>
  )
}
