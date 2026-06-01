# Tasks: High-Fidelity ATS Template Porting

**Input**: Design documents from `/specs/001-port-html-template/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Tests are OPTIONAL. No testing suite tasks have been requested. Real-time manual functional validation and independent verification scenarios are included per user story.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions (Next.js 16 App Router)

- **Routes & Pages**: `app/[route]/page.tsx` (Server Components by default)
- **Layouts**: `app/[route]/layout.tsx` or `app/layout.tsx`
- **Shared UI Components**: `components/ui/[component].tsx` (Tailwind 4 / Base UI)
- **Feature Components**: `components/features/[feature]/[component].tsx`
- **Data Logic & Services**: `services/[service].ts`
- **Types**: `types/[type].ts`

---

## Phase 1: Setup & Environment

**Purpose**: Route structure initialization and shared environment/typings configurations

- [X] T001 Configure global design tokens, colors, custom fonts, and shadow classes inside the `@theme` block in `app/globals.css` according to Tailwind CSS 4 standards.
- [X] T002 Define core TypeScript interfaces and type definitions (e.g. `WorkspaceRole`, `Candidate`, `ActivityEvent`, `EvaluationCriteria`, `Job`, `Invoice`) in `types/index.ts`.
- [X] T003 [P] Create the global client-side `RoleContext` and `RoleProvider` in `components/features/workspace/RoleContext.tsx` to handle `tf-role` (`Recruiter` | `Admin`) persisting in `LocalStorage`.

---

## Phase 2: Foundational (Data Contracts & Core Services)

**Purpose**: Core data layer, service clients, and route configurations

**⚠️ CRITICAL**: No UI/User Story work should begin until these blockings are complete

- [X] T004 Implement the mock database & service functions in `services/mockData.ts` to simulate local in-memory DB operations (getting jobs, getting candidates, filtering candidates, dragging/dropping status shifts, getting invoices).
- [X] T005 Create parameter validation schemas using Zod in `services/schemas.ts` for form fields (Login, Signup, Workspace Settings, User Invitations).
- [X] T006 [P] Build a reusable responsive layout sidebar menu `components/features/workspace/Sidebar.tsx` with responsive toggles, branding headers, navigation routes, and role action dropdown switches.
- [X] T007 Setup mock handlers or local API route wrappers for local testing under `app/api/` (optional, for simulating async operations).

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Product Surface Launcher & Responsive Shared Navigation (Priority: P1) 🎯 MVP

**Goal**: Establish the central launcher listing all ported screen templates and verify persistent, responsive workspace sidebar layouts with active Recruiter/Admin toggles.

**Independent Test**:
- Open the application at `/` and verify the Product Launcher lists all 11 high-fidelity recruiting surfaces.
- Click any screen link, navigate to it, and confirm the presence of the persistent sidebar navigation.
- Toggle between Recruiter and Admin roles in the sidebar and verify that role-restricted sections (such as Admin-only buttons or sidebar items) show/hide dynamically.

### Implementation for User Story 1

- [X] T008 [P] [US1] Create the central Launcher component inside `app/page.tsx` displaying the high-fidelity Grid Launcher with links to all 11 ported templates.
- [X] T009 [P] [US1] Set up the global workspace shared layout `app/(workspace)/layout.tsx` wrapping routes with the `RoleProvider` and rendering the dynamic sidebar framework.
- [X] T010 [P] [US1] Create UI primitives `components/ui/badge.tsx` for visual scorecard metrics, role identifiers, and status tags.
- [X] T011 [US1] Implement the Dashboard home screen inside `app/(workspace)/dashboard/page.tsx` showing current statistics (candidate count, jobs open, scheduled interviews, etc.) matching `dashboard.html`.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Interactive Candidates Kanban Pipeline & Filter Center (Priority: P2)

**Goal**: Deliver the core recruitment flow including candidate directories, client-side searching/filtering, dragging-and-dropping candidates on the Kanban board, and reviewing detailed AI dossiers.

**Independent Test**:
- Open the Candidates page at `/candidates` and verify a Kanban board displays 6 columns (Applied, Screening, Interview, Offer, Hired, Rejected).
- Type in the search box or adjust filters (e.g. status, minimum AI score) and check if candidate cards filter dynamically.
- Drag a candidate card from "Screening" to "Interview" and confirm that column counts and status badges update instantly.
- Click a card to open the slide-over dossier panel, verify scorecards, skill tags, and the activity timeline.

### Implementation for User Story 2

- [X] T012 [P] [US2] Create the search and multi-variable filtering panel `components/features/candidates/FilterCenter.tsx` to support live searches, stage filters, and AI score sliders.
- [X] T013 [P] [US2] Implement the interactive Kanban Board layout component `components/features/candidates/KanbanBoard.tsx` with 6 columns.
- [X] T014 [P] [US2] Build the candidate card component `components/features/candidates/KanbanCard.tsx` incorporating drag handlers (`draggable`, `onDragStart`, `onDragEnd`) and visual score progress indicators.
- [X] T015 [US2] Integrate the drag-and-drop state updates into the candidates view `app/(workspace)/candidates/page.tsx` to handle native HTML5 events (`onDragOver`, `onDrop`) and count adjustments.
- [X] T016 [US2] Build the slide-over/modal dossier component `components/features/candidates/CandidateDossier.tsx` representing detailed profiles with evaluation scorecards, skill tags, and chronological timelines.
- [X] T017 [US2] Implement the individual candidate detailed route `app/(workspace)/candidates/[id]/page.tsx` showing the full-screen view of the candidate's dossier matching `candidate-detail.html`.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Essential Administrative & Authenticated Recruiting Views (Priority: P3)

**Goal**: Complete administrative governance boundaries, secure auth login/signup flows, billing summaries, job postings directories, and interview queues.

**Independent Test**:
- Visit `/login` or `/signup` and verify interactive validation triggers error messages on empty submissions.
- Check the Jobs listing at `/jobs` and filter job openings.
- Visit `/admin/users` in the Recruiter role and check if an "Access Denied" page is rendered. Toggle to the Admin role and confirm the dashboard list of seats renders correctly.

### Implementation for User Story 3

- [X] T018 [P] [US3] Create responsive authentication screens at `app/(auth)/login/page.tsx` and `app/(auth)/signup/page.tsx` with client-side error validation engine and red borders.
- [X] T019 [P] [US3] Port the static public landing page at `app/(marketing)/landing/page.tsx` featuring pricing tiers, product hero, and smooth-toggling FAQ Accordion.
- [X] T020 [P] [US3] Build the custom accordion primitive `components/ui/accordion.tsx` supporting smooth expand/collapse animations for Landing FAQs.
- [X] T021 [P] [US3] Implement the jobs list directory at `app/(workspace)/jobs/page.tsx` displaying interactive active/draft job posts and search filters matching `jobs.html`.
- [X] T022 [P] [US3] Port the individual job detail page at `app/(workspace)/jobs/[id]/page.tsx` displaying applicant statuses and details matching `job-detail.html`.
- [X] T023 [US3] Port the interview schedules and queues page at `app/(workspace)/interviews/page.tsx` matching `interviews.html`.
- [X] T024 [US3] Create the responsive billing overview and interactive invoices lists at `app/(workspace)/billing/page.tsx` matching `billing.html`.
- [X] T025 [US3] Implement the Admin User Governance interface at `app/(workspace)/admin/users/page.tsx` (wrapped in a `RoleGuard` component) to enforce Admin-only access.
- [X] T026 [US3] Port the workspace configurations page at `app/(workspace)/settings/page.tsx` with interactive settings and validation fields.

**Checkpoint**: All 11 template screens ported with interactive behaviors fully resolved.

---

## Phase 6: Polish & Core Web Vitals Optimization

**Purpose**: Quality verification, responsiveness checks, and asset/performance tuning

- [X] T027 [P] Validate responsive layouts on Mobile, Tablet, and Desktop breakpoints, fixing overlapping grid items or unwanted horizontal scrolling.
- [X] T028 [P] Audit WCAG 2.1 AA level keyboard accessibility, aria-labels, and interactive focus states.
- [X] T029 Verify strict TypeScript safety and resolve all compilation warnings using `pnpm lint` and `pnpm build`.
- [X] T030 Fine-tune Core Web Vitals performance (Lighthouse Performance >90, LCP < 2s, INP < 100ms) by optimizing images and styling tokens.

---

## Dependencies & Execution Path

The flowchart below represents the dependencies and completion sequence for the ported features:

```text
       [Phase 1: Setup & Env (T001-T003)]
                       │
                       ▼
    [Phase 2: Foundation & Sidebar (T004-T007)]
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
   [Phase 3: US1 MVP]        [Phase 5: US3 Auth & Landing]
    (Launcher/Sidebar)             (T018-T020)
       (T008-T011)                  │
          │                         │
          ▼                         ▼
   [Phase 4: US2 Kanban]     [Phase 5: US3 Workspace Screens]
     Candidates Pipeline      (Jobs, Interviews, Billing, Admin)
       (T012-T017)                 (T021-T026)
          │                         │
          └────────────┬────────────┘
                       ▼
          [Phase 6: Polish & Build]
                 (T027-T030)
```

## Parallel Execution Examples

Recruiters and admins can run several tasks simultaneously without editing collisions:
- **Foundational Setup**: T001 (globals.css/Tailwind tokens) and T002 (types/index.ts) can be run concurrently by different developers.
- **US1 & US3 Setup**: T008 (Launcher app/page.tsx) and T018 (Auth routes login/signup) can be implemented in parallel as they touch independent routes.
- **US2 Kanban features**: T012 (FilterCenter.tsx), T013 (KanbanBoard.tsx), and T014 (KanbanCard.tsx) are discrete component files and can be fully parallelized.
