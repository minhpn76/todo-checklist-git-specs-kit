# API Contracts: Todo List Manager

**Phase**: Phase 1 - Design & Contracts  
**Created**: February 1, 2026  
**Branch**: 001-todo-list-manager

## Overview

This directory contains API contract definitions for the Todo List Manager. The OpenAPI specification defines the REST API that will be mocked by MSW during development and implemented as Next.js API routes in production.

## Files

- **[openapi.yaml](./openapi.yaml)** - OpenAPI 3.1 specification (REST API contract)
- **[types.ts](./types.ts)** - TypeScript type definitions (generated/aligned with OpenAPI)

## API Design Principles

### RESTful Conventions

The API follows standard REST conventions:

- **GET /todos** - List all todos (with optional filters)
- **POST /todos** - Create a new todo
- **GET /todos/:id** - Get a specific todo
- **PUT /todos/:id** - Update a todo (partial update supported)
- **DELETE /todos/:id** - Delete a todo

### HTTP Status Codes

- **200 OK** - Successful GET/PUT request
- **201 Created** - Successful POST request
- **204 No Content** - Successful DELETE request
- **400 Bad Request** - Validation error (client error)
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

### Content Type

All requests and responses use `application/json`.

## Endpoint Details

### GET /api/todos

**Purpose**: Retrieve all todo items (FR-002)

**Query Parameters**:
- `completed` (boolean, optional) - Filter by completion status
- `search` (string, optional) - Search in title and description

**Response**: Array of Todo objects, empty array if no todos exist (FR-011)

**Example**:
```bash
# Get all todos
curl http://localhost:3000/api/todos

# Get only completed todos
curl http://localhost:3000/api/todos?completed=true

# Search todos
curl http://localhost:3000/api/todos?search=groceries
```

### POST /api/todos

**Purpose**: Create a new todo item (FR-001)

**Request Body**:
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"  // optional
}
```

**Validation**:
- Title required, 1-200 characters (FR-001, FR-010)
- Description optional, max 1000 characters
- Returns 400 if validation fails

**Response**: Created Todo object with auto-generated `id`, `createdAt`, `updatedAt`

**Example**:
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Milk, eggs, bread"}'
```

### GET /api/todos/:id

**Purpose**: Retrieve a specific todo item (FR-003)

**Path Parameters**:
- `id` (UUID) - Todo identifier

**Response**: Todo object or 404 if not found

**Example**:
```bash
curl http://localhost:3000/api/todos/550e8400-e29b-41d4-a716-446655440000
```

### PUT /api/todos/:id

**Purpose**: Update a todo item (FR-004, FR-005, FR-007)

**Path Parameters**:
- `id` (UUID) - Todo identifier

**Request Body** (all fields optional, at least one required):
```json
{
  "title": "Buy groceries and toiletries",    // optional
  "description": "Milk, eggs, bread, soap",   // optional
  "completed": true                            // optional (FR-004, FR-005)
}
```

**Validation**:
- At least one field required
- Title 1-200 characters if provided
- Description max 1000 characters if provided
- Returns 400 if validation fails, 404 if todo not found

**Response**: Updated Todo object with new `updatedAt` timestamp

**Example**:
```bash
# Mark todo as complete
curl -X PUT http://localhost:3000/api/todos/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# Update title and description
curl -X PUT http://localhost:3000/api/todos/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{"title": "New title", "description": "New description"}'
```

### DELETE /api/todos/:id

**Purpose**: Delete a todo item (FR-009)

**Path Parameters**:
- `id` (UUID) - Todo identifier

**Response**: 204 No Content on success, 404 if not found

**Example**:
```bash
curl -X DELETE http://localhost:3000/api/todos/550e8400-e29b-41d4-a716-446655440000
```

## Error Responses

All errors follow a consistent format:

```json
{
  "error": "ErrorType",
  "message": "Human-readable error message",
  "details": {
    // Optional additional information
  }
}
```

### Common Errors

**Validation Error (400)**:
```json
{
  "error": "ValidationError",
  "message": "Title is required",
  "details": {
    "field": "title",
    "constraint": "minLength"
  }
}
```

**Not Found (404)**:
```json
{
  "error": "NotFoundError",
  "message": "Todo not found: 550e8400-e29b-41d4-a716-446655440000"
}
```

**Internal Server Error (500)**:
```json
{
  "error": "InternalServerError",
  "message": "An unexpected error occurred"
}
```

## MSW Mocking Strategy

For local development, Mock Service Worker intercepts API requests:

### Handler Examples

```typescript
// mocks/handlers.ts
import { http, HttpResponse } from 'msw'
import { mockTodos } from './data'

export const handlers = [
  // GET /api/todos
  http.get('/api/todos', ({ request }) => {
    const url = new URL(request.url)
    const completed = url.searchParams.get('completed')
    const search = url.searchParams.get('search')
    
    let filtered = [...mockTodos]
    
    if (completed !== null) {
      filtered = filtered.filter(t => t.completed === (completed === 'true'))
    }
    
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(searchLower) ||
        t.description.toLowerCase().includes(searchLower)
      )
    }
    
    // Simulate network delay
    return HttpResponse.json(filtered, { status: 200 })
  }),

  // POST /api/todos
  http.post('/api/todos', async ({ request }) => {
    const body = await request.json()
    
    // Validation
    if (!body.title || body.title.trim().length === 0) {
      return HttpResponse.json(
        {
          error: 'ValidationError',
          message: 'Title is required',
          details: { field: 'title', constraint: 'minLength' }
        },
        { status: 400 }
      )
    }
    
    const newTodo = {
      id: crypto.randomUUID(),
      title: body.title,
      description: body.description ?? '',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    mockTodos.push(newTodo)
    return HttpResponse.json(newTodo, { status: 201 })
  }),

  // PUT /api/todos/:id
  http.put('/api/todos/:id', async ({ params, request }) => {
    const { id } = params
    const body = await request.json()
    
    const todo = mockTodos.find(t => t.id === id)
    if (!todo) {
      return HttpResponse.json(
        {
          error: 'NotFoundError',
          message: `Todo not found: ${id}`
        },
        { status: 404 }
      )
    }
    
    Object.assign(todo, body, {
      updatedAt: new Date().toISOString()
    })
    
    return HttpResponse.json(todo, { status: 200 })
  }),

  // DELETE /api/todos/:id
  http.delete('/api/todos/:id', ({ params }) => {
    const { id } = params
    const index = mockTodos.findIndex(t => t.id === id)
    
    if (index === -1) {
      return HttpResponse.json(
        {
          error: 'NotFoundError',
          message: `Todo not found: ${id}`
        },
        { status: 404 }
      )
    }
    
    mockTodos.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
```

### MSW Setup

```typescript
// mocks/browser.ts
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

// Start worker in development
if (process.env.NODE_ENV === 'development') {
  worker.start({
    onUnhandledRequest: 'bypass',
  })
}
```

## TanStack Query Integration

### Query Hooks

```typescript
// lib/hooks/use-todos.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Todo, CreateTodoInput, UpdateTodoInput } from '@/lib/types'

// Query keys
export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (filters?: { completed?: boolean; search?: string }) => 
    [...todoKeys.lists(), filters] as const,
  details: () => [...todoKeys.all, 'detail'] as const,
  detail: (id: string) => [...todoKeys.details(), id] as const,
}

// List todos
export function useTodos(filters?: { completed?: boolean; search?: string }) {
  return useQuery({
    queryKey: todoKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters?.completed !== undefined) {
        params.set('completed', String(filters.completed))
      }
      if (filters?.search) {
        params.set('search', filters.search)
      }
      
      const response = await fetch(`/api/todos?${params}`)
      if (!response.ok) throw new Error('Failed to fetch todos')
      return response.json() as Promise<Todo[]>
    },
    staleTime: 30_000, // 30 seconds
  })
}

// Get single todo
export function useTodo(id: string) {
  return useQuery({
    queryKey: todoKeys.detail(id),
    queryFn: async () => {
      const response = await fetch(`/api/todos/${id}`)
      if (!response.ok) throw new Error('Failed to fetch todo')
      return response.json() as Promise<Todo>
    },
  })
}

// Create todo
export function useCreateTodo() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (input: CreateTodoInput) => {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!response.ok) throw new Error('Failed to create todo')
      return response.json() as Promise<Todo>
    },
    onSuccess: () => {
      // Invalidate all todo lists to refetch
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
    },
  })
}

// Update todo
export function useUpdateTodo() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateTodoInput }) => {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!response.ok) throw new Error('Failed to update todo')
      return response.json() as Promise<Todo>
    },
    onSuccess: (data) => {
      // Invalidate lists and update specific todo cache
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
      queryClient.setQueryData(todoKeys.detail(data.id), data)
    },
  })
}

// Delete todo
export function useDeleteTodo() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete todo')
    },
    onSuccess: (_, id) => {
      // Invalidate lists and remove from cache
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
      queryClient.removeQueries({ queryKey: todoKeys.detail(id) })
    },
  })
}
```

## Testing Contracts

### Contract Tests

```typescript
// tests/contract/api.test.ts
import { describe, it, expect } from 'vitest'
import { todoSchema } from '@/lib/validation'

describe('API Contract Tests', () => {
  it('should validate todo schema matches OpenAPI spec', () => {
    const validTodo = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Test todo',
      description: 'Test description',
      completed: false,
      createdAt: '2026-02-01T09:00:00.000Z',
      updatedAt: '2026-02-01T09:00:00.000Z',
    }
    
    expect(() => todoSchema.parse(validTodo)).not.toThrow()
  })
  
  it('should reject invalid todo', () => {
    const invalidTodo = {
      id: 'not-a-uuid',
      title: '', // empty title
      completed: 'not-a-boolean',
    }
    
    expect(() => todoSchema.parse(invalidTodo)).toThrow()
  })
})
```

## Migration from MSW to Real API

When ready to implement the backend:

1. **Create Next.js API routes** matching the contract:
   - `app/api/todos/route.ts` - GET /api/todos, POST /api/todos
   - `app/api/todos/[id]/route.ts` - GET/PUT/DELETE /api/todos/:id

2. **Disable MSW** in production (automatically handled by `process.env.NODE_ENV`)

3. **No changes required** in React Query hooks or components

## Compliance with Functional Requirements

| Requirement | Endpoint | Method |
|-------------|----------|--------|
| FR-001: Create todos | `/api/todos` | POST |
| FR-002: Display all todos | `/api/todos` | GET |
| FR-003: Show todo details | `/api/todos/:id` | GET |
| FR-004: Mark complete | `/api/todos/:id` | PUT |
| FR-005: Mark incomplete | `/api/todos/:id` | PUT |
| FR-007: Edit details | `/api/todos/:id` | PUT |
| FR-009: Delete todos | `/api/todos/:id` | DELETE |
| FR-010: Validate empty title | All | Validation |

## Performance Targets

- **Response time**: < 1s (SC-006) - MSW adds 50-200ms delay for realism
- **List operation**: < 500ms for 100 items
- **Create operation**: < 200ms
- **Update operation**: < 200ms (optimistic update makes it instant in UI)
- **Delete operation**: < 200ms

## Future Enhancements

### Pagination

```yaml
# OpenAPI addition
parameters:
  - name: page
    in: query
    schema:
      type: integer
      minimum: 1
      default: 1
  - name: limit
    in: query
    schema:
      type: integer
      minimum: 1
      maximum: 100
      default: 20
```

### Sorting

```yaml
# OpenAPI addition
parameters:
  - name: sortBy
    in: query
    schema:
      type: string
      enum: [createdAt, updatedAt, title]
      default: createdAt
  - name: sortOrder
    in: query
    schema:
      type: string
      enum: [asc, desc]
      default: desc
```

### Bulk Operations

```yaml
# OpenAPI addition
paths:
  /todos/bulk-delete:
    post:
      summary: Delete multiple todos
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                ids:
                  type: array
                  items:
                    type: string
                    format: uuid
```

## Summary

The API contract defines a standard REST API for todo CRUD operations, validated with OpenAPI 3.1 specification. MSW enables development without a backend, while TanStack Query provides efficient client-side state management. The contract is designed for easy migration to a real Next.js API when needed.
