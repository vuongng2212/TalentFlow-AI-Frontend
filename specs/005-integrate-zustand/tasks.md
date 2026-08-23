# Tasks: Zustand State Integration

**Input**: Design documents from [specs/005-integrate-zustand/](specs/005-integrate-zustand/)

**Prerequisites**: [plan.md](specs/005-integrate-zustand/plan.md) (required), [spec.md](specs/005-integrate-zustand/spec.md) (required for user stories), [research.md](specs/005-integrate-zustand/research.md), [data-model.md](specs/005-integrate-zustand/data-model.md), [quickstart.md](specs/005-integrate-zustand/quickstart.md)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions using markdown link format

---

## Phase 1: Setup & Environment

**Purpose**: Route structure initialization and shared environment/typings configurations

- [X] T001 Install `zustand` dependency in [package.json](package.json) using pnpm
- [X] T002 Create store directory at [lib/store/](lib/store/) to house Zustand stores

---

## Phase 2: Foundational (Data Contracts & Core Services)

**Purpose**: Core data layer, service clients, and route configurations

**⚠️ CRITICAL**: No UI/User Story work should begin until these blockings are complete

- [X] T003 [P] Implement UI layout and theme state store in [lib/store/useUIStore.ts](lib/store/useUIStore.ts)
- [X] T004 [P] Implement modal routing and visibility manager in [lib/store/useModalStore.ts](lib/store/useModalStore.ts)
- [X] T005 [P] Implement applicant database query filtering state in [lib/store/useApplicationsStore.ts](lib/store/useApplicationsStore.ts)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Sidebar Toggle & Theme State Persistence (Priority: P1) 🎯 MVP

**Goal**: Theme configuration and sidebar collapse state persist across page reloads and navigations.

**Independent Test**: Collapse the sidebar, refresh the page, and confirm it remains collapsed. Toggle theme to dark, verify variables apply, refresh, and confirm the dark theme persists.

### Implementation for User Story 1

- [X] T006 [P] [US1] Build client-side workspace shell component [components/features/workspace/WorkspaceShell.tsx](components/features/workspace/WorkspaceShell.tsx) to prevent hydration mismatches
- [X] T007 [US1] Refactor root workspace layout layout [app/(workspace)/layout.tsx](app/(workspace)/layout.tsx) to render the WorkspaceShell
- [X] T008 [P] [US1] Define CSS selectors for sidebar collapse and toggle actions in [app/globals.css](app/globals.css)
- [X] T009 [US1] Refactor navigation sidebar [components/features/workspace/Sidebar.tsx](components/features/workspace/Sidebar.tsx) to read theme and layout configurations from the UI store
- [X] T010 [US1] Add interactive theme selector and sidebar collapse button to [components/features/workspace/Sidebar.tsx](components/features/workspace/Sidebar.tsx)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Global Modal Management (Priority: P1)

**Goal**: Modal dialogs triggerable and closable globally without complex prop-drilling or local state.

**Independent Test**: Trigger CV upload modal and Job creation modals, click outside or use close actions, and verify modal open/closed states update globally.

### Implementation for User Story 2

- [X] T011 [US2] Update Candidate Applications page [app/(workspace)/candidates/page.tsx](app/(workspace)/candidates/page.tsx) to open candidate CV upload modal via the modal store
- [X] T012 [US2] Update candidate CV upload modal [components/features/candidates/UploadCvModal.tsx](components/features/candidates/UploadCvModal.tsx) to consume state from the global modal store
- [X] T013 [US2] Update Jobs list page [app/(workspace)/jobs/page.tsx](app/(workspace)/jobs/page.tsx) to trigger job creation modal via the modal store
- [X] T014 [US2] Update job creation modal [components/features/jobs/CreateJobModal.tsx](components/features/jobs/CreateJobModal.tsx) to read active modal state from the global modal store
- [X] T015 [US2] Refactor job edit modal [components/features/jobs/EditJobModal.tsx](components/features/jobs/EditJobModal.tsx) to fetch job payload data from the global modal store

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Candidate Applications Filtering & View Mode State (Priority: P2)

**Goal**: Candidate filter choices, pagination, view mode, and selected candidate list are synchronized and persist during navigation.

**Independent Test**: Apply filters and select candidates in the candidates list view. Navigate to a candidate profile, go back, and verify the selection checklist and filters remain.

### Implementation for User Story 3

- [X] T016 [US3] Refactor Candidate Applications page [app/(workspace)/candidates/page.tsx](app/(workspace)/candidates/page.tsx) to replace local useState hooks with candidate search store selections
- [X] T017 [US3] Refactor filter center [components/features/candidates/FilterCenter.tsx](components/features/candidates/FilterCenter.tsx) to consume filter values from the candidate search store
- [X] T018 [US3] Refactor filter chips [components/ui/FilterChips.tsx](components/ui/FilterChips.tsx) and bulk action bar [components/ui/BulkActionBar.tsx](components/ui/BulkActionBar.tsx) to connect to active filters and candidate selections

**Checkpoint**: At this point, User Stories 1, 2, and 3 should all work independently

---

## Phase 6: Polish & Core Web Vitals Optimization

**Purpose**: Quality verification, responsiveness checks, and asset/performance tuning

- [X] T019 [P] Verify type safety and fix ESLint errors by running ESLint checks defined in [package.json](package.json)
- [ ] T020 Verify production builds by running Next.js build script defined in [package.json](package.json)
- [ ] T021 Run Playwright E2E tests to verify candidate and job list integration using test runner defined in [package.json](package.json)

---

## Implementation Strategy & MVP Scope

- **MVP Scope**: Focus on establishing Zustand foundation and implementing User Story 1 (Sidebar collapse and Theme persistence) to verify hydration-safe state management across the workspace.
- **Incremental Delivery**: Deliver US1 first, then integrate US2 (modals) since it doesn't interact with list states, and finally integrate US3 (applications filtering) since it requires complex refactoring of the applications table and board.

---

## Dependencies & Completion Order

```text
Foundational (T003 - T005)
 ├── User Story 1 (T006 - T010) --> Independently testable
 ├── User Story 2 (T011 - T015) --> Independently testable
 └── User Story 3 (T016 - T018) --> Independently testable
      └── Polish & Verification (T019 - T021)
```

- **Foundational Tasks (T003-T005)** must complete before any User Story implementation can begin.
- **User Story 1, 2, and 3** are independent of each other and can be implemented in parallel.

---

## Parallel Execution Examples

- **Developer A**: Works on User Story 1 (Workspace layout modifications in [layout.tsx](app/\(workspace\)/layout.tsx), [Sidebar.tsx](components/features/workspace/Sidebar.tsx), [WorkspaceShell.tsx](components/features/workspace/WorkspaceShell.tsx)).
- **Developer B**: Works on User Story 2 (Modal refactoring in [CreateJobModal.tsx](components/features/jobs/CreateJobModal.tsx), [UploadCvModal.tsx](components/features/candidates/UploadCvModal.tsx), [EditJobModal.tsx](components/features/jobs/EditJobModal.tsx)).
- **Developer C**: Works on User Story 3 (Applications list filtering and view modes in [page.tsx](app/\(workspace\)/candidates/page.tsx), [FilterCenter.tsx](components/features/candidates/FilterCenter.tsx)).
