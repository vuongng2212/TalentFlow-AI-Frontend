# Implementation Plan: Improve UX Density and Realism

**Branch**: `002-improve-ux-density` | **Date**: 2026-06-01 | **Spec**: [spec.md](specs/002-improve-ux-density/spec.md)

**Input**: Feature specification from `/specs/002-improve-ux-density/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command.

## Summary

This feature aims to refine the TalentFlow frontend to feel less like a prototype and more like a high-density, enterprise-grade ATS. This includes clear navigation contexts, synchronized real data (removing hardcoded placeholders), high-density scannable list views, advanced filter chips, bulk actions, and standardized application states.

## Technical Context

**Language/Version**: Next.js 16.x, React 19.x, TypeScript 5.x
**Primary Dependencies**: Tailwind CSS 4.x, ESLint 9.x, Zod (validation)
**Storage**: URL Search Params (for filter state), Server state (caching/revalidation)
**Testing**: Jest + React Testing Library (frontend unit/integration) or Playwright (E2E)
**Target Platform**: Vercel / Web Browsers (Chrome, Safari, Firefox, Edge)
**Project Type**: Next.js App Router Web Application
**Performance Goals**: Lighthouse Performance >90, LCP < 2.5s, CLS < 0.1, INP < 200ms
**Constraints**: App Router only, Server Components by default, Strict Type Safety (no `any`)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. App Router & Server-First**: Is the feature implemented purely within the `app/` router? Are components Server Components by default? Is client-side JS minimized and isolated to `'use client'` leaf components?
- [x] **II. Strict TypeScript Type Safety**: Are all data interfaces, component props, and API inputs/outputs explicitly and strictly typed? Is the use of `any` avoided completely?
- [x] **III. Clean Architecture & SOLID**: Is UI isolated from business logic? Are data fetching services, client SDK wrappers, and schemas separated from the presentation components?
- [x] **IV. Performance-First & Core Web Vitals**: Are assets and routes optimized? Are fonts, images, and links utilizing Next.js native optimized components (`next/image`, `next/font`, `next/link`)? Does it utilize Next.js 16 caching APIs (`refresh`) correctly?
- [x] **V. Security-First Boundary Validation**: Are secrets strictly server-side? Are Server Actions and routes protected by authentication/authorization checks? Are all client inputs validated using Zod?

## Project Structure

### Documentation (this feature)

```text
specs/002-improve-ux-density/
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
├── (workspace)/         # Workspace route group
│   ├── layout.tsx       # Main layout (sidebar, header context)
│   ├── dashboard/       # Dashboard page
│   ├── candidates/      # Candidates lists
│   └── jobs/            # Jobs list
├── components/          # Shared Presentation Components
│   ├── ui/              # Add EmptyState, LoadingSkeleton, FilterChips
│   └── features/        # Feature-specific composite components
```

**Structure Decision**:
- Refactor `app/(workspace)/layout.tsx` to handle `RoleContext` display clearly.
- Update `app/(workspace)/dashboard/page.tsx`, `app/(workspace)/candidates/page.tsx`, etc. to use synchronized data from `services/mockData.ts`.
- Create `components/ui/LoadingSkeleton.tsx`, `components/ui/EmptyState.tsx`, `components/ui/FilterChips.tsx`.
- Update list views (Jobs, Candidates) to utilize compact Tailwind utility classes.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |