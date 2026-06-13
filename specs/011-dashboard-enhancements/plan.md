# Implementation Plan: Dashboard Layout and Component Enhancements

**Branch**: `feat/new-vers` | **Date**: 2026-06-13 | **Spec**: [specs/011-dashboard-enhancements/spec.md](./spec.md)

**Input**: Feature specification from `specs/011-dashboard-enhancements/spec.md`

## Summary

This feature resolves layout overlapping bugs in the recruitment pipeline breakdown view, implements an interactive SVG recruitment activity trend chart, modernizes the overview stat cards with premium gradient backgrounds, dynamic category icons, and high-visibility typography, and enhances the job performance table with department icons, zebra striping, hover transition highlights, and styled pill badges for application counts.

## Technical Context

**Language/Version**: Next.js 16.x, React 19.x, TypeScript 5.x
**Primary Dependencies**: Tailwind CSS 4.x, ESLint 9.x, Zod (validation)
**Storage**: Server state (caching/revalidation), LocalStorage, or cookies if applicable
**Testing**: Jest + React Testing Library (frontend unit/integration) or Playwright (E2E)
**Target Platform**: Vercel / Web Browsers (Chrome, Safari, Firefox, Edge)
**Project Type**: Next.js App Router Web Application
**Performance Goals**: Lighthouse Performance >90, LCP < 2.5s, CLS < 0.1, INP < 200ms
**Constraints**: App Router only, Server Components by default, Strict Type Safety (no `any`)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. App Router & Server-First**: Is the feature implemented purely within the `app/` router? Yes, under `app/(workspace)/dashboard/page.tsx`. While the file uses `'use client'`, it follows the existing codebase page-fetching architecture.
- [x] **II. Strict TypeScript Type Safety**: Are all data interfaces, component props, and API inputs/outputs explicitly and strictly typed? Yes, using the defined interfaces in `types/index.ts`.
- [x] **III. Clean Architecture & SOLID**: Is UI isolated from business logic? Yes. We isolate rendering elements, and the data fetching logic remains clean.
- [x] **IV. Performance-First & Core Web Vitals**: Are assets and routes optimized? Yes, custom SVG line chart ensures 0 added dependencies, remaining highly performant.
- [x] **V. Security-First Boundary Validation**: Are secrets strictly server-side? Yes. No public exposure of backend secrets.

## Project Structure

### Documentation (this feature)

```text
specs/011-dashboard-enhancements/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code Structure
The project follows Next.js 16 App Router structure:

```text
app/                     # Routing and Layouts
├── layout.tsx           # Global layout & providers
├── page.tsx             # Home route (Server Component)
├── (routes)/            # Domain/Route groups
└── (workspace)/
    └── dashboard/
        ├── page.tsx     # Modified page component
        └── WelcomeHeader.tsx
```

**Structure Decision**:
Modify `app/(workspace)/dashboard/page.tsx` with all design enhancements (gradient stat cards, custom inline SVG icons, custom responsive SVG line/area chart, flex layout pipeline breakdown, and styled job performance table).

## Complexity Tracking

*No constitution check violations require justification.*
