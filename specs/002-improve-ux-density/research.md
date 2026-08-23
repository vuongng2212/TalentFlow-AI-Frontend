# Research: Improve UX Density and Realism

## 1. Advanced B2B Filtering (Filter Chips & Bulk Actions)
- **Decision**: Implement a centralized `FilterState` based on URL search params for managing filters, combined with a `FilterBar` component that renders active filter chips. Use a standard UI pattern for bulk selection (checkboxes in lists) paired with a floating action bar.
- **Rationale**: URL search params allow for shareable views (saved views) and maintain state across navigation seamlessly in Next.js App Router. A floating action bar for bulk actions keeps the UI clean until selection occurs.
- **Alternatives considered**: Redux/Context based local state (rejected because it breaks shareability and standard browser navigation).

## 2. Standardized Application States
- **Decision**: Create reusable `ListState` components: `LoadingSkeleton`, `EmptyState`, and `ErrorState`. These will be used uniformly across Dashboard, Jobs, Candidates, etc.
- **Rationale**: Ensures NFR-001 (Consistency) and speeds up development by reusing standard visual states.
- **Alternatives considered**: Custom loading states per component (rejected due to inconsistency and maintenance overhead).

## 3. High-Density Scannable Lists
- **Decision**: Adopt a high-density tabular or compact card layout using Tailwind's compact spacing (e.g., `p-2` or `px-3 py-2` instead of `p-4`, smaller text sizes `text-sm`, optimized typography for scannability).
- **Rationale**: Meets User Story 3, allows recruiters to see more data without scrolling.
- **Alternatives considered**: Existing card-based layouts with high padding (rejected due to low density).

## 4. Navigation and Role Context
- **Decision**: Refactor the main layout/sidebar to explicitly display the `RoleContext` (Admin vs. Recruiter/Tenant). Use visual cues (e.g., different header colors or clear badging) to denote the current role.
- **Rationale**: Fixes the "demo" feel and establishes clear security/context boundaries (User Story 1).
- **Alternatives considered**: A simple dropdown toggle without broader UI changes (rejected as it doesn't solve the contextual ambiguity).

## 5. Data Synchronization
- **Decision**: Centralize data fetching helpers in `services/` and leverage Next.js Server Components caching to ensure the Dashboard summary metrics derive from the exact same data source/queries as the List views.
- **Rationale**: Eliminates hard-coded values and builds trust (User Story 2).
- **Alternatives considered**: Separate API endpoints for summary vs list without shared caching (rejected as it can lead to synchronization issues if not carefully managed).