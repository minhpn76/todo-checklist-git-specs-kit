import { z } from "zod"

/**
 * Zod schema for creating a new todo
 * Validates title and description inputs
 */
export const createTodoSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less")
    .trim(),
  description: z
    .string()
    .max(1000, "Description must be 1000 characters or less")
    .trim()
    .optional()
    .default(""),
})

/**
 * Zod schema for updating an existing todo
 * All fields are optional
 */
export const updateTodoSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(200, "Title must be 200 characters or less")
    .trim()
    .optional(),
  description: z
    .string()
    .max(1000, "Description must be 1000 characters or less")
    .trim()
    .optional(),
  completed: z.boolean().optional(),
})

/**
 * Zod schema for todo filter parameters
 */
export const todoFiltersSchema = z.object({
  completed: z.boolean().optional(),
  search: z.string().trim().optional(),
})

/**
 * Inferred TypeScript types from Zod schemas
 */
export type CreateTodoInput = z.infer<typeof createTodoSchema>
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>
export type TodoFilters = z.infer<typeof todoFiltersSchema>
