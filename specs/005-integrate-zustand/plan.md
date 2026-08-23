# Implementation Plan: Zustand State Integration

**Branch**: `005-integrate-zustand` | **Date**: 2026-06-03 | **Spec**: [specs/005-integrate-zustand/spec.md](specs/005-integrate-zustand/spec.md)

## Summary
Currently, the Next.js frontend application manages sidebar collapse state, application filtering/pagination, and modal open states using page-level or layout-level React state. This creates duplicate render states, state resets on page reloads, and verbose prop-drilling configurations.

This feature introduces **Zustand** to establish a robust global state management architecture. We will implement three core stores:
1. `useUIStore`: Theme and sidebar state persisted to `localStorage`.
2. `useModalStore`: Globally accessible modal open/close states.
3. `useApplicationsStore`: Recruiters' filter selections, view mode settings, page settings, and checklists.

We will resolve hydration mismatch issues by applying persisted preferences (theme, sidebar size) client-side on mount using client wrappers (`WorkspaceShell`) and dynamic CSS hooks.

## Technical Context
- **Language/Version**: Next.js 16.x, React 19.x, TypeScript 5.x
- **Primary Dependencies**: Tailwind CSS 4.x, ESLint 9.x, Zod (validation), `zustand` (state management)
- **Storage**: LocalStorage (persisting theme and sidebar state)
- **Testing**: Playwright (E2E testing)
- **Target Platform**: Vercel / Web Browsers (Chrome, Safari, Firefox, Edge)
- **Project Type**: Next.js App Router Web Application
- **Performance Goals**: Lighthouse Performance >90, LCP < 2.5s, CLS < 0.1, INP < 200ms
- **Constraints**: App Router only, Server Components by default, Strict Type Safety (no `any`), Hydration Mismatch Safety (defer localStorage-backed renders until client mount)

## Constitution Check
*GATE: Passed. Verified post-design.*

- [x] **I. App Router & Server-First**: Is the feature implemented purely within the `app/` router? Are components Server Components by default? Is client-side JS minimized and isolated to `'use client'` leaf components?
- [x] **II. Strict TypeScript Type Safety**: Are all data interfaces, component props, and API inputs/outputs explicitly and strictly typed? Is the use of `any` avoided completely?
- [x] **III. Clean Architecture & SOLID**: Is UI isolated from business logic? Are data fetching services, client SDK wrappers, and schemas separated from the presentation components?
- [x] **IV. Performance-First & Core Web Vitals**: Are assets and routes optimized? Are fonts, images, and links utilizing Next.js native optimized components (`next/image`, `next/font`, `next/link`)? Does it utilize Next.js 16 caching APIs (`refresh`) correctly?
- [x] **V. Security-First Boundary Validation**: Are secrets strictly server-side? Are Server Actions and routes protected by authentication/authorization checks? Are all client inputs validated using Zod?

## Project Structure

### Documentation (this feature)
```text
specs/005-integrate-zustand/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
└── quickstart.md        # Phase 1 output
```

### Source Code Structure
```text
lib/
└── store/
    ├── useUIStore.ts           # UI and Theme store
    ├── useModalStore.ts        # Global modal store
    └── useApplicationsStore.ts  # Application pipeline filters & pagination
components/
└── features/
    └── workspace/
        └── WorkspaceShell.tsx  # Client-side shell wrapper to handle hydration safety
```

**Structure Decision**:
- Zustand stores will reside under `lib/store/` to separate visual state management from core React hooks.
- A new component `components/features/workspace/WorkspaceShell.tsx` will be created to house the client-side state of the workspace layout shell.

## Complexity Tracking

*No Constitution Check violations require tracking. Theme and sidebar state are visual/UX elements suited for client-side state management; components are kept server-first by default.*
