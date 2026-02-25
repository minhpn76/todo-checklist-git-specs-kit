import { TodoItem } from "@/components/todo-item"
import { EmptyState } from "@/components/empty-state"
import type { Todo } from "@/lib/types"

interface TodoListProps {
  todos: Todo[]
  onToggleComplete?: (id: string, completed: boolean) => void
  onDelete?: (id: string) => void
  isLoading?: boolean
  isDeleting?: boolean
}

/**
 * TodoList component displays a list of todo items
 * Shows empty state when no todos exist
 */
export function TodoList({
  todos,
  onToggleComplete,
  onDelete,
  isLoading,
  isDeleting,
}: TodoListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 bg-muted animate-pulse rounded-lg"
            aria-label="Loading todo items"
          />
        ))}
      </div>
    )
  }

  if (todos.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  )
}
