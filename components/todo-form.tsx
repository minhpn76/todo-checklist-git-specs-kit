"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTodoForm } from "@/lib/hooks/use-todo-form"
import { createTodoSchema } from "@/lib/validation"
import type { CreateTodoInput } from "@/lib/types"

interface TodoFormProps {
  onSubmit: (data: CreateTodoInput) => void | Promise<void>
  initialValues?: Partial<CreateTodoInput>
  isSubmitting?: boolean
  onCancel?: () => void
  mode?: "create" | "edit"
}

/**
 * TodoForm component for creating and editing todos
 * Uses TanStack Form with Zod validation
 */
export function TodoForm({
  onSubmit,
  initialValues,
  isSubmitting = false,
  onCancel,
  mode = "create",
}: TodoFormProps) {
  const form = useTodoForm({ onSubmit, initialValues })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === "create" ? "Create New Todo" : "Edit Todo"}</CardTitle>
        <CardDescription>
          {mode === "create"
            ? "Add a new task to your todo list"
            : "Update the details of your todo item"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          {/* Title Field */}
          <form.Field
            name="title"
            validators={{
              onChange: ({ value }) => {
                const result = createTodoSchema.shape.title.safeParse(value)
                return result.success ? undefined : result.error.issues[0].message
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <label htmlFor={field.name} className="text-sm font-medium">
                  Title <span className="text-destructive">*</span>
                </label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Enter todo title..."
                  disabled={isSubmitting}
                  aria-required="true"
                  aria-invalid={field.state.meta.errors.length > 0}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive" role="alert">
                    {String(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Description Field */}
          <form.Field
            name="description"
            validators={{
              onChange: ({ value }) => {
                const result = createTodoSchema.shape.description.safeParse(value)
                return result.success ? undefined : result.error.issues[0].message
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <label htmlFor={field.name} className="text-sm font-medium">
                  Description
                </label>
                <textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Enter description (optional)..."
                  disabled={isSubmitting}
                  rows={4}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-invalid={field.state.meta.errors.length > 0}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive" role="alert">
                    {String(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting
                ? mode === "create"
                  ? "Creating..."
                  : "Saving..."
                : mode === "create"
                  ? "Create Todo"
                  : "Save Changes"}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
