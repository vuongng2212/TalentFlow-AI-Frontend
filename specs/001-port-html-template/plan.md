# Implementation Plan: High-Fidelity ATS Template Porting

**Branch**: `001-port-html-template` | **Date**: 2026-06-01 | **Spec**: [/specs/001-port-html-template/spec.md](specs/001-port-html-template/spec.md)

**Input**: Feature specification from `/specs/001-port-html-template/spec.md`

## Summary

The goal of this feature is to port a static high-fidelity recruiting workspace HTML template to a clean, componentized Next.js 16 (App Router) application. We will restructure the code into modular Server and Client Components, enforce strict TypeScript type safety, adopt Tailwind CSS 4 for styling, and implement core interactivity (Kanban drag-and-drop, role-aware navigation sidebar, client-side search/filters, auth form validations, and accordion menus).

## Technical Context

**Language/Version**: Next.js 16.2.6, React 19.2.4, TypeScript 5.x
**Primary Dependencies**: Tailwind CSS 4.x, ESLint 9.x, Zod (validation), Lucide React (optional, for clean vector icons matching visual cues)
**Storage**: Client-side state (React Context), sync to LocalStorage (`tf-role`)
**Testing**: Vitest / React Testing Library (if requested; not explicitly mandated to write failing tests unless specified)
**Target Platform**: Vercel / Web Browsers (Chrome, Safari, Firefox, Edge)
**Project Type**: Next.js App Router Web Application
**Performance Goals**: Lighthouse Performance >90, LCP < 2.0s, CLS < 0.05, INP < 100ms
**Constraints**: App Router only, Server Components by default, Strict Type Safety (no `any`), Tailwind CSS 4.x style usage.

## Constitution Check

*GATE: Passed. Ready for Phase 0 research.*

- [x] **I. App Router & Server-First**: All views will be implemented under the `app/` directory. Interactivity (Kanban board drag-and-drop, role toggling, FAQ toggling, form validations) is isolated to leaf-level Client Components, while main layout structure and non-interactive content are rendered as Server Components.
- [x] **II. Strict TypeScript Type Safety**: Standard interfaces (`WorkspaceRole`, `Candidate`, `Job`, `Invoice`, etc.) are declared in `types/index.ts` with no `any` types.
- [x] **III. Clean Architecture & SOLID**: Layout structure is separate from route-specific views. Mock data and schema validation logic are abstracted into services (`services/mockData.ts` and validations).
- [x] **IV. Performance-First & Core Web Vitals**: Utilizing Next.js native fonts (Geist/Geist Mono), `next/link` for instant client-side routing, and avoiding heavy dynamic JS execution.
- [x] **V. Security-First Boundary Validation**: Mock database services simulate server-side data fetching. Client-side input forms are validated with robust validation logic prior to mock submission actions.

## Project Structure

### Documentation (this feature)

```text
specs/001-port-html-template/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (created by /speckit-tasks)
```

### Source Code Structure

We will create and update the following file structure for the porting task:

```text
app/
├── layout.tsx                                 # Global HTML shell & root fonts
├── page.tsx                                   # Central Product Launcher (talentflow-ai-launcher.html)
├── globals.css                                # Tailwind 4 imports & custom design tokens
├── (auth)/                                    # Auth route group
│   ├── login/page.tsx                         # Login screen (login.html)
│   └── signup/page.tsx                        # Signup screen (signup.html)
├── (marketing)/                               # Marketing route group
│   └── landing/page.tsx                       # Public landing page (landing.html)
└── (workspace)/                               # Main recruiter/admin application
    ├── layout.tsx                             # Shared Workspace Sidebar shell + Role Context Provider
    ├── dashboard/page.tsx                     # Dashboard Home (dashboard.html)
    ├── jobs/
    │   ├── page.tsx                           # Jobs list (jobs.html)
    │   └── [id]/page.tsx                      # Job details (job-detail.html)
    ├── candidates/
    │   ├── page.tsx                           # Candidates Kanban & list view (candidates.html)
    │   └── [id]/page.tsx                      # Candidate dossier detail view (candidate-detail.html)
    ├── interviews/page.tsx                    # Interview queues (interviews.html)
    ├── billing/page.tsx                       # Billing and invoices (billing.html)
    ├── admin/
    │   └── users/page.tsx                     # User governance (admin-users.html, Admin-only)
    └── settings/page.tsx                      # Workspace settings (settings.html)
components/
├── ui/                                        # Shared primitive controls (badge, dialog, buttons)
│   ├── accordion.tsx                          # FAQ accordion
│   └── tabs.tsx                               # Reusable tab buttons & panels
└── features/                                  # Componentized segments of ported screens
    ├── launcher/                              # Launcher grid cards
    ├── workspace/                             # Sidebar navigator, user info header
    ├── candidates/                            # Kanban board, kanban card, dossier view
    └── jobs/                                  # Job cards, search controls
services/
└── mockData.ts                                # In-memory database & fetch actions
types/
└── index.ts                                   # Unified TypeScript definitions
```

**Structure Decision**:
- Organize interactive features (Kanban, FAQ, Tabs) into custom components in `components/features/` or `components/ui/`.
- Decouple the role configuration from the core components using a global `RoleContext` wrapping the `(workspace)` layout.
- Separate styling variables to `@theme` blocks inside `app/globals.css`.

## Complexity Tracking

*No violations of the Constitution identified.*
