# Implementation Plan: B2B SaaS Landing Page Refactor

**Branch**: `feat/new-vers` | **Date**: 2026-06-03 | **Spec**: [specs/009-landing-page-refactor/spec.md](specs/009-landing-page-refactor/spec.md)

**Input**: Feature specification from `/specs/009-landing-page-refactor/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command.

## Summary

Refactor the monolithic landing page (`app/page.tsx`) into isolated, modular React components. The page is broken down into 13 high-converting B2B SaaS sections. Each section will reside as a single-responsibility file in `components/landing/` and is composed dynamically in `app/page.tsx`. This preserves complete visual fidelity (retaining variables from `app/globals.css`, grid alignments, and the custom 12-second Kanban moving card animation with the offer success overlay) while ensuring the main `/dashboard` workspaces run with zero regressions.

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

- [x] **I. App Router & Server-First**: Is the feature implemented purely within the `app/` router? Are components Server Components by default? Is client-side JS minimized and isolated to `'use client'` leaf components?
- [x] **II. Strict TypeScript Type Safety**: Are all data interfaces, component props, and API inputs/outputs explicitly and strictly typed? Is the use of `any` avoided completely?
- [x] **III. Clean Architecture & SOLID**: Is UI isolated from business logic? Are data fetching services, client SDK wrappers, and schemas separated from the presentation components?
- [x] **IV. Performance-First & Core Web Vitals**: Are assets and routes optimized? Are fonts, images, and links utilizing Next.js native optimized components (`next/image`, `next/font`, `next/link`)? Does it utilize Next.js 16 caching APIs (`refresh`) correctly?
- [x] **V. Security-First Boundary Validation**: Are secrets strictly server-side? Are Server Actions and routes protected by authentication/authorization checks? Are all client inputs validated using Zod?

## Project Structure

### Documentation (this feature)

```text
specs/009-landing-page-refactor/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
└── checklists/
    └── requirements.md  # Specification checklist
```

### Source Code Structure
The project follows Next.js 16 App Router structure:

```text
app/                     # Routing and Layouts
├── layout.tsx           # Global layout & providers
├── page.tsx             # Home route (Server Component) - Composes components/landing/*
components/              # Shared Presentation Components
├── landing/             # Isolated components for B2B SaaS landing page
│   ├── Header.tsx       # Landing navigation bar
│   ├── HeroSection.tsx  # Hero section with interactive Kanban mockup animation
│   ├── TrustedLogos.tsx # Infinite scrolling logo carousel
│   ├── ChallengesSection.tsx # B2B recruitment challenges section
│   ├── SolutionsSection.tsx  # Matching solution value props
│   ├── FeaturesSection.tsx   # 6-key feature grid
│   ├── WorkflowSection.tsx   # Step-by-step recruitment process layout
│   ├── IntegrationsSection.tsx # Integrations display (calendars, API, Slack, etc.)
│   ├── SecuritySection.tsx   # Enterprise security & compliance details (SOC2, GDPR)
│   ├── TestimonialsSection.tsx # Quotes and social proof cards
│   ├── ImpactMetrics.tsx     # Metrics/stat cards
│   ├── PricingSection.tsx    # Three distinct tiered packages (Personal, Plus, Business)
│   ├── FaqSection.tsx        # Collapsible FAQ accordion items
│   ├── FinalCta.tsx          # Full-width bottom call-to-action band
│   └── Footer.tsx            # Footer navigation and copyright details
└── ui/
    └── accordion.tsx    # Reused client-side accordion component
```

**Structure Decision**:
- Retain `app/page.tsx` as the main route entrypoint, but clean up its body to only import and compose the modular components from `components/landing/`.
- Save all landing-page-specific components under `components/landing/`.
- Ensure no files outside of `app/page.tsx`, `components/landing/*` and specification directories are modified, preserving `/dashboard` workspace routes.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
