# Quickstart Guide: Todo List Manager

**Feature**: Todo List Manager  
**Branch**: `001-todo-list-manager`  
**Created**: February 1, 2026

## Overview

This guide helps developers quickly set up, understand, and start working on the Todo List Manager feature. The application is a Next.js-based web app for managing todo items with create, read, update, and delete capabilities.

## Prerequisites

- **Node.js**: 18.17 or later
- **npm**: 9.0 or later (comes with Node.js)
- **Git**: For version control
- **Code Editor**: VS Code recommended (TypeScript IntelliSense)
- **Browser**: Chrome 90+, Safari 14+, or Firefox 88+

## Quick Setup (5 minutes)

### 1. Clone and Install

```bash
# Navigate to project directory
cd todo-app

# Install dependencies
npm install

# Verify installation
npm run type-check
```

### 2. Start Development Server

```bash
# Start Next.js dev server with MSW mocking
npm run dev

# Server runs at http://localhost:3000
```

### 3. Verify Setup

Open http://localhost:3000 in your browser. You should see:
- Empty todo list (or sample todos if seeded)
- "Add Todo" button
- Responsive layout (try mobile view)

**Test the app**:
1. Click "Add Todo" → Enter title → Save
2. Todo appears in list
3. Click todo → View details
4. Toggle checkbox → Mark complete/incomplete
5. Click edit → Modify title → Save
6. Click delete → Confirm → Todo removed

## Project Structure

```
todo-app/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page (todo list)
│   └── todos/
│       ├── [id]/page.tsx  # Todo detail/edit page
│       └── new/page.tsx   # New todo creation page
│
├── components/
│   ├── ui/                # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── checkbox.tsx
│   │   └── ...
│   ├── todo-list.tsx      # Todo list display
│   ├── todo-item.tsx      # Individual todo item
│   ├── todo-form.tsx      # Todo creation/edit form
│   └── providers.tsx      # React Query provider
│
├── lib/
│   ├── storage.ts         # localStorage abstraction
│   ├── types.ts           # TypeScript types
│   ├── validation.ts      # Zod schemas
│   ├── hooks/
│   │   ├── use-todos.ts   # React Query hooks
│   │   └── use-todo-form.ts
│   └── utils.ts           # Utilities (cn, etc.)
│
├── mocks/
│   ├── handlers.ts        # MSW request handlers
│   ├── browser.ts         # MSW browser setup
│   └── data.ts            # Mock todo data
│
├── tests/
│   ├── unit/              # Unit tests (Vitest)
│   ├── integration/       # Integration tests
│   └── e2e/               # E2E tests (Playwright)
│
├── public/                # Static assets
├── specs/                 # Feature specifications
│   └── 001-todo-list-manager/
│       ├── spec.md        # Feature spec
│       ├── plan.md        # Implementation plan (this directory)
│       ├── research.md    # Technology research
│       ├── data-model.md  # Data model
│       ├── quickstart.md  # This file
│       └── contracts/     # API contracts
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## Key Technologies

| Technology | Purpose | Why We Use It |
|------------|---------|---------------|
| **Next.js 14** | Framework | Server Components, App Router, optimizations |
| **TypeScript** | Language | Type safety, better DX |
| **shadcn/ui** | Components | Accessible, customizable, no runtime overhead |
| **Tailwind CSS** | Styling | Utility-first, fast, mobile-first |
| **TanStack Form** | Forms | Type-safe, headless, great validation |
| **TanStack Query** | Data fetching | Caching, optimistic updates, devtools |
| **Mock Service Worker** | API mocking | Realistic network mocking for dev/test |
| **Zod** | Validation | Runtime validation with TypeScript inference |
| **Vitest** | Unit testing | Fast, compatible with Vite |
| **Playwright** | E2E testing | Cross-browser testing |

## Common Tasks

### Add a New Component

```bash
# Add shadcn/ui component
npx shadcn-ui@latest add dialog

# Creates: components/ui/dialog.tsx
# Use in your components with import
```

### Run Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e

# Watch mode (unit tests)
npm run test:watch
```

### Type Checking

```bash
# Check TypeScript types
npm run type-check

# Watch mode
npm run type-check:watch
```

### Linting and Formatting

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code (Prettier)
npm run format
```

### Build for Production

```bash
# Create production build
npm run build

# Test production build locally
npm run start
```

## Development Workflow

### 1. Pick a Task

Tasks are defined in [tasks.md](./tasks.md) (created by `/speckit.tasks` command). Each task includes:
- User story reference
- Acceptance criteria
- Technical details
- Dependencies

### 2. Create a Branch

```bash
# Checkout feature branch
git checkout 001-todo-list-manager

# Create task branch (optional)
git checkout -b task/create-todo-form
```

### 3. Implement Feature

**Example: Adding a new field to Todo**

1. **Update TypeScript types** (`lib/types.ts`):
   ```typescript
   export interface Todo {
     // ... existing fields
     priority: 'low' | 'medium' | 'high'  // new field
   }
   ```

2. **Update Zod validation** (`lib/validation.ts`):
   ```typescript
   export const createTodoSchema = z.object({
     // ... existing fields
     priority: z.enum(['low', 'medium', 'high']).default('medium'),
   })
   ```

3. **Update storage** (`lib/storage.ts`):
   ```typescript
   // Add default value in create()
   priority: input.priority ?? 'medium',
   ```

4. **Update UI components**:
   - Add priority selector to `todo-form.tsx`
   - Display priority in `todo-item.tsx`

5. **Update MSW handlers** (`mocks/handlers.ts`):
   ```typescript
   // Add priority to mock data
   ```

6. **Write tests**:
   ```typescript
   // tests/unit/todo-form.test.tsx
   it('should allow selecting priority', () => {
     // ...
   })
   ```

### 4. Test Your Changes

```bash
# 1. Type check
npm run type-check

# 2. Lint
npm run lint

# 3. Run tests
npm test

# 4. Manual testing in browser
npm run dev
```

### 5. Commit and Push

```bash
git add .
git commit -m "feat: add priority field to todos"
git push origin task/create-todo-form
```

## Working with Data

### localStorage Structure

Todos are stored in `localStorage` under the key `"todos"`:

```typescript
// Browser DevTools > Application > Local Storage
{
  "todos": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "completed": false,
      "createdAt": "2026-02-01T09:00:00.000Z",
      "updatedAt": "2026-02-01T09:00:00.000Z"
    }
  ]
}
```

### Clear localStorage

```javascript
// Browser console
localStorage.removeItem('todos')
// Or
localStorage.clear()
```

### Seed Sample Data

```typescript
// Add to lib/storage.ts or create lib/seed.ts
export function seedTodos() {
  const sampleTodos = [
    {
      id: '1',
      title: 'Complete project proposal',
      description: 'Include budget and timeline',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // ... more samples
  ]
  
  localStorage.setItem('todos', JSON.stringify(sampleTodos))
}

// Run in browser console
seedTodos()
```

## Debugging

### React Query Devtools

TanStack Query devtools are enabled in development:

```typescript
// components/providers.tsx includes:
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// Open devtools (bottom-left corner icon)
```

**Features**:
- View all queries and their state
- See cache data
- Manually refetch
- Invalidate queries
- Monitor mutations

### MSW Debugging

MSW logs intercepted requests in the browser console:

```
[MSW] GET http://localhost:3000/api/todos (200)
[MSW] POST http://localhost:3000/api/todos (201)
```

**Disable MSW** temporarily:
```typescript
// mocks/browser.ts
if (process.env.NODE_ENV === 'development' && false) {  // Add && false
  worker.start()
}
```

### TypeScript Errors

```bash
# Show detailed errors
npm run type-check

# Common fixes:
# 1. Missing types: npm install -D @types/[package]
# 2. Import errors: Check file paths and exports
# 3. Zod inference: Ensure schemas are defined before types
```

### Network Debugging

Check MSW requests in browser Network tab:
1. Open DevTools > Network
2. MSW requests show as regular network requests
3. Inspect request/response details

## Testing

### Unit Tests

Test individual functions and components:

```typescript
// tests/unit/storage.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { LocalTodoStorage } from '@/lib/storage'

describe('LocalTodoStorage', () => {
  let storage: LocalTodoStorage
  
  beforeEach(() => {
    localStorage.clear()
    storage = new LocalTodoStorage()
  })
  
  it('should create a new todo', async () => {
    const todo = await storage.create({
      title: 'Test todo',
      description: 'Test description',
    })
    
    expect(todo.id).toBeDefined()
    expect(todo.title).toBe('Test todo')
    expect(todo.completed).toBe(false)
  })
})
```

### Integration Tests

Test component interactions with MSW:

```typescript
// tests/integration/todo-crud.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '@/app/page'

it('should create, view, and delete a todo', async () => {
  render(<App />)
  
  // Create
  await userEvent.click(screen.getByText('Add Todo'))
  await userEvent.type(screen.getByLabelText('Title'), 'New todo')
  await userEvent.click(screen.getByText('Save'))
  
  // View
  await waitFor(() => {
    expect(screen.getByText('New todo')).toBeInTheDocument()
  })
  
  // Delete
  await userEvent.click(screen.getByLabelText('Delete'))
  await userEvent.click(screen.getByText('Confirm'))
  
  await waitFor(() => {
    expect(screen.queryByText('New todo')).not.toBeInTheDocument()
  })
})
```

### E2E Tests

Test complete user flows:

```typescript
// tests/e2e/user-flows.spec.ts
import { test, expect } from '@playwright/test'

test('user can manage todos', async ({ page }) => {
  await page.goto('http://localhost:3000')
  
  // Create todo
  await page.click('text=Add Todo')
  await page.fill('[name="title"]', 'Buy groceries')
  await page.click('text=Save')
  
  // Verify todo appears
  await expect(page.locator('text=Buy groceries')).toBeVisible()
  
  // Mark complete
  await page.click('[aria-label="Mark complete"]')
  await expect(page.locator('[aria-label="Completed"]')).toBeVisible()
  
  // Delete todo
  await page.click('[aria-label="Delete"]')
  await page.click('text=Confirm')
  await expect(page.locator('text=Buy groceries')).not.toBeVisible()
})
```

## Performance Tips

### Optimize Renders

```typescript
// Use React.memo for expensive components
export const TodoItem = React.memo(({ todo }: { todo: Todo }) => {
  // ...
})

// Use useCallback for event handlers passed as props
const handleToggle = useCallback(() => {
  updateTodo({ id: todo.id, updates: { completed: !todo.completed } })
}, [todo.id, todo.completed, updateTodo])
```

### Virtualize Long Lists

For > 100 todos, use react-window:

```typescript
import { FixedSizeList } from 'react-window'

<FixedSizeList
  height={600}
  itemCount={todos.length}
  itemSize={80}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <TodoItem todo={todos[index]} />
    </div>
  )}
</FixedSizeList>
```

### Optimize Images

```typescript
import Image from 'next/image'

// Next.js automatically optimizes
<Image
  src="/icon.png"
  alt="Icon"
  width={24}
  height={24}
/>
```

## Troubleshooting

### Issue: "Cannot find module '@/...'"

**Solution**: Check `tsconfig.json` has path alias:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Issue: MSW not intercepting requests

**Solution**:
1. Check `mocks/browser.ts` is imported in `app/layout.tsx`
2. Verify browser DevTools shows `[MSW]` logs
3. Ensure service worker is registered (Application > Service Workers)

### Issue: localStorage quota exceeded

**Solution**:
```typescript
// lib/storage.ts - add size check
private writeToStorage(todos: Todo[]): void {
  const data = JSON.stringify(todos)
  if (data.length > 4_000_000) {  // 4MB warning
    console.warn('localStorage is getting full')
  }
  localStorage.setItem(this.STORAGE_KEY, data)
}
```

### Issue: Tests failing due to localStorage

**Solution**: Mock localStorage in tests:
```typescript
// vitest.setup.ts
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock as any
```

## Next Steps

1. **Review Documentation**:
   - [spec.md](./spec.md) - Feature requirements
   - [plan.md](./plan.md) - Implementation plan
   - [data-model.md](./data-model.md) - Data structures
   - [contracts/](./contracts/) - API contracts

2. **Explore Codebase**:
   - Start with `app/page.tsx` (main todo list view)
   - Follow data flow: Component → Hook → Storage/API

3. **Run Examples**:
   - Create/edit/delete todos in browser
   - Open React Query Devtools
   - Check Network tab for MSW requests

4. **Start Coding**:
   - Pick a task from [tasks.md](./tasks.md)
   - Follow development workflow above
   - Ask for help if blocked!

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [TanStack Form Docs](https://tanstack.com/form/latest)
- [shadcn/ui Docs](https://ui.shadcn.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [MSW Docs](https://mswjs.io/)
- [Zod Docs](https://zod.dev/)

### Tools
- [React Query Devtools](https://tanstack.com/query/latest/docs/react/devtools)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) (VS Code extension)
- [TypeScript Error Translator](https://ts-error-translator.vercel.app/)

## Getting Help

1. **Check Documentation**: Review specs and plan docs
2. **Search Issues**: Look for similar problems in project issues
3. **Ask Team**: Post question in team chat
4. **Debug**: Use React Query Devtools and browser DevTools
5. **Read Code**: Explore similar features in codebase

## Summary

You now have a working Todo List Manager development environment! Start by exploring the codebase, running tests, and picking up your first task. The architecture is designed to be simple yet scalable, with clear separation of concerns and excellent developer experience.

Happy coding! 🚀
