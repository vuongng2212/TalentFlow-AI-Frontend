# Feature Specification: High-Fidelity ATS Template Porting

**Feature Branch**: `001-port-html-template`

**Created**: 2026-06-01

**Status**: Draft

**Input**: User description: "Clone template @docs/template/ thành implementation Next.js 16 có cấu trúc chuẩn, ưu tiên port theo component, route và hook thay vì copy HTML nguyên xi; giữ đúng visual language và các interaction chính nhưng tổ chức lại code theo App Router, Server Components mặc định, Client Components ở leaf nodes, strict TypeScript, và Tailwind-based reusable UI; làm incremental, bắt đầu từ launcher và shared UI rồi port từng screen cùng interaction theo thứ tự ưu tiên để kết quả vừa gọn vừa dễ bảo trì."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Product Surface Launcher & Responsive Shared Navigation (Priority: P1)

As a workspace administrator or recruiter, I want a central launcher to easily navigate across the high-fidelity recruiting surfaces and a role-aware sidebar navigation to perform recruiter or admin tasks.

**Why this priority**: It establishes the foundational layout, design tokens, responsive scaffolding, and routing skeleton of the application, serving as the workspace framework before individual screen interactions are ported.

**Independent Test**:
- Open the application and see the Launcher listing all 11 high-fidelity screens.
- Click any screen link, navigate to it, and see a persistent workspace sidebar with brand logo, avatar profile, and role-toggle options.
- Click the role toggles ("Recruiter" or "Admin") in the sidebar and verify that role-restricted sections (such as "User Management" or administrative "Settings") show or hide dynamically.

**Acceptance Scenarios**:

1. **Given** the user is on the Launcher page, **When** they click "Dashboard Home", **Then** the browser navigates to the dashboard view showing the shared navigation sidebar.
2. **Given** the user is viewing the dashboard, **When** they toggle the role to "Recruiter", **Then** the "User Management" option disappears from the sidebar.
3. **Given** the user is viewing the dashboard, **When** they toggle the role to "Admin", **Then** the "User Management" option becomes visible in the sidebar.

---

### User Story 2 - Interactive Candidates Kanban Pipeline & Filter Center (Priority: P2)

As a recruiter, I want to manage candidates through an interactive Kanban board and a search/filter center so that I can quickly track candidates' progress and evaluate their match scores.

**Why this priority**: The candidate pipeline and dossier constitute the high-value core workflow of the Applicant Tracking System (ATS), delivering the primary operational value of the screen templates.

**Independent Test**:
- Open the Candidate page and see a Kanban board with 6 columns representing different pipeline stages.
- Type in the search box or select filter criteria (e.g. status, minimum AI score) and see the candidates list/board dynamically shrink.
- Drag a candidate card from the "Screening" stage to the "Interview" stage and verify that the column applicant count updates instantly.
- Click or double-click a candidate card to open their dossier sheet detailing their AI-generated evaluation.

**Acceptance Scenarios**:

1. **Given** the candidate list is active, **When** the recruiter enters a search term or sets a filter that matches no records, **Then** a friendly "No candidates match your criteria" empty state is displayed.
2. **Given** candidate cards are loaded in the Kanban board, **When** the recruiter drags a card into a different column, **Then** the card's stage badge changes, the column count updates, and the new state is saved in the session.
3. **Given** a recruiter is looking at a candidate card, **When** they select that candidate, **Then** they see a detailed Candidate Dossier with AI screening summaries, a detailed scorecard (using visual progress bars), and a chronological activity timeline.

---

### User Story 3 - Essential Administrative & Authenticated Recruiting Views (Priority: P3)

As an enterprise hiring team member, I want to access standard secure pages like login, signup, billing, workspace settings, job listings, and interview queues to manage our team's recruitment operations.

**Why this priority**: These pages complete the end-to-end recruitment lifecycle and operations, ensuring all secondary workflows and administrative screens from the template are ported with fully operational forms and responsive controls.

**Independent Test**:
- Navigate to the landing page and click the CTA to open the Signup page.
- Fill out the signup form and submit, verifying the interactive validation triggers errors on empty fields or password mismatches.
- View the billing dashboard and see subscription plan details, current seats, and interactive invoice lists.

**Acceptance Scenarios**:

1. **Given** the user is on the Signup page, **When** they submit a password under 8 characters, **Then** a visible error indicator and a message stating "Passwords must be at least 8 characters" is displayed beside the field.
2. **Given** the user is on the Jobs list page, **When** they search or filter jobs by status, **Then** the matching jobs render dynamically while non-matching cards disappear.
3. **Given** the Landing page is loaded, **When** a user clicks an FAQ question header, **Then** the corresponding accordion panel expands smoothly to reveal the answer while other panels toggle closed.

---

### Edge Cases & Error Handling

- **Form Errors**: All user-facing forms (login, signup, workspace settings, candidate invites) validate email structures, field requiredness, and password constraints dynamically upon submission, applying visual red borders and clear helper text without refreshing the page.
- **Empty States**: If a job search, candidate filter, or invoice list returns zero records, a dedicated illustration and description with action triggers (like "Clear filters") replaces the content grid.
- **Role-Restricted Routing**: If a user attempts to deep-link to a page designated for "Admin Only" (such as Admin User Governance) while their role is set to "Recruiter", they should see a friendly "Access Denied / Unauthorized" page rather than broken blank screens.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: **Central Product Launcher**: The application MUST serve a highly-polished launcher page listing all 11+ ported operational views with exact responsive layouts and titles matching the static HTML template designs.
- **FR-002**: **Responsive Role-Aware Workspace Frame**: All inner-app routes MUST share a standard responsive workspace shell consisting of a sidebar navigator, breadcrumbs, top-bar dashboard tools, and user profile badges.
- **FR-003**: **Dynamic Workspace Role Filtering**: Sidebar navigation options and page control widgets MUST filter visibility on-the-fly based on the active role selection ("Recruiter" vs "Admin") stored in the user session.
- **FR-004**: **Interactive Kanban Pipeline board**: The candidates workspace MUST provide a drag-and-drop Kanban board spanning 6 stages (Applied, Screening, Interview, Offer, Hired, Rejected) with real-time column counting and badge-shifting behaviors.
- **FR-005**: **Pipeline and Score Filtering**: The candidate and job directories MUST allow instantaneous client-side text searching and multi-variable filtering (status, stage, and AI-matching score threshold constraints).
- **FR-006**: **Detailed Candidate Dossier**: A dedicated overview panel/dossier MUST present rich candidate profiles featuring structured evaluation charts, AI analysis, skill tags, chronological timelines, and action selectors.
- **FR-007**: **Marketing Landing & FAQ Accordion**: The landing route MUST render the product hero sections, feature grids, pricing tiers, and interactive FAQ panels that toggle open/closed smoothly on user click.
- **FR-008**: **Client-Side Form Validation engine**: All administrative, credentials, and data input fields MUST trigger client-side validators asserting formatting (email format check, 8+ password characters, matched confirmation passwords) prior to mock submissions.

### Non-Functional & Frontend Quality Requirements

- **NFR-001 (Performance)**: Page loading and client-side view switching MUST meet Core Web Vitals targets: Largest Contentful Paint (LCP) under 2.0s, Cumulative Layout Shift (CLS) under 0.05, and Interaction to Next Paint (INP) under 100ms.
- **NFR-002 (Accessibility)**: All UI elements MUST be WCAG 2.1 Level AA compliant, ensuring full screen-reader semantic aria-attributes (e.g. `aria-pressed`, `aria-label`), keyboard focus navigation, and a minimum text-to-background contrast ratio of 4.5:1.
- **NFR-003 (Responsiveness)**: The layout grid and UI components MUST dynamically adapt to all responsive viewport breakpoints: Mobile (< 640px), Tablet (640px - 1024px), and Desktop (> 1024px) without horizontal scrolling or overlapping elements.
- **NFR-004 (Type Safety & Strict Code Quality)**: The entire codebase MUST enforce strict TypeScript standards (no `any` types allowed) and maintain a clean ESLint report with zero structural linting warnings.

### Key Entities & Data Contracts *(include if feature involves data)*

- **WorkspaceRole**:
  - Represents the current user context.
  - States: `Recruiter` | `Admin`.
- **Candidate**:
  - Represents an applicant in the system.
  - Attributes: `id` (string), `name` (string), `title` (string), `avatar` (string), `stage` (string: `applied` | `screening` | `interview` | `offer` | `hired` | `rejected`), `score` (number 0-100), `scoreCategory` (string: `high` | `mid` | `low`), `skills` (array of strings), `appliedDate` (string), `email` (string), `phone` (string), `summary` (string), `timeline` (array of Activity events), `scorecard` (array of evaluation criteria scores).
- **Job**:
  - Represents a job posting in the workspace.
  - Attributes: `id` (string), `title` (string), `department` (string), `location` (string), `type` (string), `status` (string: `open` | `draft` | `closed`), `applicantsCount` (number), `filledPipelines` (number of segments filled out of 5), `createdAt` (string).
- **Invoice**:
  - Represents billing history records.
  - Attributes: `id` (string), `date` (string), `amount` (string), `status` (string: `paid` | `pending`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can transition between any of the 11 ATS workspaces using navigation menus in under 200ms without full-page reloads.
- **SC-002**: Kanban drag-and-drop actions complete within 50ms, showing instant column headcount adjustments and candidate badge updates.
- **SC-003**: 100% of candidate list searches and filter updates apply client-side in real-time (< 100ms) with zero layout flickers.
- **SC-004**: Form validation blocks invalid inputs immediately and displays clear, keyboard-accessible instructions.
- **SC-005**: 100% of code compiling and bundling tests pass with strict TypeScript checks enabled and zero ESLint errors.

## Assumptions

- **Mock Interactive State & API Routes**: Next.js API handler routes will serve mock static database lists. This simulates real network delays and client-server boundaries, while state transitions are stored client-side and/or fetched from these local mock endpoints. No remote database server is required.
- **Styling Architecture**: The visual language is compiled using modern Tailwind CSS v4 custom properties and utility systems matching the styles, shadows, and gradients defined in the source template stylesheets.
- **Shared Context**: The selected workspace role (Admin or Recruiter) is stored globally to coordinate visual layouts across separate routes.
