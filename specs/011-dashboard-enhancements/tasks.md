# Tasks: Dashboard Layout and Component Enhancements

**Input**: Design documents from `/specs/011-dashboard-enhancements/`

**Prerequisites**: [plan.md](./plan.md) (required), [spec.md](./spec.md) (required for user stories), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/dashboard-api.json](./contracts/dashboard-api.json)

**Tests**: Tests are OPTIONAL - none are requested for this feature.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Contains exact file paths in descriptions

## Path Conventions (Next.js 16 App Router)

- **Routes & Pages**: `app/(workspace)/dashboard/page.tsx`
- **Feature Components**: `app/(workspace)/dashboard/RecruitmentTrendChart.tsx`
- **Data Logic & Services**: `services/api/analytics.service.ts`
- **Global CSS**: `app/globals.css`

---

## Phase 1: Setup & Environment

**Purpose**: Route structure verification and Tailwind CSS 4 theme configurations

- [x] T001 Verify route directory and component files exist at app/(workspace)/dashboard/page.tsx
- [x] T002 [P] Verify feature TypeScript type interfaces in types/index.ts
- [x] T003 [P] Verify styling setup and theme variables in app/globals.css

---

## Phase 2: Foundational (Data Contracts & Core Services)

**Purpose**: Core data layer, service client checks, and API contract matching

**⚠️ CRITICAL**: No UI/User Story work should begin until these blockings are complete

- [x] T004 Verify analytics service methods map to contracts/dashboard-api.json endpoints in services/api/analytics.service.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Fixed Pipeline Stage Layout & Visual Share (Priority: P1) 🎯 MVP

**Goal**: Resolve overlapping stage badges and counts using Flexbox, compute stage percentage shares, and render a horizontal progress bar underneath each stage.

**Independent Test**: Open the dashboard, navigate to Pipeline Breakdown, verify stage names on the left and counts on the right align cleanly without overlaps, and verify a horizontal progress bar underneath each stage representing its percentage of total candidates.

### Implementation for User Story 1

- [x] T005 [US1] Create a mock utility to test zero total applications fallback in app/(workspace)/dashboard/page.tsx
- [x] T006 [P] [US1] Implement Flexbox layout with justify-between and items-center for stage rows in app/(workspace)/dashboard/page.tsx
- [x] T007 [US1] Implement percentage share calculation with a fallback default of 0% if total candidates is 0 in app/(workspace)/dashboard/page.tsx
- [x] T008 [US1] Render horizontal progress bar beneath each pipeline stage row in app/(workspace)/dashboard/page.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Recruitment Activity Trend Chart (Priority: P2)

**Goal**: Render a custom responsive SVG-based area and line chart for daily application volumes in the Recruitment Activity Trend card.

**Independent Test**: Load the dashboard, check the Recruitment Activity Trend card, verify the responsive SVG chart fits container width, and verify empty trends array displays the placeholder "No trend data available".

### Implementation for User Story 2

- [x] T009 [P] [US2] Create the RecruitmentTrendChart component file at app/(workspace)/dashboard/RecruitmentTrendChart.tsx
- [x] T010 [P] [US2] Implement responsive SVG container with viewBox and responsive handlers in app/(workspace)/dashboard/RecruitmentTrendChart.tsx
- [x] T011 [US2] Implement SVG path generators for the activity trend line and area fill in app/(workspace)/dashboard/RecruitmentTrendChart.tsx
- [x] T012 [US2] Implement empty trends array placeholder displaying "No trend data available" inside app/(workspace)/dashboard/RecruitmentTrendChart.tsx
- [x] T013 [US2] Import and render RecruitmentTrendChart in the main dashboard page at app/(workspace)/dashboard/page.tsx

**Checkpoint**: At this point, User Stories 1 and 2 should both work independently

---

## Phase 5: User Story 3 - Modernized Stats Summary (Priority: P3)

**Goal**: Redesign the 4 metric cards with premium backgrounds, category icons, percentage changes/premium indicators, and high-visibility typography hierarchy.

**Independent Test**: Verify four top metrics cards show Open Positions, Total Applications, Candidate Database, and Hired Count with premium gradient styles, matching custom SVG icons, and explicit sub-labels.

### Implementation for User Story 3

- [x] T014 [P] [US3] Design and inline custom SVG icons for each of the 4 stat cards in app/(workspace)/dashboard/page.tsx
- [x] T015 [P] [US3] Apply premium gradient backgrounds and borders to stat cards in app/(workspace)/dashboard/page.tsx
- [x] T016 [US3] Update stat card content hierarchy with values, labels, and percentage rate indicators in app/(workspace)/dashboard/page.tsx

**Checkpoint**: At this point, User Stories 1, 2, and 3 should all work independently

---

## Phase 6: User Story 4 - Department-Enhanced Job Performance Table (Priority: P4)

**Goal**: Add department category icons, zebra striping, hover transition highlights, explicit column widths, and styled pill badges for application counts to the Top Performing Jobs table.

**Independent Test**: Locate Top Performing Jobs table, verify zebra striping and row hover effects, verify department icons appear alongside names, and verify long text uses ellipsis clipping.

### Implementation for User Story 4

- [x] T017 [P] [US4] Define custom SVG department category icons and inline helper map in app/(workspace)/dashboard/page.tsx
- [x] T018 [P] [US4] Configure explicit colgroup and column widths in the table layout in app/(workspace)/dashboard/page.tsx
- [x] T019 [US4] Update table rows with zebra striping styles and hover transition highlights in app/(workspace)/dashboard/page.tsx
- [x] T020 [US4] Implement styled pill badges for job application counts in app/(workspace)/dashboard/page.tsx
- [x] T021 [US4] Add CSS text truncation and ellipsis classes to job title and department columns in app/(workspace)/dashboard/page.tsx

**Checkpoint**: At this point, all User Stories (1 through 4) should be fully operational

---

## Phase 7: Polish & Core Web Vitals Optimization

**Purpose**: Quality verification, responsiveness checks, and asset/performance tuning

- [x] T022 [P] Validate responsiveness on Mobile, Tablet, and Desktop viewports for app/(workspace)/dashboard/page.tsx
- [x] T023 [P] Verify WCAG accessibility and keyboard navigation on app/(workspace)/dashboard/page.tsx
- [x] T024 Verify strict TypeScript compilation and fix linting errors in app/(workspace)/dashboard/page.tsx and app/(workspace)/dashboard/RecruitmentTrendChart.tsx
- [x] T025 Run local Lighthouse/Core Web Vitals checks and document results for app/(workspace)/dashboard/page.tsx

---

## Implementation Strategy & Dependencies

### User Story Dependency Graph

```text
               ┌───────────────────────┐
               │    Phase 1 & 2 Setup  │
               └───────────┬───────────┘
                           │
                           ▼
               ┌───────────────────────┐
               │  US1: Pipeline Layout │ (P1 - MVP)
               └───────────┬───────────┘
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
      ┌───────────┐  ┌───────────┐  ┌───────────┐
      │ US2: SVG  │  │ US3: Stat │  │US4: Jobs  │ (P2, P3, P4 are independent)
      │ Chart     │  │ Cards     │  │ Table     │
      └─────┬─────┘  └─────┬─────┘  └─────┬─────┘
            │              │              │
            └──────────────┼──────────────┘
                           ▼
               ┌───────────────────────┐
               │    Phase 7: Polish    │
               └───────────────────────┘
```

### Parallel Execution Opportunities

Since US2, US3, and US4 target different sections and components, development can proceed concurrently once US1 is complete:
- **Track A**: Create and integrate `app/(workspace)/dashboard/RecruitmentTrendChart.tsx` (US2)
- **Track B**: Update stat cards rendering and gradients in `app/(workspace)/dashboard/page.tsx` (US3)
- **Track C**: Update jobs table row layout, zebra-striping, and department badges in `app/(workspace)/dashboard/page.tsx` (US4)
