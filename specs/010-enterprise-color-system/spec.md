# Feature Specification: Enterprise Color System Refactor

**Feature Branch**: `010-enterprise-color-system`

**Created**: 2026-06-04

**Status**: Draft

**Input**: User description: "Hãy cập nhật hệ thống màu sắc (CSS variables) trong `app/globals.css` để nâng cao tính tin cậy của giao diện doanh nghiệp (Enterprise Trust): 1. Đổi màu chủ đạo thương hiệu `--primary` từ màu tím (#7C3AED) sang màu xanh indigo (#4F46E5) và cập nhật tương ứng `--primary-hover` (#4338CA), `--primary-soft` (#EEF2FF). 2. Đặt một biến màu riêng cho các tính năng AI: `--ai-accent: #0D9488` (màu xanh teal) và `--ai-accent-soft: #CCFBF1`. 3. Cập nhật class `.ai-chip` sử dụng gradient từ teal-600 sang teal-700 thay vì gradient tím. 4. Xóa hiệu ứng bóng đổ phát sáng tím `--shadow-ai` khỏi các phần không phải AI (thiết lập về `none` hoặc dùng bóng đổ xám nhạt trung tính). Thay thế bóng phát sáng của `.mockup` thành bóng đổ thông thường thanh lịch: `box-shadow: 0 4px 24px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)`. 5. Điều chỉnh line-height toàn cục của body lên 1.6 để tăng độ dễ đọc."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Enterprise Visual Style (Priority: P1)

As a corporate/enterprise client, when visiting the TalentFlow platform, I want a professional, trustworthy visual interface designed with corporate colors (indigo and teal) and clean typography, so that I feel confident in using the platform for talent acquisition and management.

**Why this priority**: Enterprise trust is key for B2B user adoption. Colors like indigo evoke stability, security, and professionalism compared to purple, which is often perceived as creative or consumer-oriented.

**Independent Test**: Can be tested by visually inspecting the platform's layout, ensuring it uses Indigo as the brand color, Teal for AI-related highlights, and has clean, readable spacing without distracting purple glows.

**Acceptance Scenarios**:

1. **Given** a user navigates to any page on the TalentFlow platform, **When** they view primary components (buttons, active tabs, navigation highlights), **Then** these components must use the professional Indigo color scheme instead of purple.
2. **Given** a user views a mock-up card or decorative UI container (e.g., dashboard preview cards), **When** they inspect the borders and shadow styling, **Then** there should be no glowing purple shadows, and the container should use a subtle, elegant gray/neutral drop shadow.
3. **Given** a user opens a long-form content section, **When** they read text blocks, **Then** the text spacing (line-height) must be comfortable and highly legible.

---

### User Story 2 - Distinct AI Highlight Visuals (Priority: P2)

As a TalentFlow user, when looking at features powered by AI (such as recommendations, screening chips, and intelligence insights), I want them to be visually distinct from normal branding components by using a dedicated teal color and gradient, so that I can easily recognize AI-assisted assistance.

**Why this priority**: Distinguishing between traditional filters and AI-generated insights is essential for clarity in modern AI-assisted workflows.

**Independent Test**: Can be tested by checking all AI highlights and chips on the dashboard or landing pages, ensuring they stand out in professional teal tones.

**Acceptance Scenarios**:

1. **Given** a user looks at an AI recommendation badge or AI chip, **When** they inspect its colors, **Then** it must showcase a gradient transitioning from medium-dark teal to darker teal, rather than a brand-purple gradient.

---

### Edge Cases & Error Handling

- **Contrast Ratios**: The indigo (`#4F46E5` and `#4338CA`) and teal (`#0D9488`) components must maintain high visual accessibility contrast against white or light backgrounds. If hover state styling makes text unreadable, the system should adapt the text color accordingly.
- **Global Theme Overrides**: The color system should correctly propagate to Tailwind components without breaking existing layouts or causing partial purple/indigo mixes in hybrid custom classes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The platform brand identity MUST transition from purple to indigo, updating all primary brand elements.
- **FR-002**: AI-related visual indicators and elements MUST be uniquely styled using teal accent colors and teal gradients.
- **FR-003**: Purple glow shadows (`--shadow-ai` or similar) MUST be removed from generic non-AI user interface components.
- **FR-004**: System mockup containers and code previews MUST display with an elegant, neutral shadow profile.
- **FR-005**: Text readability MUST be globally enhanced by adjusting the body text lines spacing to a wider layout.

### Non-Functional & Frontend Quality Requirements

- **NFR-001 (Performance)**: Theme changes MUST not cause layout shifts (CLS < 0.1) or increased page load times.
- **NFR-002 (Accessibility)**: All primary buttons, text, and AI chips MUST meet WCAG 2.1 Level AA color contrast requirements (minimum 4.5:1 ratio for regular text, 3:1 for large text or graphical components).
- **NFR-003 (Responsiveness)**: Typography line height of 1.6 MUST render properly across all mobile, tablet, and desktop views.
- **NFR-004 (Type Safety)**: Custom CSS variable tokens MUST be correctly registered in Tailwind configurations if applicable, maintaining strong consistency.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of primary call-to-actions, active links, and brand outlines reflect the indigo palette (`#4F46E5` default, `#4338CA` hover).
- **SC-002**: All AI badges/chips show a distinct teal gradient (`#0D9488` context) instead of purple gradients.
- **SC-003**: Body content elements maintain a uniform line-height of 1.6.
- **SC-004**: Mockup layouts have a precise shadow profile conforming to: `box-shadow: 0 4px 24px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)`.

## Assumptions

- We assume the brand color change is global and there are no pages where the old purple branding must be preserved.
- We assume that the user's browser default line-height is overridden by the global style without affecting form fields or specialized display controls that define their own heights.
- We assume the existing CSS variable architecture in `globals.css` is the single source of truth for color styling on the frontend.
