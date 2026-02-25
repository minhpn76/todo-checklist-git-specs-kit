"use client"

import { useState } from "react"
import Link from "next/link"
import { Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { DeleteConfirmation } from "@/components/delete-confirmation"
import type { Todo } from "@/lib/types"
import { cn } from "@/lib/utils"

interface TodoItemProps {
  todo: Todo
  onToggleComplete?: (id: string, completed: boolean) => void
  onDelete?: (id: string) => void
  isDeleting?: boolean
}

/**
 * TodoItem component displays a single todo item
 * Shows title, completion status, and links to detail view
 */
export function TodoItem({ todo, onToggleComplete, onDelete, isDeleting }: TodoItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleCheckboxChange = (checked: boolean) => {
    onToggleComplete?.(todo.id, checked)
  }

  const handleDelete = () => {
    onDelete?.(todo.id)
    setShowDeleteDialog(false)
  }

  return (
    <>
      <Card className={cn("transition-opacity", todo.completed && "opacity-60")}>
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <Checkbox
              id={`todo-${todo.id}`}
              checked={todo.completed}
              onCheckedChange={handleCheckboxChange}
              className="mt-1"
            />
            <div className="flex-1 space-y-1">
              <Link href={`/todos/${todo.id}`}>
                <CardTitle
                  className={cn(
                    "text-lg hover:underline cursor-pointer",
                    todo.completed && "line-through text-muted-foreground"
                  )}
                >
                  {todo.title}
                </CardTitle>
              </Link>
              {todo.description && (
                <CardDescription
                  className={cn("line-clamp-2", todo.completed && "text-muted-foreground/70")}
                >
                  {todo.description}
                </CardDescription>
              )}
            </div>
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.preventDefault()
                  setShowDeleteDialog(true)
                }}
                disabled={isDeleting}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {onDelete && (
        <DeleteConfirmation
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={handleDelete}
          title="Delete Todo?"
          description={`Are you sure you want to delete "${todo.title}"? This action cannot be undone.`}
          isDeleting={isDeleting}
        />
      )}
    </>
  )
}
