# Feature Specification: Zustand State Integration

**Feature Branch**: `005-integrate-zustand`

**Created**: 2026-06-03

**Status**: Draft

**Input**: User description: "Hãy cài đặt và tích hợp Zustand vào dự án Next.js (App Router) này bằng cách thực hiện các bước sau: Cài đặt thư viện zustand. Tạo thư mục store/ (hoặc lib/store/) và định nghĩa các store: useUIStore, useModalStore, useApplicationsStore. Tiến hành refactor các file component liên quan."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Sidebar Toggle & Theme State Persistence (Priority: P1)

As a workspace user, I want the sidebar collapse state and theme configuration to be persisted across page reloads and navigations, so that my workspace layout preferences remain consistent without reset.

**Why this priority**: The Sidebar layout is the primary navigation hub of the application. Having the layout collapse/expand state or theme choices reset upon every page navigate or page reload is a bad user experience.

**Independent Test**: Can be fully tested by clicking the sidebar toggle button to collapse the sidebar, refreshing the page, and confirming that the sidebar remains collapsed.

**Acceptance Scenarios**:

1. **Given** the user is on any workspace page with the sidebar visible, **When** they click the sidebar toggle button, **Then** the sidebar collapses, and this layout preference is stored in localStorage.
2. **Given** the user has previously collapsed the sidebar, **When** they reload the browser or navigate to another page (e.g. from Dashboard to Candidates), **Then** the sidebar remains in the collapsed state from the start of the page mount (avoiding UI flicker).
3. **Given** the user toggles the application theme preference, **When** the preference changes, **Then** it is stored in localStorage and applied instantly across the entire UI.

---

### User Story 2 - Global Modal Management (Priority: P1)

As a user interacting with different pages, I want modal dialogs (such as Upload CV, Create Job, etc.) to be triggerable and closable globally without complex prop-drilling or local page-level conditional state, so that my interactions are smooth and clean.

**Why this priority**: Modals are used extensively across dashboards, candidate lists, and job creation panels. Relying on local useState and manual prop passing makes component composition brittle and prone to errors. A global modal manager simplifies user interaction states.

**Independent Test**: Can be fully tested by clicking an action button (e.g., "Upload CV" or "Create Job") on any page, verifying the corresponding modal opens, and verifying that clicking the close button or clicking outside closes it successfully.

**Acceptance Scenarios**:

1. **Given** the user clicks "Upload CV" from any candidates page or button, **When** the action is clicked, **Then** the global modal store opens the UploadCvModal with the correct initial parameters.
2. **Given** any modal is open, **When** the user clicks the close/dismiss button or presses Escape, **Then** the global modal store updates the open state for that specific modal to closed, and resets any modal-specific parameters.

---

### User Story 3 - Candidate Applications Filtering & View Mode State (Priority: P2)

As a recruiter looking at candidate lists, I want my filter choices (e.g., status, department), current page number, view layout mode (List vs. Kanban), and selected candidates checklist to remain synchronized and persist properly during navigation, so that I don't lose context while performing bulk actions or examining details.

**Why this priority**: Recruiters constantly shift between looking at list views, kanban view, filtering candidates, selecting candidates for bulk actions (like bulk email, bulk delete), and clicking into candidate detail pages. If they navigate back, they expect their previous selection state and view preferences to remain.

**Independent Test**: Can be fully tested by selecting multiple candidates in the list view, applying a filter, navigating to a candidate details page, clicking back, and verifying the selection and filter are preserved.

**Acceptance Scenarios**:

1. **Given** a user is on the candidate applications list, **When** they toggle between List and Kanban views, **Then** the layout updates immediately and the selected view is saved.
2. **Given** a user selects 3 candidates using checkboxes, **When** they click "Select All" or individual checkboxes, **Then** `selectedIds` updates in the application store and displays the Bulk Action Bar.
3. **Given** active filters are selected (e.g. job status: Active), **When** a user clicks to navigate to a candidate's detail page and then clicks "Back", **Then** the applications list page reloads with the job status filter still active.

---

### Edge Cases & Error Handling

- **Next.js SSR Hydration Mismatch**: Since Zustand store with `persist` middleware reads from `localStorage`, client-side initial values might differ from Server-Side Rendered (SSR) HTML. The system must prevent hydration mismatches by ensuring persistent values are only accessed/rendered on the client-side after mounting (e.g. using a `useEffect` or safe client-only wrappers/hooks).
- **Empty Selected Candidates**: If bulk actions are completed or the page changes filter conditions, the store must safely clear `selectedIds`.
- **Invalid LocalStorage Data**: If `localStorage` holds corrupted UI/Theme states, the store must fall back gracefully to default theme (light) and default sidebar state (expanded).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST define a global state store using Zustand. All store definition files must be placed in a dedicated store directory (`store/` or `lib/store/`).
- **FR-002**: The `useUIStore` MUST manage `sidebarExpanded` (boolean) and `theme` ('light' | 'dark'). It MUST use Zustand's `persist` middleware to save these settings to `localStorage`.
- **FR-003**: The `useModalStore` MUST manage open/closed states for all major global modal components in the app (including but not limited to `UploadCvModal`, `CreateJobModal`, and `EditCandidateModal`). It must allow passing optional payload parameters to the modal upon opening.
- **FR-004**: The `useApplicationsStore` MUST manage state for the candidate applications list, containing:
  - `filters` (object representing search query, status, job ID, etc.)
  - `pagination` (page number, page size)
  - `viewMode` ('list' | 'kanban')
  - `selectedIds` (array of strings representing candidate IDs selected for bulk actions)
  - Actions to update filters, reset filters, update pagination, toggle view mode, select/deselect candidate IDs, and clear selection.
- **FR-005**: The sidebar component and layout MUST consume state from `useUIStore` to toggle classes or attributes governing sidebar visibility and width, and updating it dynamically.
- **FR-006**: The Applications page components (e.g. candidate list, filters, layout switches) MUST consume state from `useApplicationsStore` and eliminate redundant local `useState` variables.

### Non-Functional & Frontend Quality Requirements

- **NFR-001 (Hydration Safety)**: All client-side store values retrieved from persistent storage (like theme and sidebar status) MUST be rendered safely on the client side, avoiding flash of unstyled content (FOUC) and React hydration mismatch errors.
- **NFR-002 (Type Safety)**: All Zustand stores must be strictly typed using TypeScript interfaces. No `any` type annotations should be used in store actions, payloads, or selectors.
- **NFR-003 (Performance / Selectors)**: Components consuming Zustand state MUST use fine-grained selectors (e.g., `const sidebarExpanded = useUIStore(state => state.sidebarExpanded)`) instead of pulling the entire store object, to avoid unnecessary re-renders of non-dependent components.

### Key Entities & Data Contracts *(include if feature involves data)*

- **UIStoreState**:
  - `sidebarExpanded`: boolean
  - `theme`: 'light' | 'dark'
  - `toggleSidebar`: () => void
  - `setTheme`: (theme: 'light' | 'dark') => void
- **ModalStoreState**:
  - `activeModal`: string | null (name of the currently open modal, e.g., 'upload-cv' | 'create-job' | null)
  - `modalData`: any | null (optional payload associated with the active modal)
  - `openModal`: (modalName: string, data?: any) => void
  - `closeModal`: () => void
- **ApplicationsStoreState**:
  - `filters`: { search: string; status: string; jobId: string }
  - `pagination`: { page: number; limit: number }
  - `viewMode`: 'list' | 'kanban'
  - `selectedIds`: string[]
  - `setFilters`: (filters: Partial<ApplicationsStoreState['filters']>) => void
  - `resetFilters`: () => void
  - `setPage`: (page: number) => void
  - `setViewMode`: (mode: 'list' | 'kanban') => void
  - `toggleSelectId`: (id: string) => void
  - `toggleSelectAll`: (ids: string[]) => void
  - `clearSelection`: () => void

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Zustand is successfully installed and integrated into the Next.js frontend project.
- **SC-002**: Sidebar collapse state is maintained across page refresh and routes navigation without resetting.
- **SC-003**: Modals (Upload CV, Create Job) can be opened and closed globally via store actions.
- **SC-004**: No Hydration mismatch warnings or compile-time TypeScript errors are introduced in the codebase.
- **SC-005**: Redundant local state variables (`useState` prop drilling) are completely removed from the refactored components.

## Assumptions

- We are using Next.js App Router where server components do not access browser APIs like `localStorage` or `window`. Therefore, any components reading persistent store states directly must handle mount detection or run entirely as client components.
- The UI components for candidate selection, sidebar, and modals already exist or have placeholders, and we are substituting local React states with Zustand state stores.
