# Feature Specification: Landing Page Kanban Animation

**Feature Branch**: `[007-landing-page-kanban]`

**Created**: 2026-06-03

**Status**: Draft

**Input**: User description: "1. Mục tiêu: Cải thiện giao diện Landing Page (UI/UX) và thêm hiệu ứng Kanban chuyển động mà không làm ảnh hưởng đến CSS của Workspace hiện tại..."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Animated Kanban Mockup (Priority: P1)

As a visitor to the landing page, I want to see an engaging, animated Kanban board mockup so that I can understand the core value proposition of the product immediately.

**Why this priority**: The hero section animation is the primary hook for visitors and directly impacts conversion rates.

**Independent Test**: Can be tested by visiting the landing page and observing the "Sarah Connor" card moving smoothly from the Screening column to Interview, and finally to Offer, triggering the success overlay.

**Acceptance Scenarios**:

1. **Given** I am on the landing page, **When** the Kanban section is visible, **Then** I see 3 columns: Screening, Interview, Offer.
2. **Given** the animated Kanban is running, **When** the animation sequence starts, **Then** the "Sarah Connor" card begins under "Maya Chen" in the Screening column.
3. **Given** the "Sarah Connor" card is moving, **When** it transitions to the next phase, **Then** it moves to the top of the Interview column.
4. **Given** the "Sarah Connor" card is in the Interview column, **When** the final transition occurs, **Then** it moves to the Offer column and a centered Success Overlay appears with a backdrop-blur effect and "Offer Sent" text.
5. **Given** I am viewing the page on a mobile device, **When** the animation runs, **Then** the movement parameters are adjusted so the layout doesn't break.

---

### User Story 2 - Pricing Section Improvements (Priority: P2)

As a potential customer, I want to clearly see the pricing options and call-to-action buttons aligned so that I can easily compare and select a plan.

**Why this priority**: Clear pricing drives purchasing decisions.

**Independent Test**: Can be tested by scrolling to the Pricing section and verifying the visual alignment and highlighting of the "Plus" package.

**Acceptance Scenarios**:

1. **Given** I am looking at the Pricing cards, **When** cards have varying content lengths, **Then** the call-to-action (CTA) buttons remain perfectly aligned at the bottom of all cards.
2. **Given** I am looking at the Pricing section, **When** I see the "Plus" package, **Then** it is highlighted with a primary-colored border (`ring-2 ring-primary`) and a drop shadow.

---

### User Story 3 - Interactive FAQ Accordion (Priority: P3)

As a visitor with questions, I want an intuitive FAQ section that smoothly reveals answers so that I can easily find information without page reloads.

**Why this priority**: Reduces friction for common questions and improves overall UX polish.

**Independent Test**: Can be tested by clicking on FAQ items and observing the transition, icon rotation, and color changes.

**Acceptance Scenarios**:

1. **Given** the FAQ section is rendered, **When** I click to open a question, **Then** the answer slides down smoothly using `max-height` and CSS transitions.
2. **Given** an FAQ item is being opened, **When** it expands, **Then** the `+` icon rotates to become an `x` icon.
3. **Given** an FAQ item is active/open, **When** viewing its header, **Then** the text/icon color changes to the Primary color.

---

### Edge Cases & Error Handling

- **Animation Performance**: What happens on low-end devices? The CSS animations should use transform and opacity for hardware acceleration.
- **Resize Events**: How does the Kanban animation handle window resizing? The animation keyframes might need to use relative units (percentages/rem) or re-calculate via CSS calc() based on column gaps.
- **Reduced Motion**: If a user has `prefers-reduced-motion` enabled, the animation should gracefully degrade (e.g., skip to the final state or disable the movement).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST render an animated Kanban board with 3 columns (Screening, Interview, Offer) using Tailwind CSS and specific custom classes (e.g., `.lp-kanban-card`).
- **FR-002**: System MUST animate a specific card ("Sarah Connor") along the X and Y axes using absolute positioning and gap-based keyframes.
- **FR-003**: System MUST display a "Success Overlay" with a backdrop blur and "Offer Sent" message when the card reaches the Offer column.
- **FR-004**: System MUST align pricing CTA buttons to the bottom of their respective cards using flexbox (`flex flex-col justify-between`).
- **FR-005**: System MUST visually distinguish the "Plus" pricing plan with a specific border and shadow.
- **FR-006**: System MUST provide an interactive FAQ accordion with smooth height transitions, icon rotation (`+` to `x`), and color changes when active.
- **FR-007**: System MUST adjust Kanban animation parameters on mobile viewports to prevent layout breakage.

### Non-Functional & Frontend Quality Requirements

- **NFR-001 (Isolation)**: ALL styling updates MUST be isolated to the Landing Page. Under NO circumstances should base selectors (`body`, `html`, `.btn`, `.card`) in `globals.css` be modified, preserving the Workspace styling.
- **NFR-002 (Tailwind First)**: Styling MUST rely predominantly on Tailwind CSS utility classes. Custom animations MUST be defined in `@theme` (Tailwind v4) or scoped custom classes.
- **NFR-003 (Performance)**: Animations MUST use CSS `transform` and `opacity` properties to ensure 60fps rendering without triggering layout repaints.
- **NFR-004 (Responsiveness)**: The layout and animations MUST function correctly across mobile, tablet, and desktop viewports.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The "Sarah Connor" card successfully completes its animation sequence from Screening to Offer on both Desktop and Mobile views without breaking the layout bounds.
- **SC-002**: Visual regression tests or manual verification confirms that the core application/Workspace UI remains completely unaffected by these changes.
- **SC-003**: All Pricing card CTA buttons are horizontally aligned regardless of card content height.
- **SC-004**: FAQ accordions transition smoothly without jarring layout jumps.

## Assumptions

- Tailwind CSS v4 is configured correctly to support `@theme` directives for custom animations.
- The Landing Page is currently structured using React/Next.js components.
- There is a defined "Primary" color in the Tailwind theme to use for the Pricing highlight and FAQ active states.