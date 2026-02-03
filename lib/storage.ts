import type { Todo, CreateTodoInput, UpdateTodoInput, TodoFilters } from "./types"

/**
 * Storage key for todos in localStorage
 */
const STORAGE_KEY = "todos"

/**
 * Generate a unique ID for a todo item
 * Uses timestamp + random string for uniqueness
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * LocalTodoStorage class provides an abstraction over localStorage
 * for managing todo items. This design allows for easy migration
 * to a remote API in the future.
 */
export class LocalTodoStorage {
  /**
   * Get all todos from localStorage
   */
  private getTodos(): Todo[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return []
      return JSON.parse(stored)
    } catch (error) {
      console.error("Failed to read todos from localStorage:", error)
      return []
    }
  }

  /**
   * Save todos to localStorage
   */
  private saveTodos(todos: Todo[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    } catch (error) {
      console.error("Failed to save todos to localStorage:", error)
      throw new Error("Failed to save todos. Storage may be full.")
    }
  }

  /**
   * List all todos with optional filtering
   */
  list(filters?: TodoFilters): Promise<Todo[]> {
    return new Promise((resolve) => {
      let todos = this.getTodos()

      // Apply completed filter
      if (filters?.completed !== undefined) {
        todos = todos.filter((todo) => todo.completed === filters.completed)
      }

      // Apply search filter
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase()
        todos = todos.filter(
          (todo) =>
            todo.title.toLowerCase().includes(searchLower) ||
            todo.description?.toLowerCase().includes(searchLower)
        )
      }

      // Sort by createdAt descending (newest first)
      todos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      resolve(todos)
    })
  }

  /**
   * Get a single todo by ID
   */
  get(id: string): Promise<Todo | null> {
    return new Promise((resolve) => {
      const todos = this.getTodos()
      const todo = todos.find((t) => t.id === id)
      resolve(todo || null)
    })
  }

  /**
   * Create a new todo
   */
  create(input: CreateTodoInput): Promise<Todo> {
    return new Promise((resolve, reject) => {
      try {
        const now = new Date().toISOString()
        const todo: Todo = {
          id: generateId(),
          title: input.title,
          description: input.description || "",
          completed: false,
          createdAt: now,
          updatedAt: now,
        }

        const todos = this.getTodos()
        todos.push(todo)
        this.saveTodos(todos)

        resolve(todo)
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Update an existing todo
   */
  update(id: string, input: UpdateTodoInput): Promise<Todo> {
    return new Promise((resolve, reject) => {
      try {
        const todos = this.getTodos()
        const index = todos.findIndex((t) => t.id === id)

        if (index === -1) {
          reject(new Error(`Todo with id ${id} not found`))
          return
        }

        const updatedTodo: Todo = {
          ...todos[index],
          ...input,
          updatedAt: new Date().toISOString(),
        }

        todos[index] = updatedTodo
        this.saveTodos(todos)

        resolve(updatedTodo)
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Delete a todo by ID
   */
  delete(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const todos = this.getTodos()
        const filtered = todos.filter((t) => t.id !== id)

        if (filtered.length === todos.length) {
          reject(new Error(`Todo with id ${id} not found`))
          return
        }

        this.saveTodos(filtered)
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Clear all todos (useful for testing)
   */
  clear(): Promise<void> {
    return new Promise((resolve) => {
      localStorage.removeItem(STORAGE_KEY)
      resolve()
    })
  }
}

/**
 * Singleton instance for use across the application
 */
export const todoStorage = new LocalTodoStorage()
