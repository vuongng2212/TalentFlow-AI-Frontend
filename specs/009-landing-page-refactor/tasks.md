---
description: "Task list for B2B SaaS Landing Page Refactor"
---

# Tasks: B2B SaaS Landing Page Refactor

**Input**: Design documents from `/specs/009-landing-page-refactor/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Tests are OPTIONAL. In this presentation-layer refactoring, automated tests are not requested, so verification is conducted via manual/browser tests and build scripts as outlined in quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions (Next.js 16 App Router)

- **Routes & Pages**: `app/page.tsx` (Server Components)
- **Shared UI Components**: `components/ui/[component].tsx`
- **Landing Components**: `components/landing/[component].tsx`
- **Landing Types**: `components/landing/types.ts`
- **Landing Static Data**: `components/landing/data.ts`

---

## Phase 1: Setup & Environment

**Purpose**: Folder structure initialization and shared static types/data configurations.

- [X] T001 Create directory structure under `components/landing/`
- [X] T002 Define TypeScript data models and interfaces in `components/landing/types.ts`
- [X] T003 Extract and structure all static landing text content (challenges, features, integrations, plans, FAQ) in `components/landing/data.ts`

---

## Phase 2: Foundational (Data Contracts & Core Services)

**Purpose**: Core presentation utility components and layout skeleton.

**⚠️ CRITICAL**: No UI/User Story work should begin until these blockings are complete.

- [X] T004 Build reusable `components/landing/SectionHeader.tsx` presentation component per specifications
- [X] T005 [P] Create blank placeholder components for each of the 13 sections in `components/landing/` to allow compilation

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Structured B2B SaaS Landing Page (Priority: P1) 🎯 MVP

**Goal**: Implement the structured information flow of 13 targeted sections in the specified order on `/`.

**Independent Test**: Navigate `/` on desktop/mobile and verify all 13 targeted sections render in sequence, loading default data from `components/landing/data.ts`.

### Implementation for User Story 1

- [X] T006 [P] [US1] Implement Header navigation bar in `components/landing/Header.tsx`
- [X] T007 [P] [US1] Implement TrustedLogos infinite scrolling slider in `components/landing/TrustedLogos.tsx`
- [X] T008 [P] [US1] Implement Recruitment Challenges problem section in `components/landing/ChallengesSection.tsx`
- [X] T009 [P] [US1] Implement Smart ATS Solutions mapping section in `components/landing/SolutionsSection.tsx`
- [X] T010 [P] [US1] Implement Key Features & Benefits grid in `components/landing/FeaturesSection.tsx`
- [X] T011 [P] [US1] Implement Recruitment Workflow step-by-step display in `components/landing/WorkflowSection.tsx`
- [X] T012 [P] [US1] Implement Integrations display grid in `components/landing/IntegrationsSection.tsx`
- [X] T013 [P] [US1] Implement Security & Compliance trust signals in `components/landing/SecuritySection.tsx`
- [X] T014 [P] [US1] Implement Customer Testimonials quote cards in `components/landing/TestimonialsSection.tsx`
- [X] T015 [P] [US1] Implement Business Impact metric cards in `components/landing/ImpactMetrics.tsx`
- [X] T016 [P] [US1] Implement Pricing tiered package grid in `components/landing/PricingSection.tsx`
- [x] T017 [P] [US1] Implement FAQ accordion wrapper in `components/landing/FaqSection.tsx` using existing `components/ui/accordion.tsx`
- [X] T018 [P] [US1] Implement Final CTA conversion band in `components/landing/FinalCta.tsx`
- [X] T019 [P] [US1] Implement Footer navigation links and copyright in `components/landing/Footer.tsx`
- [X] T020 [US1] Clean up and compose all sections in sequence in `app/page.tsx` utilizing static placeholders for HeroSection

**Checkpoint**: At this point, the entire page structure and 13 sections are rendering and testable.

---

## Phase 4: User Story 2 - Modular Component Architecture (Priority: P2)

**Goal**: Ensure all landing page sections are isolated into dedicated component files and `app/page.tsx` is kept clean.

**Independent Test**: Inspect `app/page.tsx` and confirm it only imports and renders the landing sections from `components/landing/`.

### Implementation for User Story 2

- [X] T021 [US2] Refactor `app/page.tsx` to remove any remaining legacy inline markups
- [X] T022 [US2] Review and refactor class names inside all files under `components/landing/` to ensure uniform button, chip, and card styles

**Checkpoint**: Monolith page is fully decomposed with zero style pollution to `/dashboard`.

---

## Phase 5: User Story 3 - Preserving Visual Identity and Interactive Mockups (Priority: P3)

**Goal**: Preserving visual branding, Kanban mockup animation, and success overlay timing in the Hero section.

**Independent Test**: Load `/` and verify the Kanban mockup runs the 12-second sliding card animation and success overlay cleanly.

### Implementation for User Story 3

- [X] T023 [US3] Build the base HeroSection layout in `components/landing/HeroSection.tsx`
- [X] T024 [US3] Integrate the 12-second Kanban loop animation with Sarah Connor card inside `components/landing/HeroSection.tsx`
- [X] T025 [US3] Implement the "Offer Sent" success overlay and timing within `components/landing/HeroSection.tsx`
- [X] T026 [US3] Update Header navigation and Footer smooth scroll to anchors in `components/landing/Header.tsx` and `components/landing/Footer.tsx`

**Checkpoint**: Visual design and core interactive animations are fully restored and functioning.

---

## Phase 6: Polish & Core Web Vitals Optimization

**Purpose**: Quality verification, responsiveness checks, accessibility audits, and build validation.

- [X] T027 Validate mobile-responsive grid stacking (width < 820px) for all components in `components/landing/`
- [X] T028 Verify keyboard navigation focus states and ARIA labeling for components in `components/landing/` and `app/page.tsx`
- [X] T029 Execute static code analysis and ESLint checks via `pnpm lint` in `package.json`
- [X] T030 Perform production bundle compilation via `pnpm build` in `package.json`

---

## Dependencies & Execution Strategy

### Dependency Graph

```text
Phase 1 (Setup) ──> Phase 2 (Foundational) ──> Phase 3 (US1: Page Structure & Sections)
                                                    │
                                                    ▼
                                               Phase 4 (US2: Clean Architecture)
                                                    │
                                                    ▼
                                               Phase 5 (US3: Kanban Interactive Hero)
                                                    │
                                                    ▼
                                               Phase 6 (Polish & Web Vitals)
```

### Parallel Execution Strategy

The modular nature of the sections allows multiple developers to work concurrently:
- **Stream A**: UI Section Layouts (T006 - T019) can be built in parallel.
- **Stream B**: Interactive Hero and Kanban Animation (T023 - T025) can be developed in parallel with Stream A.

### MVP Scope
The MVP scope consists of Phase 1, Phase 2, and Phase 3 (User Story 1), resulting in a functional, responsive static layout containing all 13 sections.
