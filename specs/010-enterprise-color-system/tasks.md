---

description: "Task list for Enterprise Color System Refactor"

---

# Tasks: Enterprise Color System Refactor

**Input**: Design documents from `/specs/010-enterprise-color-system/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL. Since no automated testing is requested in the feature specification, no automated test tasks are generated. Visual/manual validation steps are included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup & Environment

**Purpose**: Review and setup variables in local CSS stylesheets

- [X] T001 Review existing CSS variable usage, Tailwind @theme mappings, and utility classes in app/globals.css

---

## Phase 2: Foundational (Data Contracts & Core Services)

**Purpose**: Initialize primary brand variables and Tailwind configuration theme mapping

**⚠️ CRITICAL**: No UI/User Story work should begin until these blockings are complete

- [X] T002 Update brand primary variables (`--primary`, `--primary-hover`, `--primary-soft`, `--primary-glow`) for both `:root` and `.dark` selectors in app/globals.css
- [X] T003 Create AI-specific accent variables (`--ai-accent`, `--ai-accent-soft`) for both `:root` and `.dark` (as `--ai-accent-soft` override) in app/globals.css
- [X] T004 Map the new variables (`--color-primary`, `--color-primary-hover`, `--color-primary-soft`, `--color-ai-accent`, `--color-ai-accent-soft`) inside the Tailwind `@theme` configuration in app/globals.css

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Enterprise Visual Style (Priority: P1) 🎯 MVP

**Goal**: Deliver a professional, trustworthy visual interface designed with corporate colors (indigo) and clean typography, neutralizing purple glows.

**Independent Test**: Run the development server and visually inspect the landing page and dashboard components (buttons, links, active navigation, input focus states) to confirm they use the new Indigo scheme, and mockup cards use the neutral shadow.

### Implementation for User Story 1

- [X] T005 [US1] Remove purple glow shadow (`--shadow-ai`) from generic non-AI components (such as button hovers and badge highlights) in app/globals.css
- [X] T006 [US1] Update state color classes (like `.screening` background and text colors) to use the new `--primary-soft` and `--primary` variables in app/globals.css
- [X] T007 [US1] Modify the `.mockup` class `box-shadow` styling to a subtle, neutral shadow profile: `0 4px 24px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)` in app/globals.css
- [X] T008 [US1] Adjust global `body` line-height to `1.6` under the `body` selector to increase readability in app/globals.css
- [X] T009 [US1] Verify that all primary buttons, active navigation links, active tabs, and focus outlines display with the new indigo palette on the UI in app/globals.css

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Distinct AI Highlight Visuals (Priority: P2)

**Goal**: Make AI-powered features visually distinct from normal branding components by using a dedicated teal color and gradient.

**Independent Test**: Navigate to candidate detail pages or dashboard features containing AI recommendations/chips, and verify they render using teal colors/gradients and a teal shadow glow.

### Implementation for User Story 2

- [X] T010 [US2] Update `--shadow-ai` in `:root` to a teal glow (`0 0 16px rgba(13, 148, 136, 0.15)`) and update dark mode overrides (`--ai-glow` or `--shadow-ai` in `.dark`) in app/globals.css
- [X] T011 [US2] Update `.ai-chip` class background to a linear gradient from `--ai-accent` to `#0F766E` (Teal 600 to Teal 700) instead of purple-brand gradient in app/globals.css
- [X] T012 [US2] Update `.score::after` (AI badge above score circles) background to use the new teal gradient (`linear-gradient(135deg, var(--ai-accent), #0F766E)`) and its `box-shadow` to `var(--shadow-ai)` in app/globals.css
- [X] T013 [US2] Verify that AI recommendations, badges, and chips display with the correct teal gradients and shadow glows on the UI in app/globals.css

**Checkpoint**: At this point, User Stories 1 and 2 should both work independently and look consistent.

---

## Phase 5: Polish & Core Web Vitals Optimization

**Purpose**: Quality verification, responsiveness checks, and asset/performance tuning

- [X] T014 Verify contrast ratios of indigo (`#4F46E5` / `#4338CA`) and teal (`#0D9488`) components against light and dark backgrounds to meet WCAG 2.1 Level AA requirements in app/globals.css
- [X] T015 Validate layout responsiveness of typography line height and elements on Mobile, Tablet, and Desktop viewports in app/globals.css
- [X] T016 Verify strict TypeScript compilation and fix linting errors by running build and lint scripts in app/globals.css

---

## Dependencies & Completion Order

```text
Phase 1: Setup (T001)
  └── Phase 2: Foundational (T002 - T004)
        └── Phase 3: User Story 1 (T005 - T009) [P1: MVP]
              └── Phase 4: User Story 2 (T010 - T013) [P2]
                    └── Phase 5: Polish & Core Web Vitals (T014 - T016)
```

## Parallel Execution Examples

All implementation tasks modify a single file: `app/globals.css`. Therefore, direct parallel modification of the file is not possible due to potential Git conflicts. However, validation and analysis tasks can run in parallel:
- T014 (Accessibility/Contrast verification) and T015 (Responsiveness validation) can be performed concurrently on the UI once styling changes are loaded.

## Implementation Strategy

1. **MVP First**: Establish core brand variables, Tailwind theme mapping, and line-height updates. Neutralize purple glows on non-AI elements. Validate that the UI displays in Indigo properly.
2. **Incremental Polish**: Once the base brand transition is verified, implement the dedicated Teal accent variables and update AI-centric badges/chips.
3. **Quality Check**: Verify accessibility, contrast ratios, responsiveness, and run build validation.
