---

description: "Task list template for Next.js 16 feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions (Next.js 16 App Router)

- **Routes & Pages**: `app/(routes)/[route]/page.tsx` (Server Components)
- **Layouts**: `app/(routes)/[route]/layout.tsx` or `app/layout.tsx`
- **Shared UI Components**: `components/ui/[component].tsx` (Tailwind 4 / Base UI)
- **Feature Components**: `components/features/[feature]/[component].tsx`
- **Data Logic & Services**: `services/[service].ts`
- **Custom Hooks**: `hooks/[hook].ts`
- **Tests**: `tests/` or in colocated `__tests__` folders

---

## Phase 1: Setup & Environment

**Purpose**: Route structure initialization and shared environment/typings configurations

- [ ] T001 Create route directory at `app/(routes)/[route]` and initialize empty `page.tsx`
- [ ] T002 Define feature TypeScript type interfaces in `types/[feature].ts`
- [ ] T003 [P] Add required asset entries, Tailwind 4 utilities, or configurations in `postcss.config.mjs`

---

## Phase 2: Foundational (Data Contracts & Core Services)

**Purpose**: Core data layer, service clients, and route configurations

**⚠️ CRITICAL**: No UI/User Story work should begin until these blockings are complete

- [ ] T004 Setup data fetch client or API service wrapper in `services/[service].ts`
- [ ] T005 Create parameter validation schemas using Zod in `services/schemas.ts`
- [ ] T006 [P] Configure route metadata, static SEO requirements, or dynamic viewport headers
- [ ] T007 Setup mock handlers or local API route wrappers for local testing

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T008 [P] [US1] Unit test for data service in `tests/services/[service].test.ts`
- [ ] T009 [P] [US1] Component test for Server Component page in `tests/components/[component].test.tsx`

### Implementation for User Story 1

- [ ] T010 [P] [US1] Implement Server Component page layout and initial rendering at `app/(routes)/[route]/page.tsx`
- [ ] T011 [P] [US1] Build static presentational elements in `components/ui/[component].tsx`
- [ ] T012 [US1] Hook presentation component to service query client in `app/(routes)/[route]/page.tsx`
- [ ] T013 [US1] Implement error boundary `app/(routes)/[route]/error.tsx` and custom empty states
- [ ] T014 [US1] Integrate logging/diagnostics for data loading flows

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T015 [P] [US2] Component/Interactivity test for custom hooks in `tests/hooks/[hook].test.ts`

### Implementation for User Story 2

- [ ] T016 [P] [US2] Build leaf Client Component for interactive actions at `components/features/[feature]/[action-component].tsx`
- [ ] T017 [US2] Implement custom interaction state/handlers inside `hooks/[hook].ts`
- [ ] T018 [US2] Compose Client Component into Server Component Page at `app/(routes)/[route]/page.tsx`
- [ ] T019 [US2] Implement Server Actions with validation and authorization checks in `app/actions/[action].ts`
- [ ] T020 [US2] Integrate Next.js 16 cache router updates using `refresh()` after state change

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase N: Polish & Core Web Vitals Optimization

**Purpose**: Quality verification, responsiveness checks, and asset/performance tuning

- [ ] TXXX [P] Validate responsiveness on Mobile, Tablet, and Desktop viewports
- [ ] TXXX [P] Verify WCAG accessibility and keyboard navigation
- [ ] TXXX Verify strict TypeScript compilation and fix linting errors (`pnpm lint` + `pnpm build`)
- [ ] TXXX Optimize bundle size, lazy-load client-heavy modules if necessary
- [ ] TXXX Run local Lighthouse/Core Web Vitals checks and document results
