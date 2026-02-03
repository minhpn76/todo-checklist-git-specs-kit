import type { Todo } from "@/lib/types"

/**
 * Sample todo data for development and testing
 * This data is used by Mock Service Worker to simulate API responses
 */
export const mockTodos: Todo[] = [
  {
    id: "1",
    title: "Setup Next.js project",
    description: "Initialize Next.js 14 with TypeScript and App Router",
    completed: true,
    createdAt: new Date("2024-01-15T10:00:00Z").toISOString(),
    updatedAt: new Date("2024-01-15T14:30:00Z").toISOString(),
  },
  {
    id: "2",
    title: "Install shadcn/ui components",
    description: "Add button, input, checkbox, card, and dialog components",
    completed: true,
    createdAt: new Date("2024-01-15T11:00:00Z").toISOString(),
    updatedAt: new Date("2024-01-15T15:00:00Z").toISOString(),
  },
  {
    id: "3",
    title: "Implement todo data types",
    description: "Create TypeScript interfaces and Zod schemas for validation",
    completed: true,
    createdAt: new Date("2024-01-16T09:00:00Z").toISOString(),
    updatedAt: new Date("2024-01-16T10:30:00Z").toISOString(),
  },
  {
    id: "4",
    title: "Build localStorage abstraction",
    description: "Create LocalTodoStorage class with CRUD operations",
    completed: false,
    createdAt: new Date("2024-01-16T14:00:00Z").toISOString(),
    updatedAt: new Date("2024-01-16T14:00:00Z").toISOString(),
  },
  {
    id: "5",
    title: "Create React Query hooks",
    description:
      "Implement useTodos, useTodo, useCreateTodo, useUpdateTodo, and useDeleteTodo hooks",
    completed: false,
    createdAt: new Date("2024-01-17T10:00:00Z").toISOString(),
    updatedAt: new Date("2024-01-17T10:00:00Z").toISOString(),
  },
  {
    id: "6",
    title: "Design TodoList component",
    description: "Build the main list view with filtering and sorting capabilities",
    completed: false,
    createdAt: new Date("2024-01-17T11:30:00Z").toISOString(),
    updatedAt: new Date("2024-01-17T11:30:00Z").toISOString(),
  },
  {
    id: "7",
    title: "Implement TodoForm component",
    description: "Create form with TanStack Form for adding and editing todos",
    completed: false,
    createdAt: new Date("2024-01-17T13:00:00Z").toISOString(),
    updatedAt: new Date("2024-01-17T13:00:00Z").toISOString(),
  },
  {
    id: "8",
    title: "Add accessibility features",
    description: "Ensure WCAG 2.1 AA compliance with keyboard navigation and ARIA labels",
    completed: false,
    createdAt: new Date("2024-01-18T09:00:00Z").toISOString(),
    updatedAt: new Date("2024-01-18T09:00:00Z").toISOString(),
  },
  {
    id: "9",
    title: "Write unit tests",
    description: "Test components with React Testing Library and Vitest",
    completed: false,
    createdAt: new Date("2024-01-18T14:00:00Z").toISOString(),
    updatedAt: new Date("2024-01-18T14:00:00Z").toISOString(),
  },
  {
    id: "10",
    title: "Add end-to-end tests",
    description: "Create Playwright tests for critical user flows",
    completed: false,
    createdAt: new Date("2024-01-19T10:00:00Z").toISOString(),
    updatedAt: new Date("2024-01-19T10:00:00Z").toISOString(),
  },
]

/**
 * Get a copy of mock todos (prevents mutations)
 */
export function getMockTodos(): Todo[] {
  return JSON.parse(JSON.stringify(mockTodos))
}

/**
 * Find a mock todo by ID
 */
export function getMockTodoById(id: string): Todo | undefined {
  return mockTodos.find((todo) => todo.id === id)
}

/**
 * Generate a new unique ID for mock todos
 */
export function generateMockId(): string {
  const maxId = Math.max(0, ...mockTodos.map((t) => parseInt(t.id, 10)))
  return String(maxId + 1)
}
