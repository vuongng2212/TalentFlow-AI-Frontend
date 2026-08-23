# Implementation Plan: Enterprise Color System Refactor

**Branch**: `feat/new-vers` | **Date**: 2026-06-04 | **Spec**: [specs/010-enterprise-color-system/spec.md](specs/010-enterprise-color-system/spec.md)

**Input**: Feature specification from `/specs/010-enterprise-color-system/spec.md`

## Summary

This refactor replaces the creative/consumer purple visual branding of TalentFlow with a professional B2B Enterprise style using Indigo and Teal. All primary action colors are migrated from purple (`#7C3AED`) to indigo (`#4F46E5`), AI indicators are mapped to dedicated teal accent styles (`#0D9488` / `#CCFBF1`), glows/shadows are cleaned up or neutralized, and global readability is enhanced via `line-height` typography changes in `app/globals.css`.

## Technical Context

**Language/Version**: Next.js 16.x, React 19.x, TypeScript 5.x
**Primary Dependencies**: Tailwind CSS 4.x, ESLint 9.x
**Storage**: Server state (caching/revalidation)
**Testing**: Manual visual audit & layout inspection
**Target Platform**: Vercel / Web Browsers
**Project Type**: Next.js App Router Web Application
**Performance Goals**: CLS < 0.1, Lighthouse Performance >90
**Constraints**: App Router only, Server Components, CSS architecture constraints in `globals.css`

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
specs/010-enterprise-color-system/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── contracts/
    └── ui-styling.md    # UI integration contract
```

### Source Code Structure
Only one CSS file is modified:
- `app/globals.css`: Contains CSS variables and base utility classes.

**Structure Decision**:
Modify `app/globals.css` to update:
1. Primary brand variables (`--primary`, `--primary-hover`, `--primary-soft`, `--primary-glow`).
2. Add new AI accent variables (`--ai-accent`, `--ai-accent-soft`).
3. Define new teal-based shadow glows and clean up neutral `.mockup` shadow styles.
4. Modify `body` to use `line-height: 1.6`.

## Complexity Tracking

No violations found or tracked.
