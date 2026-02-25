# Tasks: Todo List Manager

**Feature**: Todo List Manager  
**Branch**: `001-todo-list-manager`  
**Input**: Design documents from `/specs/001-todo-list-manager/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are NOT requested in the specification - focusing on implementation tasks only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

This is a Next.js web application with the following structure:

- **App Router**: `app/` directory for routes and pages
- **Components**: `components/` for React components
- **Library**: `lib/` for core logic, hooks, types, utilities
- **Mocks**: `mocks/` for MSW handlers
- **Tests**: `tests/` for unit, integration, and e2e tests

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Initialize Next.js project with all required dependencies and tooling

- [x] T001 Create Next.js 14 project with TypeScript and App Router configuration
- [x] T002 [P] Install and configure Tailwind CSS 3.x with Next.js integration
- [x] T003 [P] Install shadcn/ui CLI and initialize configuration (components.json)
- [x] T004 [P] Install TanStack React Query v5 and configure QueryClient
- [x] T005 [P] Install TanStack Form and Zod for form validation
- [x] T006 [P] Install Mock Service Worker 2.x for API mocking
- [ ] T007 [P] Install Vitest, React Testing Library, and Playwright for testing
- [x] T008 [P] Configure ESLint and Prettier for code quality
- [x] T009 [P] Setup path aliases (@/) in tsconfig.json and next.config.js
- [x] T010 Create project directory structure (app/, components/, lib/, mocks/, tests/)

**Checkpoint**: Project initialized - all dependencies installed, basic structure in place

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T011 Create TypeScript type definitions in lib/types.ts (Todo, CreateTodoInput, UpdateTodoInput, TodoFilters)
- [x] T012 Create Zod validation schemas in lib/validation.ts (createTodoSchema, updateTodoSchema, todoFiltersSchema)
- [x] T013 [P] Implement localStorage storage abstraction in lib/storage.ts (LocalTodoStorage class)
- [x] T014 [P] Install shadcn/ui button component (npx shadcn-ui@latest add button)
- [x] T015 [P] Install shadcn/ui input component (npx shadcn-ui@latest add input)
- [x] T016 [P] Install shadcn/ui checkbox component (npx shadcn-ui@latest add checkbox)
- [x] T017 [P] Install shadcn/ui card component (npx shadcn-ui@latest add card)
- [x] T018 [P] Install shadcn/ui dialog component (npx shadcn-ui@latest add dialog)
- [x] T019 [P] Create utility functions in lib/utils.ts (cn helper, date formatters)
- [x] T020 Create React Query provider wrapper in components/providers.tsx
- [x] T021 Setup root layout in app/layout.tsx with providers and global styles
- [x] T022 [P] Create MSW browser setup in mocks/browser.ts with service worker configuration
- [x] T023 [P] Create mock todo data in mocks/data.ts (sample todos for development)
- [x] T024 Create MSW request handlers skeleton in mocks/handlers.ts (empty handlers array)

**Checkpoint**: Foundation ready - type safety, storage, UI components, and mocking infrastructure in place. User story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Create and View Todo Items (Priority: P1) 🎯 MVP

**Goal**: Enable users to create todo items and view them in a list. This delivers the foundational value of the application.

**Independent Test**: Create several todos with different titles, verify they appear in the list, click a todo to view its details. This should work without any other features.

### Implementation for User Story 1

- [x] T025 [P] [US1] Create TanStack Query hooks in lib/hooks/use-todos.ts (useTodos, useTodo, useCreateTodo)
- [x] T026 [P] [US1] Implement MSW GET /api/todos handler in mocks/handlers.ts (list todos with filters)
- [x] T027 [P] [US1] Implement MSW POST /api/todos handler in mocks/handlers.ts (create todo with validation)
- [x] T028 [P] [US1] Implement MSW GET /api/todos/:id handler in mocks/handlers.ts (get single todo)
- [x] T029 [P] [US1] Create TodoItem component in components/todo-item.tsx (display single todo with title and status)
- [x] T030 [P] [US1] Create TodoList component in components/todo-list.tsx (render list of TodoItems)
- [x] T031 [P] [US1] Create EmptyState component in components/empty-state.tsx (display when no todos exist)
- [x] T032 [US1] Create TanStack Form integration hook in lib/hooks/use-todo-form.ts (form state management)
- [x] T033 [US1] Create TodoForm component in components/todo-form.tsx (title and description inputs with validation)
- [x] T034 [US1] Implement home page in app/page.tsx (display TodoList, handle empty state, show "Add Todo" button)
- [x] T035 [US1] Implement new todo page in app/todos/new/page.tsx (TodoForm with create mutation)
- [x] T036 [US1] Implement todo detail page in app/todos/[id]/page.tsx (display full todo details)
- [x] T037 [US1] Add navigation between list and detail views (Link components)
- [x] T038 [US1] Add loading states for data fetching (Suspense boundaries or loading.tsx files)
- [x] T039 [US1] Add error handling and error boundaries (error.tsx files)
- [x] T040 [US1] Style components with Tailwind CSS (responsive, mobile-first design)

**Checkpoint**: At this point, User Story 1 should be fully functional. Users can create todos, view the list, and see todo details. This is the MVP!

---

## Phase 4: User Story 2 - Mark Items as Done or Not Done (Priority: P2)

**Goal**: Enable users to track progress by toggling completion status of todos.

**Independent Test**: Create a todo, mark it complete, verify visual change, mark it incomplete, verify it reverts. This works independently of editing or deleting.

### Implementation for User Story 2

- [x] T041 [P] [US2] Add useUpdateTodo mutation hook to lib/hooks/use-todos.ts (optimistic update support)
- [x] T042 [P] [US2] Implement MSW PUT /api/todos/:id handler in mocks/handlers.ts (update todo fields)
- [x] T043 [US2] Add completion checkbox to TodoItem component in components/todo-item.tsx (with toggle handler)
- [x] T044 [US2] Add visual styling for completed items in components/todo-item.tsx (strikethrough, opacity, color)
- [x] T045 [US2] Implement optimistic updates in useUpdateTodo mutation (instant UI feedback)
- [x] T046 [US2] Add completion status toggle in todo detail page app/todos/[id]/page.tsx
- [x] T047 [US2] Add filter UI in app/page.tsx (show all/active/completed todos)
- [x] T048 [US2] Update useTodos hook to support completion filter query parameter

**Checkpoint**: At this point, User Stories 1 AND 2 work independently. Users can create, view, and mark todos as complete.

---

## Phase 5: User Story 3 - Modify Todo Item Details (Priority: P3)

**Goal**: Enable users to edit todo titles and descriptions after creation.

**Independent Test**: Create a todo, click edit, change title and description, save, verify changes persist. Cancel edit should revert changes.

### Implementation for User Story 3

- [x] T049 [P] [US3] Create edit todo page in app/todos/[id]/edit/page.tsx (TodoForm pre-filled with existing data)
- [x] T050 [US3] Add edit mode state management to TodoForm component in components/todo-form.tsx
- [x] T051 [US3] Update TodoForm to handle both create and update modes (conditional submission)
- [x] T052 [US3] Add "Edit" button to todo detail page in app/todos/[id]/page.tsx
- [x] T053 [US3] Add "Cancel" button to TodoForm with navigation back to detail page
- [x] T054 [US3] Implement form validation for edit mode (same rules as create)
- [x] T055 [US3] Add success toast/notification after successful edit (optional but recommended)
- [x] T056 [US3] Handle edit errors gracefully (display validation errors inline)

**Checkpoint**: At this point, User Stories 1, 2, AND 3 work independently. Users can create, view, mark complete, and edit todos.

---

## Phase 6: User Story 4 - Delete Todo Items (Priority: P3)

**Goal**: Enable users to remove todos that are no longer needed.

**Independent Test**: Create a todo, delete it with confirmation, verify it's removed from list. Cancel delete should keep the todo.

### Implementation for User Story 4

- [x] T057 [P] [US4] Add useDeleteTodo mutation hook to lib/hooks/use-todos.ts (with cache invalidation)
- [x] T058 [P] [US4] Implement MSW DELETE /api/todos/:id handler in mocks/handlers.ts (remove todo)
- [x] T059 [P] [US4] Install shadcn/ui alert-dialog component (npx shadcn-ui@latest add alert-dialog)
- [x] T060 [US4] Create DeleteConfirmation dialog component in components/delete-confirmation.tsx
- [x] T061 [US4] Add "Delete" button to TodoItem component in components/todo-item.tsx (opens dialog)
- [x] T062 [US4] Add "Delete" button to todo detail page in app/todos/[id]/page.tsx (opens dialog)
- [x] T063 [US4] Implement delete confirmation flow with cancel option in DeleteConfirmation component
- [x] T064 [US4] Handle successful deletion (navigate back to home page after delete)
- [x] T065 [US4] Add optimistic deletion update (remove from UI immediately)

**Checkpoint**: All user stories should now be independently functional. Full CRUD operations available.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and enhance overall quality

- [ ] T066 [P] Add keyboard navigation support (Tab, Enter, Escape keys)
- [ ] T067 [P] Add ARIA labels and roles for screen reader accessibility
- [ ] T068 [P] Test and fix color contrast ratios for WCAG 2.1 AA compliance
- [ ] T069 [P] Implement search functionality in todo list (filter by title/description)
- [ ] T070 [P] Add sort options for todo list (by date, title, completion status)
- [ ] T071 [P] Implement virtual scrolling for large lists (if > 100 items)
- [ ] T072 [P] Add favicon and app metadata in app/layout.tsx
- [ ] T073 [P] Create README.md with setup instructions and feature overview
- [ ] T074 [P] Add loading skeletons for better perceived performance
- [ ] T075 [P] Implement error retry logic for failed mutations
- [ ] T076 [P] Add localStorage quota checking and warnings
- [ ] T077 [P] Optimize bundle size (analyze with next/bundle-analyzer)
- [ ] T078 [P] Add dark mode support (Tailwind dark: classes)
- [ ] T079 [P] Test cross-browser compatibility (Chrome, Safari, Firefox)
- [ ] T080 [P] Test mobile responsiveness on various screen sizes
- [ ] T081 Run quickstart.md validation (follow setup guide and verify it works)
- [ ] T082 Performance audit (Lighthouse score > 90)
- [ ] T083 Security audit (check for XSS vulnerabilities, CSP headers)
- [ ] T084 Final accessibility audit with axe-core or similar tool

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational) ← BLOCKS ALL USER STORIES
    ↓
    ├─→ Phase 3 (US1 - P1) ← MVP
    ├─→ Phase 4 (US2 - P2)
    ├─→ Phase 5 (US3 - P3)
    └─→ Phase 6 (US4 - P3)
    ↓
Phase 7 (Polish)
```

1. **Setup (Phase 1)**: No dependencies - can start immediately
2. **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
3. **User Stories (Phases 3-6)**: All depend on Foundational phase completion
   - User stories CAN proceed in parallel (if team capacity allows)
   - OR sequentially in priority order: US1 (P1) → US2 (P2) → US3 (P3) → US4 (P3)
   - Each story is independently testable
4. **Polish (Phase 7)**: Depends on desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Requires Phase 2 completion - No dependencies on other stories
  - Delivers MVP: Users can create and view todos
  - Can be deployed independently
- **User Story 2 (P2)**: Requires Phase 2 completion - Enhances US1 but doesn't break it
  - Adds completion tracking to existing todos
  - Independently testable by toggling completion status
- **User Story 3 (P3)**: Requires Phase 2 completion - Enhances US1 but doesn't break it
  - Adds editing capability to existing todos
  - Independently testable by editing and saving changes
- **User Story 4 (P3)**: Requires Phase 2 completion - Enhances US1 but doesn't break it
  - Adds deletion capability to existing todos
  - Independently testable by deleting and confirming removal

### Within Each User Story

**Typical execution flow**:

1. **Hooks & API mocks** (parallel) - Set up data layer
2. **Components** (parallel) - Build UI layer
3. **Pages** (sequential) - Integrate components into routes
4. **Polish** (parallel) - Add styling, loading states, error handling

**Parallel opportunities within stories**:

- MSW handlers can be written in parallel (different endpoints)
- React Query hooks can be written in parallel (different operations)
- Components can be built in parallel (TodoItem, TodoList, TodoForm are independent)
- Styling tasks can be done in parallel with functionality

### Critical Path (Fastest to MVP)

For fastest time to MVP (User Story 1 only):

```
T001-T010 (Setup)
  → T011-T024 (Foundational)
  → T025, T026, T027 (Data layer)
  → T029, T030, T033 (Core components)
  → T034, T035, T036 (Pages)
  → T040 (Styling)
```

Minimum viable task count for MVP: ~40 tasks (Phases 1-3)

---

## Parallel Execution Examples

### Parallel Example: Foundational Phase

```bash
# These can all run in parallel (different files):
- T013: Implement localStorage storage in lib/storage.ts
- T014: Add shadcn button in components/ui/button.tsx
- T015: Add shadcn input in components/ui/input.tsx
- T016: Add shadcn checkbox in components/ui/checkbox.tsx
- T019: Create utilities in lib/utils.ts
- T022: Setup MSW browser in mocks/browser.ts
- T023: Create mock data in mocks/data.ts
```

### Parallel Example: User Story 1

```bash
# Phase 1: Data layer (parallel)
- T025: Create React Query hooks in lib/hooks/use-todos.ts
- T026: MSW GET handler in mocks/handlers.ts (list)
- T027: MSW POST handler in mocks/handlers.ts (create)
- T028: MSW GET handler in mocks/handlers.ts (single)

# Phase 2: UI components (parallel)
- T029: TodoItem component in components/todo-item.tsx
- T030: TodoList component in components/todo-list.tsx
- T031: EmptyState component in components/empty-state.tsx
- T033: TodoForm component in components/todo-form.tsx

# Phase 3: Pages (sequential or parallel if separate developers)
- T034: Home page in app/page.tsx
- T035: New todo page in app/todos/new/page.tsx
- T036: Detail page in app/todos/[id]/page.tsx
```

### Parallel Example: Polish Phase

```bash
# These can all run in parallel (different concerns):
- T066: Keyboard navigation
- T067: ARIA labels
- T069: Search functionality
- T070: Sort options
- T072: Favicon and metadata
- T073: README documentation
- T074: Loading skeletons
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

**Goal**: Ship working product as fast as possible

1. ✅ Complete Phase 1: Setup (~2-3 hours)
2. ✅ Complete Phase 2: Foundational (~4-6 hours) - CRITICAL
3. ✅ Complete Phase 3: User Story 1 (~6-8 hours)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo MVP (create and view todos)

**Total MVP time**: ~12-17 hours for a working todo app

### Incremental Delivery

**Goal**: Ship value continuously, each story adds capability

1. **Sprint 1**: Setup + Foundational → Foundation ready
2. **Sprint 2**: User Story 1 → Test independently → Deploy/Demo (MVP!)
   - Users can create and view todos
3. **Sprint 3**: User Story 2 → Test independently → Deploy/Demo
   - Users can now mark todos complete
4. **Sprint 4**: User Story 3 → Test independently → Deploy/Demo
   - Users can now edit todos
5. **Sprint 5**: User Story 4 → Test independently → Deploy/Demo
   - Users can now delete todos
6. **Sprint 6**: Polish → Final testing → Production deploy

**Each sprint delivers working, testable functionality without breaking previous features**

### Parallel Team Strategy

With multiple developers:

1. **Week 1**: Team completes Setup + Foundational together (~1-2 days)
2. **Week 2**: Once Foundational is done, split work:
   - Developer A: User Story 1 (create/view)
   - Developer B: User Story 2 (mark complete)
   - Developer C: User Story 3 + 4 (edit/delete)
3. **Week 3**: Stories integrate and test independently
4. **Week 4**: Polish phase - everyone contributes

**Timeline**: 3-4 weeks for full feature with 3 developers working in parallel

### Solo Developer Strategy

1. **Days 1-2**: Setup + Foundational (build foundation right)
2. **Days 3-4**: User Story 1 (MVP - create/view)
3. **Day 5**: Test MVP, fix issues, maybe deploy
4. **Day 6**: User Story 2 (completion tracking)
5. **Day 7**: User Story 3 (editing)
6. **Day 8**: User Story 4 (deletion)
7. **Days 9-10**: Polish, testing, deployment

**Timeline**: ~2 weeks for full feature with one developer

---

## Task Summary

### By Phase

| Phase                 | Task Count   | Description                              |
| --------------------- | ------------ | ---------------------------------------- |
| Phase 1: Setup        | 10 tasks     | Project initialization                   |
| Phase 2: Foundational | 14 tasks     | Core infrastructure (BLOCKS all stories) |
| Phase 3: US1 (P1)     | 16 tasks     | Create and view todos (MVP)              |
| Phase 4: US2 (P2)     | 8 tasks      | Mark complete/incomplete                 |
| Phase 5: US3 (P3)     | 8 tasks      | Edit todo details                        |
| Phase 6: US4 (P3)     | 9 tasks      | Delete todos                             |
| Phase 7: Polish       | 19 tasks     | Cross-cutting improvements               |
| **TOTAL**             | **84 tasks** | Complete feature implementation          |

### By User Story

| User Story           | Priority | Task Count | MVP?                  |
| -------------------- | -------- | ---------- | --------------------- |
| Setup + Foundational | -        | 24 tasks   | ✅ Required for MVP   |
| US1: Create and View | P1       | 16 tasks   | ✅ MVP                |
| US2: Mark Complete   | P2       | 8 tasks    | ⭐ High value         |
| US3: Edit Details    | P3       | 8 tasks    | Nice to have          |
| US4: Delete Items    | P3       | 9 tasks    | Nice to have          |
| Polish               | -        | 19 tasks   | Optional enhancements |

### Parallel Opportunities

- **Phase 1**: 8 out of 10 tasks can run in parallel
- **Phase 2**: 11 out of 14 tasks can run in parallel
- **Phase 3 (US1)**: 9 out of 16 tasks can run in parallel
- **Phase 4 (US2)**: 3 out of 8 tasks can run in parallel
- **Phase 5 (US3)**: 2 out of 8 tasks can run in parallel
- **Phase 6 (US4)**: 4 out of 9 tasks can run in parallel
- **Phase 7**: 18 out of 19 tasks can run in parallel

**Total parallelizable tasks**: 55 out of 84 (65%)

### Recommended Delivery Milestones

1. **Milestone 1 (MVP)**: Phases 1-3 complete (40 tasks) - ~2 weeks solo, ~1 week with team
   - ✅ Users can create todos
   - ✅ Users can view todo list
   - ✅ Users can see todo details
   - ✅ Data persists in localStorage

2. **Milestone 2**: Add Phase 4 (48 tasks total) - +2-3 days
   - ✅ All Milestone 1 features
   - ✅ Users can mark todos complete
   - ✅ Visual distinction for completed todos

3. **Milestone 3**: Add Phases 5-6 (65 tasks total) - +1 week
   - ✅ All Milestone 2 features
   - ✅ Users can edit todos
   - ✅ Users can delete todos
   - ✅ Full CRUD functionality

4. **Milestone 4 (Production Ready)**: Add Phase 7 (84 tasks total) - +1 week
   - ✅ All Milestone 3 features
   - ✅ Accessibility compliant
   - ✅ Performance optimized
   - ✅ Cross-browser tested
   - ✅ Production ready

---

## Notes & Best Practices

### Task Execution Tips

- ✅ **[P] tasks** = Different files, no dependencies - safe to parallelize
- ✅ **[Story] label** = Maps task to specific user story for traceability
- ✅ **File paths** = Every task includes exact file location
- ✅ **Checkpoint** = Stop and validate story works independently
- ✅ **Commit often** = After each task or logical group
- ✅ **Test incrementally** = Don't wait until the end

### Common Pitfalls to Avoid

- ❌ Skipping Foundational phase (Phase 2) - it blocks everything
- ❌ Working on multiple user stories simultaneously without finishing one
- ❌ Not testing each user story independently before moving on
- ❌ Over-engineering early - start with MVP, add features incrementally
- ❌ Ignoring parallel opportunities - use [P] markers to speed up development
- ❌ Breaking independent testability - each story should work on its own

### Quality Gates

**Before considering a user story "done"**:

1. All tasks for that story completed
2. Story independently testable (doesn't require other stories)
3. No TypeScript errors
4. No ESLint warnings
5. Component styling complete (responsive, accessible)
6. Manual testing in browser confirms all acceptance scenarios
7. Checkpoint validated

**Before considering Phase 7 (Polish) complete**:

1. Lighthouse score > 90 (performance, accessibility, best practices)
2. Cross-browser testing passed (Chrome, Safari, Firefox)
3. Mobile responsiveness verified (320px to 1920px)
4. Keyboard navigation works throughout app
5. Screen reader testing completed
6. No console errors or warnings
7. quickstart.md validated (someone can follow it successfully)

---

## Getting Started

### Quick Start

1. **Choose your strategy**: MVP First (fastest), Incremental Delivery (continuous value), or Parallel Team (fastest with multiple devs)
2. **Start with Phase 1**: Run tasks T001-T010 to set up the project
3. **Complete Phase 2**: Run tasks T011-T024 to build the foundation (CRITICAL!)
4. **Pick a user story**: Start with US1 (P1) for MVP approach
5. **Execute tasks**: Follow task order, use [P] markers for parallel work
6. **Validate at checkpoints**: Test each story independently before continuing
7. **Iterate**: Add more user stories, polish, deploy!

### Task Management

Create GitHub issues or project board items for each task:

- Use task ID as issue number or reference
- Add labels: `user-story-1`, `user-story-2`, `phase-setup`, `phase-foundational`, `phase-polish`
- Add priority labels: `p1-mvp`, `p2-high`, `p3-nice-to-have`
- Track parallel opportunities: Add `can-parallelize` label to [P] tasks

### Example: Creating Issues from Tasks

```bash
# Task T001 becomes:
Issue #1: "T001: Create Next.js 14 project with TypeScript"
Labels: phase-setup, can-parallelize
Priority: p1-mvp
Story: N/A (Setup phase)

# Task T025 becomes:
Issue #25: "T025 [US1]: Create TanStack Query hooks in lib/hooks/use-todos.ts"
Labels: user-story-1, phase-us1, can-parallelize
Priority: p1-mvp
Story: US1
```

---

**Ready to start building?** Begin with Phase 1 (Setup) and work through the foundational tasks before implementing any user stories. Remember: each user story should be independently testable! 🚀
