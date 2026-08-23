# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

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

- [ ] **I. App Router & Server-First**: Is the feature implemented purely within the `app/` router? Are components Server Components by default? Is client-side JS minimized and isolated to `'use client'` leaf components?
- [ ] **II. Strict TypeScript Type Safety**: Are all data interfaces, component props, and API inputs/outputs explicitly and strictly typed? Is the use of `any` avoided completely?
- [ ] **III. Clean Architecture & SOLID**: Is UI isolated from business logic? Are data fetching services, client SDK wrappers, and schemas separated from the presentation components?
- [ ] **IV. Performance-First & Core Web Vitals**: Are assets and routes optimized? Are fonts, images, and links utilizing Next.js native optimized components (`next/image`, `next/font`, `next/link`)? Does it utilize Next.js 16 caching APIs (`refresh`) correctly?
- [ ] **V. Security-First Boundary Validation**: Are secrets strictly server-side? Are Server Actions and routes protected by authentication/authorization checks? Are all client inputs validated using Zod?

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
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
│   └── [route-name]/
│       ├── page.tsx     # Route page (Server Component)
│       └── error.tsx    # Route error boundary
├── components/          # Shared Presentation Components
│   ├── ui/              # Reusable base components (Tailwind 4, design system)
│   └── features/        # Feature-specific composite components
├── services/            # Business & Data Access Logic (fetch, API wrappers)
├── hooks/               # Custom Client Hooks (use client state, UI interactions)
├── types/               # Strict TypeScript definitions & contracts
├── utils/               # Pure utility functions
└── tests/               # Unit, integration, and E2E tests
```

**Structure Decision**: [Document the selected folder layout and files to be touched/created for this feature]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., Client-side state hook] | [complex interactivity required] | [url searchParams not enough] |
