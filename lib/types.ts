/**
 * Core todo item entity
 */
export interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  createdAt: string // ISO 8601 format
  updatedAt: string // ISO 8601 format
}

/**
 * Input type for creating a new todo (without auto-generated fields)
 */
export type CreateTodoInput = Pick<Todo, "title" | "description">

/**
 * Input type for updating an existing todo (all fields optional)
 */
export type UpdateTodoInput = Partial<Pick<Todo, "title" | "description" | "completed">>

/**
 * Filter/query parameters for listing todos
 */
export interface TodoFilters {
  completed?: boolean // Filter by completion status
  search?: string // Search in title and description
}

/**
 * Sort options for todo list
 */
export type TodoSortField = "createdAt" | "updatedAt" | "title"
export type TodoSortOrder = "asc" | "desc"

export interface TodoSort {
  field: TodoSortField
  order: TodoSortOrder
}
