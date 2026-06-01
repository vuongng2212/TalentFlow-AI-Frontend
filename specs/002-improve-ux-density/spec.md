# Feature Specification: Improve UX Density and Realism

**Feature Branch**: `002-improve-ux-density`

**Created**: 2026-06-01

**Status**: Draft

**Input**: User description: "- Biến sidebar và role switch thành ngữ cảnh điều hướng rõ ràng hơn, tránh cảm giác chỉ là demo toggle; admin navigation cần thể hiện ranh giới quyền truy cập/tenant rõ ràng hơn. - Giảm cảm giác hard-code ở dashboard và các màn danh sách bằng cách đồng bộ dữ liệu, trạng thái hiển thị, và mức độ tin cậy của số liệu. - Nâng cấp search/filter cho bối cảnh ATS B2B: thêm filter chips, saved views nếu phù hợp, bulk actions, và mở rộng khả năng tìm kiếm trên nhiều thực thể. - Thay các affordance giả bằng hành động thật hoặc ẩn chúng đi nếu chưa có logic, ví dụ menu dấu ba chấm ở job cards. - Chuẩn hóa loading/empty/error states giữa dashboard, jobs, candidates, candidate detail, và các list view. - Tăng density và khả năng scan dữ liệu để recruiter/hiring manager đọc nhanh, hiểu nhanh, và tin vào thứ họ nhìn thấy."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Clear Navigation and Role Context (Priority: P1)

As a system user (Recruiter or Admin), I need to clearly understand my current role and tenant context from the sidebar and navigation, so that I don't feel like I'm using a prototype and understand my access boundaries.

**Why this priority**: Removing the "demo" feel of the navigation is critical for enterprise software credibility and establishes a solid foundation for the rest of the application context.

**Independent Test**: Can be tested by switching roles/tenants and verifying that the visual context (sidebar, headers) updates to reflect the clear boundaries, without feeling like a temporary toggle.

**Acceptance Scenarios**:

1. **Given** a user is logged in as an Admin, **When** they view the sidebar, **Then** they see administrative navigation clearly segregated from standard tenant actions.
2. **Given** a user interacts with the role switch, **When** they change roles, **Then** the application context clearly updates to reflect the new role's permissions and scope without visual ambiguity.

---

### User Story 2 - Consistent and Trustworthy Data Views (Priority: P1)

As a Recruiter, I want to see consistent, synchronized data across the dashboard and list views without "hard-coded" placeholders, so that I can trust the numbers and metrics I am looking at.

**Why this priority**: Hard-coded numbers destroy user trust in enterprise applications. Synchronizing this data is essential for the application to be usable.

**Independent Test**: Can be tested by verifying that numbers on the dashboard (e.g., total candidates) exactly match the counts in the corresponding list views.

**Acceptance Scenarios**:

1. **Given** the dashboard shows a summary of active jobs, **When** the user navigates to the jobs list, **Then** the data matches the summary exactly.
2. **Given** a UI element with a fake affordance (like an empty "..." menu on a job card), **When** the user interacts with it, **Then** it either performs a real action or is completely hidden/removed from the UI.

---

### User Story 3 - High-Density Scannable Lists (Priority: P2)

As a Hiring Manager or Recruiter, I need list views (jobs, candidates) to be highly dense and scannable, so I can read quickly, understand status at a glance, and make fast decisions.

**Why this priority**: ATS applications require processing large amounts of data. Low-density, spaced-out UIs slow down recruiters.

**Independent Test**: Can be tested by loading a list of 50 candidates and verifying that key information (status, role, name) can be scanned without excessive scrolling.

**Acceptance Scenarios**:

1. **Given** the candidates list view, **When** the user opens it, **Then** they see a compact, enterprise-grade data table or list that maximizes visible information per screen.
2. **Given** a job card, **When** displayed in a list, **Then** its status, key metrics, and title are formatted for immediate visual parsing.

---

### User Story 4 - Advanced B2B Filtering (Priority: P2)

As a Recruiter, I want to use advanced filtering (filter chips, saved views, bulk actions) across multiple entities, so that I can manage large pipelines efficiently.

**Why this priority**: Basic search is insufficient for B2B ATS workflows; complex filtering is a core requirement.

**Independent Test**: Can be tested by applying multiple filters to a list, verifying that filter chips appear, and performing a bulk action on the filtered results.

**Acceptance Scenarios**:

1. **Given** a list of candidates, **When** the user applies filters for "Status" and "Role", **Then** explicit filter chips appear reflecting these choices, and the list updates accordingly.
2. **Given** a filtered list, **When** the user selects multiple items, **Then** bulk action options become available and functional.

---

### User Story 5 - Standardized Application States (Priority: P3)

As a user, I want to see consistent loading skeletons, empty states, and error messages, so that I always know what the system is doing, even when there's no data or a failure occurs.

**Why this priority**: Consistent states improve perceived performance and user confidence, though they are secondary to correct data.

**Independent Test**: Can be tested by simulating slow network connections or API errors and observing the UI feedback in dashboard, jobs, and candidate views.

**Acceptance Scenarios**:

1. **Given** a page is fetching data, **When** the user waits, **Then** they see a standardized loading skeleton matching the expected content layout.
2. **Given** a list has no data, **When** it renders, **Then** a helpful, standardized empty state is shown with clear next steps.

---

### Edge Cases & Error Handling

- What happens when a bulk action fails partially? (Should show a standardized error state explaining which items failed).
- How does the UI represent loading, empty, and offline states? (Must use the newly standardized components for these states across all views).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display explicit role and tenant boundaries in the main navigation and sidebar, updating dynamically on role switch.
- **FR-002**: System MUST synchronize data points between summary dashboards and detailed list views to eliminate hard-coded inconsistencies.
- **FR-003**: System MUST remove or connect to real logic any "fake" UI affordances (e.g., disconnected dropdown menus, inactive buttons).
- **FR-004**: System MUST implement filter chips and advanced search capabilities for jobs and candidate lists.
- **FR-005**: System MUST support bulk selection and bulk actions on applicable list views.
- **FR-006**: System MUST implement standardized loading skeletons, empty states, and error states for the dashboard, jobs list, candidates list, and candidate detail views.
- **FR-007**: System MUST render list views in a high-density format optimized for rapid visual scanning.

### Non-Functional & Frontend Quality Requirements

- **NFR-001 (Consistency)**: UI patterns for filtering, state management, and density MUST be identical across all views.
- **NFR-002 (Performance)**: High-density lists MUST render efficiently without jank, meeting Core Web Vitals standards.
- **NFR-003 (Accessibility)**: Filter chips, bulk actions, and high-density tables MUST be fully keyboard navigable and screen-reader accessible.
- **NFR-004 (Type Safety)**: Complete strict TypeScript interface coverage without using `any` for the synchronized data models.

### Key Entities & Data Contracts *(include if feature involves data)*

- **RoleContext**: Represents the current user's role and tenant, dictating navigation visibility.
- **FilterState**: Represents the active filter chips, search queries, and selected saved views.
- **ListState**: Represents the standardized loading/empty/error state of a data fetch.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of identified "prototype" fake affordances (dead buttons, disconnected menus) are removed or made functional.
- **SC-002**: Dashboard metrics perfectly match list view counts (0 data discrepancies).
- **SC-003**: All main views (Dashboard, Jobs, Candidates, Candidate Detail) utilize the identical, standardized loading and empty state components.
- **SC-004**: Users can apply at least two simultaneous filters via chips and perform a bulk action on the result.
- **SC-005**: Information density is increased (measured by more rows/items visible in standard viewport height without sacrificing readability).

## Assumptions

- We are updating existing components and layouts rather than rewriting the application from scratch.
- The backend/API (if mocked or real) can support the synchronization of dashboard and list data.
- "Enterprise style" implies a professional, clean, high-contrast, and information-dense design language, aligning with existing design tokens.