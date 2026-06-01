---

description: "Task list template for Next.js 16 feature implementation"
---

# Tasks: UI/UX Improvements for Landing Page

**Input**: Design documents from `/specs/004-ui-ux-improvements/`

**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions (Next.js 16 App Router)

- **Routes & Pages**: `app/page.tsx` (Server Components)
- **Global Styles**: `app/globals.css`

---

## Phase 1: Setup & Environment

**Purpose**: Route structure initialization and shared configurations

- [x] T001 Setup color variables or general configuration if needed for the UI updates in `app/globals.css`

---

## Phase 2: Foundational (Data Contracts & Core Services)

**Purpose**: Core logic and shared styling additions

- [x] T002 Add `@keyframes` for `infinite-scroll` and `fade-in-up` (or similar smooth entrance) animations in `app/globals.css`

---

## Phase 3: User Story 1 - Understand Value Proposition via Mockup (Priority: P1) 🎯 MVP

**Goal**: Implement a clear, visually appealing kanban mockup with unified AI badges and distinct columns

**Independent Test**: Can be fully tested by loading the landing page and visually inspecting the kanban board mockup for consistent AI badge sizes and emphasized column styles (borders/backgrounds).

### Implementation for User Story 1

- [x] T003 [P] [US1] Update kanban AI badges in `app/page.tsx` to share identical dimensions, padding, and font sizing
- [x] T004 [P] [US1] Add borders or distinct background colors to the kanban columns in `app/page.tsx` or `app/globals.css` to improve visual hierarchy

---

## Phase 4: User Story 2 - Smooth and Engaging Discovery (Priority: P2)

**Goal**: Apply smooth motion animations and infinite logo scroll

**Independent Test**: Can be fully tested by scrolling down the landing page and observing the infinite loop logo section and general smooth entrance animations for page elements.

### Implementation for User Story 2

- [x] T005 [P] [US2] Apply infinite loop scrolling animation classes to the logo section in `app/page.tsx`
- [x] T006 [US2] Apply smooth entrance animation classes (`fade-in-up` or similar) to main page sections in `app/page.tsx`

---

## Phase 5: User Story 3 - Comprehend Pricing Options (Priority: P2)

**Goal**: Clearly display 3 distinct pricing plans with their specific target audiences and features

**Independent Test**: Can be fully tested by navigating to the pricing section and verifying the presence of 3 distinct cards (Free, Plus, Business) with the correct descriptions.

### Implementation for User Story 3

- [x] T007 [P] [US3] Update pricing layout in `app/page.tsx` to exactly three tier cards (Free, Plus, Business)
- [x] T008 [US3] Update the 'Plus' tier descriptions in `app/page.tsx` to mention expanded CV parsing limits and candidate synthesis for individual/freelancers
- [x] T009 [US3] Update the 'Business' tier descriptions in `app/page.tsx` to mention enterprise features like ADMIN workspace creation and inviting recruiters/interviewers

---

## Phase 6: User Story 4 - Emphasized System Metrics (Priority: P3)

**Goal**: Visually highlight the key system metrics numbers

**Independent Test**: Can be fully tested by viewing the metrics card section and ensuring they stand out visually (e.g., via highlights, typography, or styling).

### Implementation for User Story 4

- [x] T010 [P] [US4] Add highlight styling (gradients, larger sizes, specific accent colors) to the system metrics numbers in `app/page.tsx`

---

## Phase 7: Polish & Core Web Vitals Optimization

**Purpose**: Quality verification, responsiveness checks, and asset/performance tuning

- [x] T011 [P] Implement `prefers-reduced-motion` media queries in `app/globals.css` to gracefully fallback or disable animations for accessibility
- [x] T012 Validate responsive stacking and layouts for the pricing cards (vertical stack on mobile) and infinite logo carousel on mobile/tablet viewports
- [x] T013 Verify strict TypeScript compilation and fix any potential linting errors by running `pnpm lint` and `pnpm build`
