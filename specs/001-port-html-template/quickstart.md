# Developer Quickstart Guide: High-Fidelity ATS Template Porting

This guide provides steps for running and testing the ported Next.js application workspace.

## 1. Setup & Installation

Ensure dependencies are installed using `pnpm` inside the frontend root directory:

```bash
pnpm install
```

---

## 2. Dev Server Launch

Start the Next.js development server:

```bash
pnpm dev
```
The application will launch on [http://localhost:3000](http://localhost:3000).

---

## 3. High-Fidelity Navigation & Layouts

- **Launcher Page**: Accessible at `/` representing the central launcher listing all ported screen templates.
- **Mock Authenticated Flow**:
  - Visit `/login` or `/signup` to view interactive credentials forms and validations.
  - Submitting redirects to the workspace dashboard.
- **Workspace Navigation Sidebar**:
  - Persistent layout across all routes under the `(workspace)` group directory (e.g. `/dashboard`, `/candidates`, `/jobs`, etc.).
  - Toggle options at the bottom of the sidebar will instantly shift active role configurations between `Recruiter` and `Admin`.
- **Kanban Pipeline Board**:
  - Navigate to `/candidates`.
  - Drag candidate cards from columns to trigger state transitions and watch headcount adjustments update instantly on the fly.
  - Hover or click the card to access dossier reviews.
- **Admin Governance Boundary**:
  - Access `/admin/users` to verify user seat structures.
  - Shifting active roles to `Recruiter` in the sidebar toggles visual access to this admin boundary instantly.

---

## 4. Code Quality & Standards

Run ESLint formatting and syntax checks before committing modifications:

```bash
pnpm lint
```

Ensure no `any` statements or loose declarations are committed, matching **Constitution II** criteria.
