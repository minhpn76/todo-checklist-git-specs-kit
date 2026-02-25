import { http, HttpResponse } from "msw"
import type { RequestHandler } from "msw"
import { getMockTodos, getMockTodoById, generateMockId } from "./data"
import type { Todo, CreateTodoInput, UpdateTodoInput } from "@/lib/types"
import { createTodoSchema, updateTodoSchema } from "@/lib/validation"

// In-memory storage for mock data (simulates database)
let todos: Todo[] = getMockTodos()

/**
 * Mock Service Worker request handlers
 * These handlers intercept API requests during development
 * and return mock responses based on the mock data
 */
export const handlers: RequestHandler[] = [
  // GET /api/todos - List todos with optional filters
  http.get("/api/todos", ({ request }) => {
    const url = new URL(request.url)
    const completedParam = url.searchParams.get("completed")
    const searchParam = url.searchParams.get("search")

    let filteredTodos = [...todos]

    // Filter by completion status
    if (completedParam !== null) {
      const completed = completedParam === "true"
      filteredTodos = filteredTodos.filter((todo) => todo.completed === completed)
    }

    // Filter by search query (case-insensitive)
    if (searchParam) {
      const search = searchParam.toLowerCase()
      filteredTodos = filteredTodos.filter(
        (todo) =>
          todo.title.toLowerCase().includes(search) ||
          todo.description?.toLowerCase().includes(search)
      )
    }

    // Sort by createdAt descending (newest first)
    filteredTodos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return HttpResponse.json(filteredTodos)
  }),

  // POST /api/todos - Create a new todo
  http.post("/api/todos", async ({ request }) => {
    try {
      const body = (await request.json()) as CreateTodoInput

      // Validate input
      const result = createTodoSchema.safeParse(body)
      if (!result.success) {
        return HttpResponse.json(
          {
            error: "Validation failed",
            details: result.error.issues,
          },
          { status: 400 }
        )
      }

      // Create new todo
      const now = new Date().toISOString()
      const newTodo: Todo = {
        id: generateMockId(),
        title: result.data.title,
        description: result.data.description || "",
        completed: false,
        createdAt: now,
        updatedAt: now,
      }

      todos.push(newTodo)

      return HttpResponse.json(newTodo, { status: 201 })
    } catch (error) {
      return HttpResponse.json({ error: "Failed to create todo" }, { status: 500 })
    }
  }),

  // GET /api/todos/:id - Get a single todo
  http.get("/api/todos/:id", ({ params }) => {
    const { id } = params
    const todo = todos.find((t) => t.id === id)

    if (!todo) {
      return HttpResponse.json({ error: "Todo not found" }, { status: 404 })
    }

    return HttpResponse.json(todo)
  }),

  // PUT /api/todos/:id - Update a todo
  http.put("/api/todos/:id", async ({ params, request }) => {
    try {
      const { id } = params
      const body = (await request.json()) as UpdateTodoInput

      // Validate input
      const result = updateTodoSchema.safeParse(body)
      if (!result.success) {
        return HttpResponse.json(
          {
            error: "Validation failed",
            details: result.error.issues,
          },
          { status: 400 }
        )
      }

      // Find the todo
      const todoIndex = todos.findIndex((t) => t.id === id)
      if (todoIndex === -1) {
        return HttpResponse.json({ error: "Todo not found" }, { status: 404 })
      }

      // Update the todo
      const updatedTodo: Todo = {
        ...todos[todoIndex],
        ...result.data,
        updatedAt: new Date().toISOString(),
      }

      todos[todoIndex] = updatedTodo

      return HttpResponse.json(updatedTodo)
    } catch (error) {
      return HttpResponse.json({ error: "Failed to update todo" }, { status: 500 })
    }
  }),

  // DELETE /api/todos/:id - Delete a todo
  http.delete("/api/todos/:id", ({ params }) => {
    const { id } = params
    const todoIndex = todos.findIndex((t) => t.id === id)

    if (todoIndex === -1) {
      return HttpResponse.json({ error: "Todo not found" }, { status: 404 })
    }

    // Remove the todo from the array
    todos.splice(todoIndex, 1)

    return new HttpResponse(null, { status: 204 })
  }),
]

/**
 * Example handler structure (to be implemented in later tasks):
 *
 * http.get('/api/todos', () => {
 *   return HttpResponse.json({ todos: mockTodos })
 * }),
 *
 * http.post('/api/todos', async ({ request }) => {
 *   const body = await request.json()
 *   return HttpResponse.json({ todo: newTodo })
 * }),
 *
 * http.get('/api/todos/:id', ({ params }) => {
 *   const { id } = params
 *   return HttpResponse.json({ todo: foundTodo })
 * }),
 *
 * http.put('/api/todos/:id', async ({ params, request }) => {
 *   const { id } = params
 *   const body = await request.json()
 *   return HttpResponse.json({ todo: updatedTodo })
 * }),
 *
 * http.delete('/api/todos/:id', ({ params }) => {
 *   const { id } = params
 *   return new HttpResponse(null, { status: 204 })
 * }),
 */
