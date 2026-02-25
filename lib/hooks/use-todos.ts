"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { Todo, CreateTodoInput, UpdateTodoInput, TodoFilters } from "@/lib/types"

/**
 * Query key factory for todos
 * Helps maintain consistent cache keys across the application
 */
export const todoKeys = {
  all: ["todos"] as const,
  lists: () => [...todoKeys.all, "list"] as const,
  list: (filters?: TodoFilters) => [...todoKeys.lists(), filters] as const,
  details: () => [...todoKeys.all, "detail"] as const,
  detail: (id: string) => [...todoKeys.details(), id] as const,
}

/**
 * Fetch all todos with optional filters
 */
async function fetchTodos(filters?: TodoFilters): Promise<Todo[]> {
  const params = new URLSearchParams()

  if (filters?.completed !== undefined) {
    params.append("completed", String(filters.completed))
  }

  if (filters?.search) {
    params.append("search", filters.search)
  }

  const url = `/api/todos${params.toString() ? `?${params.toString()}` : ""}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch todos")
  }

  return response.json()
}

/**
 * Fetch a single todo by ID
 */
async function fetchTodo(id: string): Promise<Todo> {
  const response = await fetch(`/api/todos/${id}`)

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Todo not found")
    }
    throw new Error("Failed to fetch todo")
  }

  return response.json()
}

/**
 * Create a new todo
 */
async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const response = await fetch("/api/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error("Failed to create todo")
  }

  return response.json()
}

/**
 * Update an existing todo
 */
async function updateTodo({ id, data }: { id: string; data: UpdateTodoInput }): Promise<Todo> {
  const response = await fetch(`/api/todos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Todo not found")
    }
    throw new Error("Failed to update todo")
  }

  return response.json()
}

/**
 * Delete a todo by ID
 */
async function deleteTodo(id: string): Promise<void> {
  const response = await fetch(`/api/todos/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Todo not found")
    }
    throw new Error("Failed to delete todo")
  }
}

/**
 * Hook to fetch all todos with optional filters
 *
 * @example
 * const { data: todos, isLoading } = useTodos()
 * const { data: activeTodos } = useTodos({ completed: false })
 */
export function useTodos(filters?: TodoFilters) {
  return useQuery({
    queryKey: todoKeys.list(filters),
    queryFn: () => fetchTodos(filters),
  })
}

/**
 * Hook to fetch a single todo by ID
 *
 * @example
 * const { data: todo, isLoading, error } = useTodo('123')
 */
export function useTodo(id: string) {
  return useQuery({
    queryKey: todoKeys.detail(id),
    queryFn: () => fetchTodo(id),
    enabled: !!id,
  })
}

/**
 * Hook to create a new todo
 * Automatically invalidates the todos list cache on success
 *
 * @example
 * const createTodo = useCreateTodo()
 * createTodo.mutate({ title: 'New todo', description: 'Details' })
 */
export function useCreateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      // Invalidate all todo lists to refetch with new data
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
    },
  })
}

/**
 * Hook to update an existing todo
 * Supports optimistic updates for instant UI feedback
 * Automatically invalidates relevant cache entries on success
 *
 * @example
 * const updateTodo = useUpdateTodo()
 * updateTodo.mutate({ id: '123', data: { completed: true } })
 */
export function useUpdateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateTodo,
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: todoKeys.detail(id) })

      // Snapshot the previous value
      const previousTodo = queryClient.getQueryData<Todo>(todoKeys.detail(id))

      // Optimistically update the cache
      if (previousTodo) {
        queryClient.setQueryData<Todo>(todoKeys.detail(id), {
          ...previousTodo,
          ...data,
          updatedAt: new Date().toISOString(),
        })
      }

      // Return context with the previous value
      return { previousTodo, id }
    },
    onError: (err, variables, context) => {
      // Rollback to the previous value on error
      if (context?.previousTodo) {
        queryClient.setQueryData(todoKeys.detail(context.id), context.previousTodo)
      }
    },
    onSuccess: (updatedTodo, { id }) => {
      // Update the cache with the server response
      queryClient.setQueryData(todoKeys.detail(id), updatedTodo)

      // Invalidate all todo lists to refetch with updated data
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
    },
  })
}

/**
 * Hook to delete a todo
 * Automatically removes from cache with optimistic updates
 * Supports navigation callback for routing after deletion
 *
 * @example
 * const deleteTodo = useDeleteTodo()
 * deleteTodo.mutate('123')
 */
export function useDeleteTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTodo,
    onMutate: async (id: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: todoKeys.lists() })
      await queryClient.cancelQueries({ queryKey: todoKeys.detail(id) })

      // Snapshot the previous values
      const previousTodos = queryClient.getQueriesData<Todo[]>({ queryKey: todoKeys.lists() })
      const previousTodo = queryClient.getQueryData<Todo>(todoKeys.detail(id))

      // Optimistically remove from all list caches
      queryClient.setQueriesData<Todo[]>({ queryKey: todoKeys.lists() }, (old) => {
        return old ? old.filter((todo) => todo.id !== id) : old
      })

      // Remove from detail cache
      queryClient.removeQueries({ queryKey: todoKeys.detail(id) })

      // Return context with snapshots
      return { previousTodos, previousTodo, id }
    },
    onError: (err, id, context) => {
      // Rollback all list caches on error
      if (context?.previousTodos) {
        context.previousTodos.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }

      // Restore detail cache
      if (context?.previousTodo) {
        queryClient.setQueryData(todoKeys.detail(context.id), context.previousTodo)
      }
    },
    onSuccess: () => {
      // Invalidate all todo lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
    },
  })
}
