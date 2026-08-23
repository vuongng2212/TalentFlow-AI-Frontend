# Feature Specification: UI/UX Improvements for Landing Page

**Feature Branch**: `004-ui-ux-improvements`

**Created**: 2026-06-01

**Status**: Draft

**Input**: User description: "Tôi đang muốn cải thiện UI/UX cho landing page @app/page.tsx , hiện tại thì nó khá enterprise rồi nhưng chúng ta cần làm cho landing page trở nên thu hút hơn. Đây là một số góp ý của tôi, hãy xem xét những góp ý này và thực hiện thay đổi nhé:
1. Ở kanban mockup các bagde AI đang hiển thị nhiều kích cở, cần đồng bộ tất cả để trông dễ chịu hơn. Các cột nên có một border hay background màu sắc để nhấn mạnh các step trong kanban board nhằm để người dùng chú ý hơn
2. Landing section logos nên build animation tự động loop vô cực chạy từ trái sang phải
3. Landing section card pad hiển thị số liệu của hệ thống nên highlight để nhấn mạnh hơn
4. Ở Plans for recruiting teams at every stage Chúng ta sẽ có 3 gói Free, Plus, Bussiness. Free và Plus là cho người dùng cá nhân, các interviewer freelancer có thể dùng để quản lý thông tin tuyển dụng, plus sẽ mở rộng một số tính năng như tổng hợp thông tin của ứng viên và đề xuất và mở rộng limit việc parsing CV bằng AI để chấm điểm. Bussiness là gói cho doanh nghiệp, người đại diện (ADMIN) có thể tạo 1 board tổng và mời các nhân sự có liên quan (interviewer, recuiter) join chung vào một workspace để làm việc chung (backend đang phát triển nên không thể mô tả nhiều hơn)
5. Thêm các hiệu ứng animation chuyển động mượt mà"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Understand Value Proposition via Mockup (Priority: P1)

As a prospective customer visiting the landing page, I want to see a clear, visually appealing kanban mockup with unified AI badges and distinct columns so that I can quickly grasp how the application organizes candidates and AI scores.

**Why this priority**: The kanban mockup is a central piece of the hero section. Improving its visual hierarchy and consistency immediately enhances the perceived quality of the product.

**Independent Test**: Can be fully tested by loading the landing page and visually inspecting the kanban board mockup for consistent AI badge sizes and emphasized column styles (borders/backgrounds).

**Acceptance Scenarios**:

1. **Given** I visit the landing page, **When** I look at the kanban mockup, **Then** all AI badges must have identical sizing and typography.
2. **Given** I visit the landing page, **When** I look at the kanban mockup, **Then** the kanban columns must have distinct background colors or borders distinguishing each step.

---

### User Story 2 - Smooth and Engaging Discovery (Priority: P2)

As a visitor, I want to experience smooth motion animations and an infinite logo scrolling section so that the site feels modern, dynamic, and less rigidly "enterprise."

**Why this priority**: First impressions matter. Motion animations and an infinite logo carousel build trust and make the site feel premium.

**Independent Test**: Can be fully tested by scrolling down the landing page and observing the infinite loop logo section and general smooth entrance animations for page elements.

**Acceptance Scenarios**:

1. **Given** I scroll to the logos section, **When** it becomes visible, **Then** the logos must animate automatically in an infinite loop from left to right.
2. **Given** I navigate the landing page, **When** sections enter the viewport, **Then** they should smoothly animate into place.

---

### User Story 3 - Comprehend Pricing Options (Priority: P2)

As a freelancer or an enterprise admin, I want to clearly see three distinct pricing plans (Free, Plus, Business) with their specific target audiences and features so that I can choose the right plan for my needs.

**Why this priority**: Pricing is critical for conversion. Clearly communicating the new Free, Plus, and Business tiers guides users to the correct funnel.

**Independent Test**: Can be fully tested by navigating to the pricing section and verifying the presence of 3 distinct cards (Free, Plus, Business) with the correct descriptions as outlined.

**Acceptance Scenarios**:

1. **Given** I view the pricing section, **When** reading the Plus plan, **Then** it should mention expanded CV parsing limits, candidate synthesis, and that it's suited for individuals/freelancers.
2. **Given** I view the pricing section, **When** reading the Business plan, **Then** it should mention enterprise features like ADMIN workspace creation and inviting recruiters/interviewers.

---

### User Story 4 - Emphasized System Metrics (Priority: P3)

As a visitor, I want to see the key system metrics highlighted so that the value of the platform is immediately obvious.

**Why this priority**: Metrics provide social proof and quantify value. Making them stand out helps quickly communicate ROI.

**Independent Test**: Can be fully tested by viewing the metrics card section and ensuring they stand out visually (e.g., via highlights, typography, or styling).

**Acceptance Scenarios**:

1. **Given** I view the system metrics cards, **When** I read the numbers, **Then** they should be visually highlighted (e.g., with gradients, larger sizes, or specific accent colors).

---

### Edge Cases & Error Handling

- **Reduced Motion**: If a user has `prefers-reduced-motion` enabled in their OS, how should the infinite logo loop and smooth animations behave? They should gracefully fall back to static or minimal-motion alternatives.
- **Responsive Layouts**: How do the three pricing cards stack on mobile devices? They should stack vertically.
- **Logo Carousel on Mobile**: The infinite logo loop must still function correctly and smoothly on narrow touch screens without causing horizontal scrollbar issues.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The pricing section MUST be updated to display exactly three tiers: Free, Plus, and Business.
- **FR-002**: The 'Plus' tier description MUST highlight candidate information synthesis and expanded AI CV parsing limits for individual/freelance interviewers.
- **FR-003**: The 'Business' tier description MUST highlight team collaboration (ADMIN creating a board, inviting interviewers/recruiters).
- **FR-004**: The landing section logos MUST implement an infinite scrolling animation from left to right.

### Non-Functional & Frontend Quality Requirements

- **NFR-001 (UI Consistency)**: All AI badges within the kanban mockup MUST share the exact same dimensions, padding, and font size.
- **NFR-002 (Visual Hierarchy)**: Kanban columns MUST use borders or subtle background colors to differentiate pipeline stages visually.
- **NFR-003 (Emphasis)**: The system metrics cards MUST use highlighting techniques (color, scale, or layout) to draw attention.
- **NFR-004 (Animation & Performance)**: All added smooth animations and the logo carousel MUST be hardware-accelerated (using CSS transforms/opacity) to ensure 60fps performance and avoid layout thrashing.
- **NFR-005 (Accessibility)**: Animations MUST respect `prefers-reduced-motion` media queries.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The landing page displays 3 pricing plans (Free, Plus, Business) with accurate descriptions.
- **SC-002**: The kanban mockup AI badges are perfectly uniform in size.
- **SC-003**: The logo section animates infinitely without visual stuttering or layout shift.
- **SC-004**: The system metrics cards are visually distinct from standard text.
- **SC-005**: Smooth transitions are present but disable gracefully for users with reduced motion preferences.

## Assumptions

- We will implement animations using CSS (Tailwind) or a lightweight animation library (like Framer Motion) depending on existing project dependencies.
- The kanban mockup is purely structural HTML/CSS and does not require complex interactive state for the landing page.
- "Highlighting" metrics can be achieved through styling (color, size, background) without requiring new assets.