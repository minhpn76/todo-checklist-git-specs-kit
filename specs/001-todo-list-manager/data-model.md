# Data Model: Todo List Manager

**Phase**: Phase 1 - Design & Contracts  
**Created**: February 1, 2026  
**Branch**: 001-todo-list-manager

## Overview

This document defines the data structures and relationships for the Todo List Manager application. The model is designed to be storage-agnostic, supporting both localStorage (MVP) and future API implementations.

## Core Entities

### Todo Item

Represents a single task or item that a user needs to complete.

**Entity Definition**:

| Field | Type | Required | Default | Constraints | Description |
|-------|------|----------|---------|-------------|-------------|
| `id` | string (UUID) | Yes | auto-generated | Unique, immutable | Unique identifier for the todo item |
| `title` | string | Yes | - | 1-200 characters | Short description of the task |
| `description` | string | No | empty string | 0-1000 characters | Optional detailed description |
| `completed` | boolean | Yes | false | - | Completion status (done/not done) |
| `createdAt` | ISO 8601 string | Yes | auto-generated | Valid datetime | Timestamp when item was created |
| `updatedAt` | ISO 8601 string | Yes | auto-generated | Valid datetime | Timestamp of last modification |

**TypeScript Definition**:

```typescript
// lib/types.ts

/**
 * Core todo item entity
 */
export interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  createdAt: string  // ISO 8601 format
  updatedAt: string  // ISO 8601 format
}

/**
 * Input type for creating a new todo (without auto-generated fields)
 */
export type CreateTodoInput = Pick<Todo, 'title' | 'description'>

/**
 * Input type for updating an existing todo (all fields optional)
 */
export type UpdateTodoInput = Partial<Pick<Todo, 'title' | 'description' | 'completed'>>

/**
 * Filter/query parameters for listing todos
 */
export interface TodoFilters {
  completed?: boolean  // Filter by completion status
  search?: string      // Search in title and description
}

/**
 * Sort options for todo list
 */
export type TodoSortField = 'createdAt' | 'updatedAt' | 'title'
export type TodoSortOrder = 'asc' | 'desc'

export interface TodoSort {
  field: TodoSortField
  order: TodoSortOrder
}
```

**Validation Rules** (from Functional Requirements):

- **FR-001**: Title is required for creation
- **FR-010**: Title cannot be empty (minimum 1 character)
- Title maximum length: 200 characters (reasonable UX limit)
- Description maximum length: 1000 characters (prevent storage abuse)
- `completed` defaults to `false` on creation
- `id` must be globally unique (use UUID v4)
- Timestamps must be valid ISO 8601 format

**Zod Schema**:

```typescript
// lib/validation.ts
import { z } from 'zod'

export const createTodoSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less')
    .trim(),
  description: z.string()
    .max(1000, 'Description must be 1000 characters or less')
    .trim()
    .optional()
    .default(''),
})

export const updateTodoSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less')
    .trim()
    .optional(),
  description: z.string()
    .max(1000, 'Description must be 1000 characters or less')
    .trim()
    .optional(),
  completed: z.boolean().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update' }
)

export const todoFiltersSchema = z.object({
  completed: z.boolean().optional(),
  search: z.string().optional(),
})

export type CreateTodoInput = z.infer<typeof createTodoSchema>
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>
export type TodoFilters = z.infer<typeof todoFiltersSchema>
```

## State Transitions

### Todo Lifecycle

```
┌─────────────┐
│   Created   │ (completed: false)
│ (new todo)  │
└──────┬──────┘
       │
       │ User marks complete
       ▼
┌─────────────┐
│  Completed  │ (completed: true)
└──────┬──────┘
       │
       │ User marks incomplete
       ▼
┌─────────────┐
│   Active    │ (completed: false)
└──────┬──────┘
       │
       │ User deletes
       ▼
┌─────────────┐
│   Deleted   │ (removed from storage)
└─────────────┘
```

**Valid Transitions**:

1. **Create**: `null` → `Active (completed: false)`
2. **Mark Complete**: `Active` → `Completed (completed: true)`
3. **Mark Incomplete**: `Completed` → `Active (completed: false)`
4. **Edit**: `Any state` → `Same state with updated fields`
5. **Delete**: `Any state` → `Deleted (removed)`

**Transition Rules**:
- `updatedAt` must be updated on every state change
- `createdAt` is immutable
- `id` is immutable
- Completion toggle can happen multiple times (no restrictions)

## Storage Structure

### localStorage Schema (MVP)

**Key**: `todos`  
**Value**: JSON array of Todo objects

```typescript
// Example localStorage structure
{
  "todos": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "completed": false,
      "createdAt": "2026-02-01T09:00:00.000Z",
      "updatedAt": "2026-02-01T09:00:00.000Z"
    },
    {
      "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      "title": "Call dentist",
      "description": "",
      "completed": true,
      "createdAt": "2026-02-01T08:30:00.000Z",
      "updatedAt": "2026-02-01T10:15:00.000Z"
    }
  ]
}
```

**Storage Operations**:

```typescript
// lib/storage.ts

interface TodoStorage {
  // Read operations
  getAll(filters?: TodoFilters): Promise<Todo[]>
  getById(id: string): Promise<Todo | null>
  
  // Write operations
  create(input: CreateTodoInput): Promise<Todo>
  update(id: string, input: UpdateTodoInput): Promise<Todo>
  delete(id: string): Promise<void>
  
  // Batch operations
  deleteMany(ids: string[]): Promise<void>
}

// localStorage implementation
export class LocalTodoStorage implements TodoStorage {
  private readonly STORAGE_KEY = 'todos'
  
  async getAll(filters?: TodoFilters): Promise<Todo[]> {
    const todos = this.readFromStorage()
    return this.applyFilters(todos, filters)
  }
  
  async getById(id: string): Promise<Todo | null> {
    const todos = this.readFromStorage()
    return todos.find(t => t.id === id) ?? null
  }
  
  async create(input: CreateTodoInput): Promise<Todo> {
    const todos = this.readFromStorage()
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description ?? '',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    todos.push(newTodo)
    this.writeToStorage(todos)
    return newTodo
  }
  
  async update(id: string, input: UpdateTodoInput): Promise<Todo> {
    const todos = this.readFromStorage()
    const index = todos.findIndex(t => t.id === id)
    if (index === -1) throw new Error(`Todo not found: ${id}`)
    
    todos[index] = {
      ...todos[index],
      ...input,
      updatedAt: new Date().toISOString(),
    }
    this.writeToStorage(todos)
    return todos[index]
  }
  
  async delete(id: string): Promise<void> {
    const todos = this.readFromStorage()
    const filtered = todos.filter(t => t.id !== id)
    this.writeToStorage(filtered)
  }
  
  private readFromStorage(): Todo[] {
    const data = localStorage.getItem(this.STORAGE_KEY)
    if (!data) return []
    try {
      const parsed = JSON.parse(data)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  
  private writeToStorage(todos: Todo[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos))
  }
  
  private applyFilters(todos: Todo[], filters?: TodoFilters): Todo[] {
    if (!filters) return todos
    
    let result = todos
    
    if (filters.completed !== undefined) {
      result = result.filter(t => t.completed === filters.completed)
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(t => 
        t.title.toLowerCase().includes(searchLower) ||
        t.description.toLowerCase().includes(searchLower)
      )
    }
    
    return result
  }
}
```

### Future API Schema

**Database Table** (for future migration):

```sql
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  CONSTRAINT title_not_empty CHECK (length(trim(title)) > 0),
  CONSTRAINT description_length CHECK (length(description) <= 1000)
);

CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_completed ON todos(completed);
CREATE INDEX idx_todos_created_at ON todos(created_at DESC);
```

**Migration Strategy**:
1. Keep `TodoStorage` interface identical
2. Implement `ApiTodoStorage` that calls REST endpoints
3. Switch storage implementation via environment variable
4. User data migration via export/import feature

## Data Relationships

### Current (MVP)

**No relationships** - Single entity (Todo) with no foreign keys or associations.

### Future (Multi-user)

When adding user authentication:

```
User (1) ──────< (many) Todo
│
├─ id: UUID
├─ email: string
├─ name: string
└─ createdAt: datetime

Todo
├─ id: UUID
├─ userId: UUID (FK to User)
├─ title: string
├─ description: string
├─ completed: boolean
├─ createdAt: datetime
└─ updatedAt: datetime
```

**Relationship Rules**:
- One user has many todos
- Todo belongs to one user
- Delete user → cascade delete todos
- Todos are private (not shared between users)

## Data Constraints Summary

### Hard Constraints (Enforced)

- ✅ Title required (FR-001, FR-010)
- ✅ Title max 200 characters
- ✅ Description max 1000 characters
- ✅ UUID format for IDs
- ✅ ISO 8601 format for timestamps
- ✅ Boolean for completed status

### Soft Constraints (Recommended)

- 📊 Limit 1000 todos per user (reasonable for localStorage)
- 📊 Warn if localStorage exceeds 4MB (5MB limit in most browsers)
- 📊 Archive/export after 500 todos (UX performance)

### Edge Cases Handled

From spec edge cases:

- ✅ Empty title → Validation error (Zod schema)
- ✅ No todos → Empty array returned
- ✅ Very long title → Truncated at 200 chars (validation error)
- ✅ Special characters/emojis → Supported (UTF-8 encoding)
- ✅ Concurrent edits → Last write wins (acceptable for MVP, localStorage is synchronous)

## Performance Considerations

### localStorage Limits

- **Capacity**: ~5-10MB depending on browser
- **Estimated capacity**: ~5,000 todos with 100 char titles (500KB)
- **Practical limit**: 1,000 todos recommended for performance
- **Read performance**: O(n) for filters, O(n) for search
- **Write performance**: O(n) to serialize entire array

### Optimization Strategies

1. **Indexing** (future): In-memory index by `id` for O(1) lookups
2. **Pagination**: Virtual scrolling for > 100 items
3. **Debouncing**: 300ms debounce for search input
4. **Memoization**: Cache filtered results in React Query
5. **Compression** (future): LZ-string for localStorage compression

## Data Migration

### Version 1 (Current)

Schema version: `1`

```typescript
interface TodoV1 {
  id: string
  title: string
  description?: string
  completed: boolean
  createdAt: string
  updatedAt: string
}
```

### Future Versions

When schema changes (e.g., adding priority field):

```typescript
// Migration function
function migrateToV2(data: any): TodoV2[] {
  const version = data.version ?? 1
  
  if (version === 1) {
    return data.todos.map((todo: TodoV1) => ({
      ...todo,
      priority: 'medium', // default value
    }))
  }
  
  return data.todos
}

// Versioned storage
interface StorageData {
  version: number
  todos: Todo[]
}
```

## Validation Error Messages

User-friendly error messages (from Zod schemas):

| Validation | Error Message |
|------------|---------------|
| Title empty | "Title is required" |
| Title too long | "Title must be 200 characters or less" |
| Description too long | "Description must be 1000 characters or less" |
| No update fields | "At least one field must be provided for update" |
| Todo not found | "Todo not found: {id}" |
| Invalid date | "Invalid date format" |

## Testing Data

### Mock Todos

```typescript
// mocks/data.ts

export const mockTodos: Todo[] = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Include budget and timeline',
    completed: false,
    createdAt: '2026-01-30T10:00:00.000Z',
    updatedAt: '2026-01-30T10:00:00.000Z',
  },
  {
    id: '2',
    title: 'Buy groceries',
    description: '',
    completed: true,
    createdAt: '2026-01-29T08:00:00.000Z',
    updatedAt: '2026-01-31T14:30:00.000Z',
  },
  {
    id: '3',
    title: 'Call dentist',
    description: 'Schedule annual checkup',
    completed: false,
    createdAt: '2026-02-01T09:00:00.000Z',
    updatedAt: '2026-02-01T09:00:00.000Z',
  },
]
```

## Summary

The Todo data model is intentionally simple, supporting the MVP requirements while allowing for future expansion. The storage abstraction enables migration from localStorage to an API-based backend without changing application code. Validation rules enforce data integrity, and the TypeScript types provide compile-time safety throughout the application.
