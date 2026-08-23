---
description: "Task list for Improve UX Density and Realism feature implementation"
---

# Tasks: Improve UX Density and Realism

**Input**: Design documents from `/specs/002-improve-ux-density/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup & Environment

**Purpose**: Route structure initialization and shared environment/typings configurations

- [X] T001 Define feature TypeScript type interfaces (`RoleContext`, `FilterState`, `ListState`) in `types/models.ts`
- [X] T002 [P] Create directories for new UI components (`components/ui/`) if they don't exist

## Phase 2: Foundational (Data Contracts & Core Services)

**Purpose**: Core data layer, service clients, and route configurations

**⚠️ CRITICAL**: No UI/User Story work should begin until these blockings are complete

- [X] T003 Centralize data fetching helpers in `services/mockData.ts` to ensure Dashboard metrics derive from the same data source/queries as List views
- [X] T004 Create parameter validation schemas using Zod for filtering state in `services/schemas.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

## Phase 3: User Story 1 - Clear Navigation and Role Context (Priority: P1) 🎯 MVP

**Goal**: Display explicit role and tenant boundaries in the main navigation and sidebar, updating dynamically on role switch.

**Independent Test**: Can be tested by switching roles/tenants and verifying that the visual context (sidebar, headers) updates to reflect the clear boundaries, without feeling like a temporary toggle.

### Implementation for User Story 1

- [X] T005 [P] [US1] Refactor main layout at `app/(workspace)/layout.tsx` to handle `RoleContext` display clearly with visual cues
- [X] T006 [US1] Update Sidebar component (e.g., in `app/(workspace)/layout.tsx` or `components/`) to clearly segregate admin vs standard tenant actions

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

## Phase 4: User Story 2 - Consistent and Trustworthy Data Views (Priority: P1)

**Goal**: Synchronize data points between summary dashboards and detailed list views to eliminate hard-coded inconsistencies.

**Independent Test**: Can be tested by verifying that numbers on the dashboard (e.g., total candidates) exactly match the counts in the corresponding list views.

### Implementation for User Story 2

- [X] T007 [P] [US2] Update Dashboard page at `app/(workspace)/dashboard/page.tsx` to use synchronized data from `services/mockData.ts`
- [X] T008 [P] [US2] Update Candidates page at `app/(workspace)/candidates/page.tsx` to use synchronized data from `services/mockData.ts`
- [X] T009 [P] [US2] Update Jobs page at `app/(workspace)/jobs/page.tsx` to use synchronized data from `services/mockData.ts`
- [X] T010 [US2] Remove fake affordances or connect them to real logic (e.g., job card '...' menu) in list components

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

## Phase 5: User Story 3 - High-Density Scannable Lists (Priority: P2)

**Goal**: High-density tabular or compact card layout using Tailwind's compact spacing optimized for rapid visual scanning.

**Independent Test**: Can be tested by loading a list of 50 candidates and verifying that key information (status, role, name) can be scanned without excessive scrolling.

### Implementation for User Story 3

- [X] T011 [P] [US3] Refactor Jobs list view components in `app/(workspace)/jobs/` to use high-density Tailwind utility classes (e.g., `p-2`, `text-sm`)
- [X] T012 [P] [US3] Refactor Candidates list view components in `app/(workspace)/candidates/` to use high-density Tailwind utility classes

## Phase 6: User Story 4 - Advanced B2B Filtering (Priority: P2)

**Goal**: Support filter chips, advanced search capabilities, and bulk actions on applicable list views via URL search params.

**Independent Test**: Can be tested by applying multiple filters to a list, verifying that filter chips appear, and performing a bulk action on the filtered results.

### Implementation for User Story 4

- [X] T013 [P] [US4] Implement `FilterState` based on URL search params and create `FilterChips` component in `components/ui/FilterChips.tsx`
- [X] T014 [P] [US4] Implement floating action bar for bulk actions in `components/ui/BulkActionBar.tsx`
- [X] T015 [US4] Integrate `FilterChips` and `BulkActionBar` into Candidates list view at `app/(workspace)/candidates/page.tsx`
- [X] T016 [US4] Integrate `FilterChips` and `BulkActionBar` into Jobs list view at `app/(workspace)/jobs/page.tsx`

## Phase 7: User Story 5 - Standardized Application States (Priority: P3)

**Goal**: Implement standardized loading skeletons, empty states, and error states for the dashboard, jobs list, candidates list, and candidate detail views.

**Independent Test**: Can be tested by simulating slow network connections or API errors and observing the UI feedback in dashboard, jobs, and candidate views.

### Implementation for User Story 5

- [X] T017 [P] [US5] Implement reusable `LoadingSkeleton` component in `components/ui/LoadingSkeleton.tsx`
- [X] T018 [P] [US5] Implement reusable `EmptyState` component in `components/ui/EmptyState.tsx`
- [X] T019 [P] [US5] Implement reusable `ErrorState` component in `components/ui/ErrorState.tsx`
- [X] T020 [US5] Integrate standardized states into Dashboard view (`app/(workspace)/dashboard/loading.tsx`, `app/(workspace)/dashboard/error.tsx`)
- [X] T021 [US5] Integrate standardized states into Jobs view (`app/(workspace)/jobs/loading.tsx`, `app/(workspace)/jobs/error.tsx`)
- [X] T022 [US5] Integrate standardized states into Candidates view (`app/(workspace)/candidates/loading.tsx`, `app/(workspace)/candidates/error.tsx`)

## Phase 8: Polish & Core Web Vitals Optimization

**Purpose**: Quality verification, responsiveness checks, and asset/performance tuning

- [X] T023 [P] Validate responsiveness on Mobile, Tablet, and Desktop viewports for high-density components
- [X] T024 [P] Verify WCAG accessibility and keyboard navigation for filter chips and bulk actions
- [X] T025 Verify strict TypeScript compilation and fix linting errors (`pnpm lint` + `pnpm build`)
- [X] T026 Run local Lighthouse/Core Web Vitals checks and document results
