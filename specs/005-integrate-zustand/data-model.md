# Data Model & State Schema

This document outlines the state schemas and interface contracts for the Zustand stores.

## 1. UI Store Schema (`useUIStore`)

Manages layout and display modes.

### State Fields
- `theme`: `'light' | 'dark'` - The active color scheme.
- `sidebarExpanded`: `boolean` - True if the navigation sidebar is open/expanded.

### Actions
- `setTheme(theme: 'light' | 'dark') => void`: Directly set the active theme.
- `toggleTheme() => void`: Toggle between light and dark theme.
- `setSidebarExpanded(expanded: boolean) => void`: Set sidebar expanded or collapsed state.
- `toggleSidebar() => void`: Toggle sidebar expanded/collapsed state.

---

## 2. Modal Store Schema (`useModalStore`)

Manages global dialog overrides.

### State Fields
- `activeModal`: `ModalType | null` - The ID/name of the open modal, or `null` if none.
  - Type `ModalType` is union: `'upload-cv' | 'create-job' | 'edit-job' | 'edit-candidate' | 'schedule-interview'`.
- `modalData`: `any | null` - Any payload parameters passed to the active modal (e.g., job info for edit).

### Actions
- `openModal(modal: ModalType, data?: any) => void`: Opens a modal and sets optional payload.
- `closeModal() => void`: Closes the current modal and resets payload data.

---

## 3. Applications Pipeline Store Schema (`useApplicationsStore`)

Manages search, stage filters, checklist records, and paging variables for candidate lists.

### State Fields
- `filters`: `ApplicationsFilters`
  - `search`: `string`
  - `stage`: `string` (e.g. `'all' | 'applied' | 'screening' | ...`)
  - `minScore`: `number`
- `pagination`: `ApplicationsPagination`
  - `page`: `number` (1-indexed)
  - `limit`: `number`
- `viewMode`: `'list' | 'kanban'`
- `selectedIds`: `string[]` - Array of application IDs selected for bulk actions.

### Actions
- `setFilters(filters: Partial<ApplicationsFilters>) => void`: Updates filter variables and resets current page to 1.
- `resetFilters() => void`: Resets filters to default (empty search, stage `'all'`, score 0).
- `setPage(page: number) => void`: Updates active page.
- `setLimit(limit: number) => void`: Updates active items per page.
- `setViewMode(mode: 'list' | 'kanban') => void`: Updates active display layout and automatically adjusts item limits (100 for Kanban, 10 for List).
- `toggleSelectId(id: string) => void`: Check or uncheck a single candidate.
- `setSelectedIds(ids: string[]) => void`: Set multiple candidate selections at once (e.g., Select All).
- `clearSelection() => void`: Empties the checklist.
