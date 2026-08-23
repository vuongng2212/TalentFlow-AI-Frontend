# Feature Specification: Dashboard Layout and Component Enhancements

**Feature Branch**: `011-dashboard-enhancements`

**Created**: 2026-06-13

**Status**: Draft

**Input**: User description: "Please rewrite the dashboard page `TalentFlow-AI-Frontend/app/(workspace)/dashboard/page.tsx` with the following enhancements: 1. Fix Pipeline Breakdown Layout Bug (overlapping badge/candidate count, flexbox layout, horizontal progress bar share); 2. Render Application Trends Chart (SVG-based or lightweight chart in Recruitment Activity Trend card); 3. Modernize Stat Cards (custom backgrounds, icons, percentage changes/premium indicators); 4. Enhance Top Performing Jobs Table (zebra striping, custom hover, department icons, explicit column widths, visual badge for count)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Fixed Pipeline Stage Layout & Visual Share (Priority: P1)

As a Recruiter viewing the dashboard, I want to clearly read the recruitment pipeline stages and candidate counts side-by-side without text overlapping, along with a visual indicator showing each stage's portion of total applications.

**Why this priority**: Immediate layout fix to resolve overlapping text bugs, ensuring the interface is usable and professional.

**Independent Test**:
- Open the dashboard page.
- Navigate to the "Pipeline Breakdown" section.
- Verify that stage badges (e.g., "APPLIED") are aligned to the left and candidate counts (e.g., "12 candidate(s)") are aligned to the right.
- Verify that a subtle progress bar is rendered beneath each stage.
- Verify that resizing the browser window does not cause the text to overlap or overflow the container.

**Acceptance Scenarios**:
1. **Given** the dashboard is loaded with pipeline data, **When** viewing the "Pipeline Breakdown" card, **Then** each stage name is rendered as a distinct badge on the left, the count of candidates is aligned to the right, and no text overlaps.
2. **Given** pipeline data exists, **When** the breakdown is rendered, **Then** a horizontal progress bar appears under each stage row, representing the stage's candidate count as a percentage of the total candidates across all stages.

---

### User Story 2 - Recruitment Activity Trend Chart (Priority: P2)

As a Recruitment Manager, I want to see a visual chart of daily application volumes over time so that I can understand recent recruiting activity trends at a glance.

**Why this priority**: Provides key trend analysis that helps managers identify peak recruitment activity periods.

**Independent Test**:
- Open the dashboard page.
- Verify the presence of a card titled "Recruitment Activity Trend".
- Verify that the daily applications trend data is plotted as a clean, responsive line or area chart using SVG elements.
- Hover or view the dates and counts to verify they map to the application volume.

**Acceptance Scenarios**:
1. **Given** application trend data is loaded, **When** the page renders, **Then** a dedicated card displays the recruitment trend chart spanning full width or adjacent to the pipeline card.
2. **Given** the trend chart is rendered, **When** the viewport width changes, **Then** the SVG viewBox adjusts responsively to fit the containing card without overflow.

---

### User Story 3 - Modernized Stats Summary (Priority: P3)

As a Talent Acquisition Director, I want high-level metrics cards to look modern and premium, featuring descriptive sub-labels, clear categorization, and custom visual accents.

**Why this priority**: Enhances the visual hierarchy and modern B2B SaaS appearance of the main dashboard landing view.

**Independent Test**:
- Open the dashboard page.
- Examine the four top metric cards (Open Positions, Total Applications, Candidate Database, and Hired Count).
- Verify each card has a custom background styling, a dedicated matching icon, and clear labels showing percentage rates or totals.

**Acceptance Scenarios**:
1. **Given** overview stats are available, **When** the dashboard page loads, **Then** four metrics cards are displayed with distinct visual hierarchies: a clear title, a primary value, a stylized icon, and a contextual trend or summary subtext.
2. **Given** hire statistics are loaded, **When** viewing the hire card, **Then** it clearly showcases the hire rate percentage in a highlighted, legible format.

---

### User Story 4 - Department-Enhanced Job Performance Table (Priority: P4)

As a Hiring Manager, I want the Top Performing Jobs table to be clean, readable, and interactive, with visual badges for application volume and clear departmental classification.

**Why this priority**: Allows quick visual sorting and identification of active hiring pipelines.

**Independent Test**:
- Open the dashboard page and locate the "Top Performing Jobs" table.
- Verify that table rows are styled with zebra striping (alternate row colors) and highlight on hover.
- Verify that application counts are styled inside pill-shaped badges rather than plain text.
- Verify that explicit column widths prevent cell content wrapping issues.

**Acceptance Scenarios**:
1. **Given** active jobs data, **When** looking at the top jobs table, **Then** the rows are zebra-striped, and hover states subtly change the background color of the active row.
2. **Given** application count data, **When** the table displays a job, **Then** the application count is enclosed in a structured visual badge.

---

### Edge Cases & Error Handling

- **Zero Total Applications in Pipeline**: If the sum of all pipeline counts is 0, the progress bar percentages MUST gracefully default to 0% to avoid division-by-zero errors.
- **Empty Trends Data**: If the trends array is empty or fails to load, the chart area MUST display a clean placeholder message ("No trend data available") rather than rendering an empty SVG grid or throwing an error.
- **Varying Text Lengths**: Job titles or department names that are excessively long MUST be clipped gracefully with ellipsis rather than breaking the table layout.
- **Responsive Layout Collapsing**: On small viewports, grid columns MUST stack cleanly (single-column cards and tables) to maintain mobile accessibility.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Pipeline Breakdown stages list MUST display the stage badge on the left and candidate count on the right using Flexbox alignment.
- **FR-002**: The Pipeline Breakdown list MUST compute the relative share of each stage based on the total number of pipeline candidates, rendering a horizontal progress bar underneath each stage row.
- **FR-003**: The system MUST render an SVG-based line/area chart to visualize the `trends` application volume over time inside a card titled "Recruitment Activity Trend".
- **FR-004**: The Recruitment Activity Trend chart card MUST span full width or position itself alongside the pipeline card in a balanced grid layout.
- **FR-005**: The 4 top metrics cards MUST be redesigned with custom premium backgrounds, category icons, and high-visibility typography hierarchy.
- **FR-006**: The Top Performing Jobs table MUST have alternate row background styling (zebra striping) and custom hover transition states.
- **FR-007**: The table column widths MUST be explicitly set to ensure clean alignment, and application counts MUST be formatted as a styled badge.
- **FR-008**: UI components MUST handle fallback states (zero values or empty arrays) for metrics, pipeline, and trends gracefully.

### Non-Functional & Frontend Quality Requirements

- **NFR-001 (Performance)**: The custom SVG chart MUST be highly performant and lightweight, avoiding heavy external canvas or charting dependencies.
- **NFR-002 (Accessibility)**: All interactive elements, links, and buttons MUST maintain focus styles and pass contrast validation (WCAG AA).
- **NFR-003 (Responsiveness)**: The layout MUST scale smoothly from mobile viewports (stacked layouts) up to ultra-wide desktop monitors (multivariable grid).
- **NFR-004 (Type Safety)**: The page structure and components MUST follow strict TypeScript compilation rules, with explicit interfaces for all custom visual metrics.

### Key Entities & Data Contracts *(include if feature involves data)*

- **DashboardMetrics**:
  - `totalJobs`: number
  - `openJobs`: number
  - `totalCandidates`: number
  - `totalApplications`: number
  - `hiredCount`: number
  - `hireRate`: number
- **PipelineStageCount**:
  - `stage`: string (ApplicationStage enum value)
  - `count`: number
- **TrendData**:
  - `date`: string (date representation)
  - `applications`: number (daily count)
- **TopJobData**:
  - `id`: string
  - `title`: string
  - `department`: string
  - `status`: string
  - `applicationCount`: number

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Overlapping text issues in the Pipeline Breakdown list are fully resolved, with 100% of pipeline items aligned correctly on all viewports.
- **SC-002**: A responsive SVG chart successfully displays the past daily application volume, adjusting seamlessly to parent container width changes.
- **SC-003**: Lighthouse accessibility score for the dashboard page is maintained at 90 or above.
- **SC-004**: Zero TypeScript strict compilation or ESLint errors in `app/(workspace)/dashboard/page.tsx`.

## Assumptions

- **A-001**: The layout shell and global page headers are managed by the parent workspace layouts.
- **A-002**: Data fetching endpoints are fully operational and return the expected structured contracts for overview metrics, top jobs, pipeline breakdown, and trend analytics.
- **A-003**: The Tailwind CSS 4 theme is configured and supports the custom colors (`var(--primary)`, `var(--surface)`, `var(--border)`, etc.) used for premium card backgrounds.
