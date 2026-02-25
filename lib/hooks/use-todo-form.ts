"use client"

import { useForm } from "@tanstack/react-form"
import type { CreateTodoInput } from "@/lib/types"

interface UseTodoFormOptions {
  onSubmit: (data: CreateTodoInput) => void | Promise<void>
  initialValues?: Partial<CreateTodoInput>
}

/**
 * Hook for managing todo form state with TanStack Form
 * Field-level validation is applied in the form component using Zod schemas
 *
 * @example
 * const form = useTodoForm({
 *   onSubmit: (data) => createTodo.mutate(data),
 *   initialValues: { title: '', description: '' }
 * })
 */
export function useTodoForm({ onSubmit, initialValues }: UseTodoFormOptions) {
  const form = useForm({
    defaultValues: {
      title: initialValues?.title ?? "",
      description: initialValues?.description ?? "",
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  return form
}
