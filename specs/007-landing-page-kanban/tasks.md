# Tasks: Landing Page Kanban Animation

**Input**: Design documents from `/specs/007-landing-page-kanban/`

**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup & Environment

**Purpose**: Project initialization and CSS variables

- [x] T001 Define custom animation variables and keyframes in `@theme` block in `app/globals.css` respecting `prefers-reduced-motion`

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core UI structure updates that block stories

- [x] T002 Identify and isolate the hero, pricing, and FAQ sections in `app/page.tsx` for modification

## Phase 3: User Story 1 - Animated Kanban Mockup (Priority: P1) 🎯 MVP

**Goal**: Show an engaging, animated Kanban board mockup highlighting the core value proposition.

**Independent Test**: Can be tested by visiting the landing page and observing the "Sarah Connor" card moving smoothly from the Screening column to Interview, and finally to Offer, triggering the success overlay.

### Implementation for User Story 1

- [x] T003 [US1] Build the structural layout for the 3 Kanban columns (Screening, Interview, Offer) in `app/page.tsx`
- [x] T004 [US1] Implement the animated "Sarah Connor" card using Tailwind utility classes and scoped custom classes in `app/page.tsx`
- [x] T005 [US1] Implement Success Overlay with backdrop blur and "Offer Sent" text in `app/page.tsx`
- [x] T006 [P] [US1] Adjust animation variables for mobile viewports using media queries in `app/globals.css`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

## Phase 4: User Story 2 - Pricing Section Improvements (Priority: P2)

**Goal**: Clearly show the pricing options with call-to-action buttons aligned for easy comparison.

**Independent Test**: Can be tested by scrolling to the Pricing section and verifying the visual alignment and highlighting of the "Plus" package.

### Implementation for User Story 2

- [x] T007 [P] [US2] Update flexbox classes on Pricing cards in `app/page.tsx` to align CTA buttons to the bottom (`flex flex-col justify-between`)
- [x] T008 [P] [US2] Apply highlight styles (`ring-2 ring-primary` and drop shadow) to the "Plus" package in `app/page.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

## Phase 5: User Story 3 - Interactive FAQ Accordion (Priority: P3)

**Goal**: Provide an intuitive FAQ section that smoothly reveals answers without page reloads.

**Independent Test**: Can be tested by clicking on FAQ items and observing the transition, icon rotation, and color changes.

### Implementation for User Story 3

- [x] T009 [P] [US3] Create or update interactive Client Component `components/ui/accordion.tsx` with `'use client'` directive
- [x] T010 [US3] Implement state management, smooth height transition, and icon rotation (`+` to `x`) in `components/ui/accordion.tsx`
- [x] T011 [US3] Replace existing FAQ static layout with the new accordion component in `app/page.tsx`

**Checkpoint**: At this point, all User Stories should work independently.

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Quality verification, responsiveness checks, and asset/performance tuning

- [x] T012 [P] Validate responsiveness and animation integrity on Mobile, Tablet, and Desktop viewports
- [x] T013 [P] Verify that NO base selectors (`body`, `html`, `.btn`, `.card`) in `app/globals.css` were modified, preserving Workspace styling
- [x] T014 Verify strict TypeScript compilation and fix linting errors (`pnpm lint` + `pnpm build`)
- [x] T015 Run local Lighthouse/Core Web Vitals checks to ensure INP < 200ms and 60fps animations
