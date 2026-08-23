# Implementation Plan: Landing Page Kanban Animation

**Branch**: `feat/new-vers` | **Date**: 2026-06-03 | **Spec**: [specs/007-landing-page-kanban/spec.md](specs/007-landing-page-kanban/spec.md)

**Input**: Feature specification from `/specs/007-landing-page-kanban/spec.md`

## Summary

Improve the UI/UX of the Landing Page by adding an animated Kanban board mockup that demonstrates the product's core value proposition, refining the Pricing section for better alignment and highlighting, and upgrading the FAQ section to be an interactive accordion. All styling must be strictly isolated to the Landing Page to preserve the core Workspace UI.

## Technical Context

**Language/Version**: Next.js 16.x, React 19.x, TypeScript 5.x
**Primary Dependencies**: Tailwind CSS 4.x, ESLint 9.x, Zod (validation)
**Storage**: None required for this UI feature
**Testing**: Playwright (E2E) or manual visual regression testing
**Target Platform**: Vercel / Web Browsers (Chrome, Safari, Firefox, Edge)
**Project Type**: Next.js App Router Web Application
**Performance Goals**: Lighthouse Performance >90, LCP < 2.5s, CLS < 0.1, INP < 200ms
**Constraints**: App Router only, Server Components by default, Strict Type Safety (no `any`), CSS strictly scoped to Landing Page

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. App Router & Server-First**: Is the feature implemented purely within the `app/` router? Are components Server Components by default? Is client-side JS minimized and isolated to `'use client'` leaf components? (FAQ Accordion will be a 'use client' leaf component).
- [x] **II. Strict TypeScript Type Safety**: Are all data interfaces, component props, and API inputs/outputs explicitly and strictly typed? Is the use of `any` avoided completely?
- [x] **III. Clean Architecture & SOLID**: Is UI isolated from business logic? Are data fetching services, client SDK wrappers, and schemas separated from the presentation components?
- [x] **IV. Performance-First & Core Web Vitals**: Are assets and routes optimized? Are fonts, images, and links utilizing Next.js native optimized components (`next/image`, `next/font`, `next/link`)? Does it utilize Next.js 16 caching APIs (`refresh`) correctly?
- [x] **V. Security-First Boundary Validation**: Are secrets strictly server-side? Are Server Actions and routes protected by authentication/authorization checks? Are all client inputs validated using Zod?

## Project Structure

### Documentation (this feature)

```text
specs/007-landing-page-kanban/
├── plan.md              # This file
├── research.md          # Technical decisions and research
├── data-model.md        # Data entities (none for this UI-only feature)
├── quickstart.md        # Feature quickstart
└── tasks.md             # Execution steps
```

### Source Code Structure

The project follows Next.js 16 App Router structure. Changes will be focused on the landing page and isolated styling.

```text
app/
├── page.tsx                     # Landing page Server Component (modified)
├── globals.css                  # Global styles (add @theme animations and scoped classes here)
components/
└── ui/
    └── accordion.tsx            # FAQ interactive component (will be updated/created as 'use client')
```

**Structure Decision**: 
- Modify `app/page.tsx` to include the new Kanban layout structure, Pricing layout structure, and FAQ section.
- `components/ui/accordion.tsx` might already exist or needs to be updated to be a Client Component using `'use client'` for interactivity.
- Custom animations (Kanban movement) will be defined using Tailwind v4 `@theme` block in `app/globals.css` to allow hardware acceleration (`transform`) and will respect `prefers-reduced-motion`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Client-side state hook | Required for FAQ Accordion open/close state | CSS-only `:target` or `details/summary` limits smooth animation transitions |
