# Research: Todo List Manager

**Phase**: Phase 0 - Technology Research & Best Practices  
**Created**: February 1, 2026  
**Branch**: 001-todo-list-manager

## Overview

This document captures research findings and technology decisions for the Todo List Manager implementation. Each section addresses unknowns from the Technical Context and establishes best practices for the chosen stack.

## Technology Stack Decisions

### 1. Next.js 14 (App Router) - Framework Foundation

**Decision**: Use Next.js 14 with App Router for full-stack React application

**Rationale**:
- **Server Components**: Reduces client-side JavaScript bundle, improves initial load performance
- **File-based routing**: Intuitive structure matching UI hierarchy (`app/todos/[id]/page.tsx`)
- **Built-in optimizations**: Image optimization, font optimization, automatic code splitting
- **TypeScript-first**: Excellent TypeScript support out of the box
- **Incremental adoption**: Can start with client-side (localStorage) and migrate to server-side API later
- **Developer experience**: Hot reload, error overlays, clear conventions

**Alternatives considered**:
- **Create React App**: Deprecated, lacks modern features, requires ejection for customization
- **Vite + React Router**: More configuration required, no server-side rendering, less convention
- **Remix**: Strong alternative but smaller ecosystem, steeper learning curve for App Router patterns

**Best practices**:
- Use Server Components by default, mark with 'use client' only when needed
- Leverage parallel routes for loading states (`loading.tsx`)
- Use error boundaries (`error.tsx`) for graceful error handling
- Co-locate components with routes when route-specific

### 2. shadcn/ui - Component Library

**Decision**: Use shadcn/ui as the foundation for UI components

**Rationale**:
- **Copy-paste approach**: Components live in your codebase (full control, no black box)
- **Radix UI primitives**: Built on accessible, unstyled primitives (WCAG 2.1 AA compliance)
- **Tailwind integration**: Natural fit with utility-first styling approach
- **Customizable**: Easy to modify since code is owned, not packaged
- **TypeScript support**: Fully typed components
- **Tree-shakeable**: Only include components you use

**Alternatives considered**:
- **Material-UI (MUI)**: Heavy bundle size, opinionated design hard to customize, runtime styles
- **Chakra UI**: Good alternative but runtime styles impact performance
- **Headless UI**: Similar to Radix but less ecosystem/tooling around it
- **Pure Radix UI**: More manual work to style and compose

**Best practices**:
- Install components individually: `npx shadcn-ui@latest add button`
- Customize via `components.json` for consistent theming
- Use `cn()` utility for conditional classes
- Follow shadcn composition patterns (compound components)

### 3. Tailwind CSS - Styling Strategy

**Decision**: Use Tailwind CSS 3.x for all styling

**Rationale**:
- **Utility-first**: Fast development, no context switching between files
- **Performance**: Unused styles purged, minimal CSS bundle
- **Responsive design**: Mobile-first breakpoints built-in
- **Consistency**: Design tokens prevent magic values
- **shadcn integration**: Components designed for Tailwind
- **Dark mode**: Built-in dark mode support with `class` strategy

**Alternatives considered**:
- **CSS Modules**: More boilerplate, context switching, larger CSS bundles
- **Styled Components**: Runtime overhead, harder to optimize, SSR complexity
- **Vanilla CSS**: No constraints, hard to maintain consistency

**Best practices**:
- Use `@layer components` for reusable component styles
- Configure design tokens in `tailwind.config.ts` (colors, spacing, typography)
- Use `clsx` or `cn` utility for conditional classes
- Follow mobile-first approach (base = mobile, `md:` = desktop)
- Limit custom classes - prefer composition of utilities

### 4. TanStack Form - Form Management

**Decision**: Use TanStack Form (formerly React Form) for form handling and validation

**Rationale**:
- **Type-safe**: Full TypeScript support with type inference
- **Headless**: Works with any UI library (perfect with shadcn/ui)
- **Performance**: Fine-grained reactivity, only re-renders what changed
- **Validation**: Built-in validation with adapter support (Zod, Yup, Valibot)
- **Developer experience**: Simple API, excellent error messages
- **Bundle size**: Small footprint (~5KB)

**Alternatives considered**:
- **React Hook Form**: Popular but less type-safe, more magic, harder to debug
- **Formik**: Legacy, performance issues with large forms, maintenance concerns
- **Uncontrolled forms**: Too manual, poor UX, no validation framework

**Best practices**:
- Use Zod for schema validation (great TypeScript inference)
- Leverage field-level validation for immediate feedback
- Use `onBlur` validation for better UX (not every keystroke)
- Connect to TanStack Query mutations for submission
- Create reusable field components that wrap form logic

### 5. TanStack React Query - Data Fetching & State Management

**Decision**: Use TanStack React Query v5 for server state management

**Rationale**:
- **Caching**: Automatic request deduplication, background refetching
- **Optimistic updates**: Essential for < 1s response time requirement (SC-006)
- **Devtools**: Excellent debugging experience
- **TypeScript**: Full type safety for queries and mutations
- **Suspense support**: Works with React 18 concurrent features
- **Framework agnostic**: Can migrate from localStorage to API transparently

**Alternatives considered**:
- **SWR**: Similar but less feature-rich, smaller community
- **Redux Toolkit (RTK Query)**: Overkill for this app, more boilerplate
- **Apollo Client**: GraphQL-only, too heavy for REST API
- **Native fetch + useState**: Manual cache management, no optimistic updates

**Best practices**:
- Define query keys in constants file for type safety
- Use `useQuery` for reads, `useMutation` for writes
- Enable optimistic updates for immediate UI feedback
- Configure stale time based on data characteristics (todos: 30s stale time)
- Use `queryClient.invalidateQueries()` after mutations
- Leverage `useQueries` for parallel requests

### 6. Mock Service Worker (MSW) - API Mocking

**Decision**: Use Mock Service Worker 2.x for API mocking during development

**Rationale**:
- **Service worker based**: Intercepts network requests at network level (realistic)
- **Browser + Node**: Same mocks work in development and tests
- **TypeScript support**: Type-safe request handlers
- **Network dev tools**: See mocked requests in browser Network tab
- **Migration path**: Easy to disable when real API is ready
- **No code changes**: Mocks don't pollute production code

**Alternatives considered**:
- **JSON Server**: Separate server to run, harder to customize, not co-located
- **Mirage JS**: Runtime overhead, more complex API, active development concerns
- **Manual mocking**: Hard to maintain, inconsistent between dev and test

**Best practices**:
- Define handlers in `mocks/handlers.ts`
- Use realistic response delays (50-200ms) to simulate network
- Return proper HTTP status codes (201 for create, 404 for not found)
- Share mock data between handlers (`mocks/data.ts`)
- Enable MSW only in development, not production
- Use MSW in integration tests for consistent test data

## Data Persistence Strategy

### localStorage for MVP

**Decision**: Use browser localStorage for initial implementation

**Rationale**:
- **Zero infrastructure**: No backend required, instant setup
- **Offline-first**: Works without network (constraint requirement)
- **Synchronous API**: Simpler than async storage
- **Sufficient capacity**: 5-10MB limit adequate for 100+ todos
- **Migration ready**: Abstract behind storage interface for future API

**Implementation pattern**:
```typescript
// lib/storage.ts - abstraction layer
interface TodoStorage {
  getAll(): Todo[]
  getById(id: string): Todo | null
  create(todo: Omit<Todo, 'id'>): Todo
  update(id: string, updates: Partial<Todo>): Todo
  delete(id: string): void
}

// localStorage implementation
class LocalTodoStorage implements TodoStorage {
  // ... implementation
}

// Future: API implementation
class ApiTodoStorage implements TodoStorage {
  // ... implementation uses React Query
}
```

**Migration path**: Replace localStorage with API calls without changing React Query hooks or components.

## Form Validation Strategy

### Zod for Schema Validation

**Decision**: Use Zod with TanStack Form for runtime validation

**Rationale**:
- **Type inference**: Schema defines both runtime validation and TypeScript types
- **Composable**: Build complex validations from simple schemas
- **Error messages**: Customizable, user-friendly error messages
- **TanStack integration**: First-class adapter support

**Todo validation schema**:
```typescript
import { z } from 'zod'

const todoSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less'),
  description: z.string()
    .max(1000, 'Description must be 1000 characters or less')
    .optional(),
  completed: z.boolean().default(false),
})

type TodoInput = z.infer<typeof todoSchema>
```

## Performance Optimization

### Bundle Size Management

**Strategy**: Keep initial JavaScript bundle under 200KB (gzipped)

**Techniques**:
- Dynamic imports for non-critical routes
- Tree-shaking (only import what's used from libraries)
- Image optimization via `next/image`
- Font optimization via `next/font`
- Minimize client components (leverage Server Components)

### Rendering Optimization

**Strategy**: Optimize for 60fps interactions

**Techniques**:
- Use `React.memo()` for expensive list items
- Virtualize long lists if > 100 items (react-window)
- Debounce search/filter inputs (300ms)
- Use CSS transforms for animations (GPU acceleration)
- Implement optimistic updates to hide latency

## Accessibility Strategy

### WCAG 2.1 AA Compliance

**Requirements** (from constraints):
- Keyboard navigation (tab order, enter/space, escape)
- Screen reader support (ARIA labels, semantic HTML)
- Color contrast ratios (4.5:1 for text)
- Focus indicators visible
- Error messages announced

**Implementation**:
- Radix UI primitives provide accessible base (via shadcn/ui)
- Test with keyboard only (no mouse)
- Use `eslint-plugin-jsx-a11y` for linting
- Manual testing with VoiceOver (macOS) and NVDA (Windows)
- Automated testing with axe-core in integration tests

## Testing Strategy

### Three-Layer Testing Approach

**1. Unit Tests (Vitest + React Testing Library)**
- Test utilities in isolation (`lib/storage.ts`)
- Test component logic (`todo-form.tsx` validation)
- Focus: Business logic, edge cases
- Target: 80% coverage

**2. Integration Tests (Vitest + RTL + MSW)**
- Test feature flows (create todo → appears in list)
- Test React Query hooks with MSW
- Focus: Component integration, data flow
- Target: Critical paths covered

**3. E2E Tests (Playwright)**
- Test user journeys (User Story 1-4 from spec)
- Test cross-browser compatibility
- Focus: Happy paths, critical bugs
- Target: P1-P2 user stories covered

**Test pyramid**: More unit tests, fewer integration tests, minimal E2E tests

## Development Workflow

### Local Development Setup

1. **Install dependencies**: `npm install`
2. **Run dev server**: `npm run dev` (Next.js + MSW)
3. **Run tests**: `npm test` (Vitest watch mode)
4. **Type checking**: `npm run type-check` (tsc --noEmit)
5. **Linting**: `npm run lint` (ESLint + Prettier)

### Quality Gates

**Pre-commit**:
- Format with Prettier
- Lint with ESLint
- Type-check with TypeScript

**Pre-push**:
- Run unit tests
- Run integration tests
- Build succeeds

**Pre-merge**:
- All tests pass (unit + integration + e2e)
- Code review approved
- No TypeScript errors
- Accessibility audit clean

## Security Considerations

### Client-Side Storage

**Risks**:
- XSS attacks can access localStorage
- No encryption at rest
- User can inspect/modify data

**Mitigations**:
- Input sanitization (prevent XSS)
- Content Security Policy (CSP) headers
- Don't store sensitive data in localStorage
- Validate all data read from storage (Zod schema)

### Future API Security

**Preparation**:
- Design API with authentication in mind (JWT tokens)
- Use HTTPS only
- Implement CSRF protection
- Rate limiting on mutations

## Open Questions Resolved

### ✅ Storage mechanism?
**Answer**: localStorage for MVP with abstraction layer for future API migration

### ✅ Form validation approach?
**Answer**: Zod schemas with TanStack Form for type-safe validation

### ✅ State management strategy?
**Answer**: TanStack React Query for server state, React hooks for UI state

### ✅ Component styling approach?
**Answer**: Tailwind utilities with shadcn/ui components

### ✅ Testing tools?
**Answer**: Vitest (unit), RTL (component), MSW (mocking), Playwright (e2e)

### ✅ Accessibility implementation?
**Answer**: Radix UI primitives (via shadcn/ui) + manual testing + axe-core

### ✅ Performance optimization?
**Answer**: Server Components, optimistic updates, bundle size management, memo

## References

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TanStack Form Documentation](https://tanstack.com/form)
- [TanStack Query Documentation](https://tanstack.com/query)
- [Mock Service Worker Documentation](https://mswjs.io/)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [Zod Documentation](https://zod.dev/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
