import { http, HttpResponse } from "msw"
import type { RequestHandler } from "msw"

/**
 * Mock Service Worker request handlers
 * These handlers intercept API requests during development
 * and return mock responses based on the mock data
 */
export const handlers: RequestHandler[] = [
  // Placeholder handlers will be implemented in subsequent tasks:
  // - GET /api/todos - List todos with optional filters (T026)
  // - POST /api/todos - Create a new todo (T027)
  // - GET /api/todos/:id - Get a single todo (T028)
  // - PUT /api/todos/:id - Update a todo (T042)
  // - DELETE /api/todos/:id - Delete a todo (T058)
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
