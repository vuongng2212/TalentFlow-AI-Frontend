# Feature Specification: B2B SaaS Landing Page Refactor

**Feature Branch**: `feat/new-vers`

**Created**: 2026-06-03

**Status**: Draft

**Input**: User description: "Analyze the current Smart ATS landing page and refactor it into a high-converting B2B SaaS landing page structure."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Structured High-Converting B2B SaaS Landing Page (Priority: P1)

As a B2B SaaS buyer (Recruiting Lead or VP of People), I want to visit the TalentFlow AI landing page and see a clear, structured information flow that addresses our challenges, showcases the solution, details key features, and builds trust so that I can confidently evaluate the product and sign up or contact sales.

**Why this priority**: The structure and readability of the landing page directly determine visitor-to-signup conversion rates, which is the primary business goal of this refactor.

**Independent Test**: Can be tested by navigating the landing page on mobile/desktop and verifying that all 13 targeted sections are present in the specified order, load correctly, and use the existing design system styling.

**Acceptance Scenarios**:

1. **Given** I am on the landing page, **When** I scroll down the page, **Then** I see the sections in the following exact sequence:
   - Header / Navigation
   - Hero Section (retaining the interactive Kanban board mockup animation)
   - Trusted By / Social Proof (infinite scroll logo tiles)
   - Recruitment Challenges (new problem section highlighting common hiring friction)
   - Smart ATS Solutions (new solution cards mapping directly to challenges)
   - Key Features & Benefits (re-architected existing feature grid with optimized layout)
   - Recruitment Workflow (re-architected existing "How it works" steps)
   - Integrations (new section highlighting API integrations, job boards, and communication platforms)
   - Security & Compliance (new section showcasing enterprise security, SOC2, GDPR, data retention, and audit logs)
   - Customer Testimonials (styled quote cards from Novaware, Cloudkit, Axiom Data)
   - Business Impact / Metrics (re-architected stat cards with highlight hover states)
   - Pricing (three clear packages: Personal, Plus, Business with aligned CTA buttons)
   - FAQ (interactive accordion items)
   - Final CTA (full-width band with high-contrast text and a conversion button)
   - Footer (links and copyright info)
2. **Given** I am a mobile visitor, **When** I view any of these sections, **Then** they stack vertically and scale properly according to responsive design patterns.

---

### User Story 2 - Modular Component Architecture (Priority: P2)

As a frontend developer, I want the landing page to be composed of small, single-responsibility, reusable React components in the Next.js App Router so that the codebase is highly maintainable, testable, and clean.

**Why this priority**: Refactoring the monolith `app/page.tsx` into modular components makes the code cleaner, reduces merge conflicts, allows Server Component optimization, and simplifies future iterations.

**Independent Test**: Can be verified by inspecting the directory structure to see separate component files for each landing page section in `components/landing/` and checking that they are imported in `app/page.tsx`.

**Acceptance Scenarios**:

1. **Given** the repository structure, **When** checking component directories, **Then** all 13 landing page sections are isolated into dedicated component files under a new folder `components/landing/`.
2. **Given** the main page file `app/page.tsx`, **When** rendering the page, **Then** it must import and compose these component files rather than containing inline section markups.
3. **Given** shared visual elements (like SectionHeaders, FeatureCards, StatCards), **When** they are used in multiple sections, **Then** they are extracted into reusable components.

---

### User Story 3 - Preserving Visual Identity and Interactive Mockups (Priority: P3)

As a product designer, I want the refactored landing page to retain the exact Tailwind theme, design tokens, color palette, custom animations (including the Kanban move animation and success overlay), and overall visual identity so that branding consistency is maintained.

**Why this priority**: Ensures we don't break existing polished CSS, animations, and design details that have already been validated.

**Independent Test**: Can be tested by comparing the visual display of the Hero Section and Kanban mockup animation before and after the refactoring to confirm they remain identical in look, feel, and animation timing.

**Acceptance Scenarios**:

1. **Given** the refactored hero component, **When** the page loads, **Then** the Kanban mockup executes the 12-second loop animation showing the "Sarah Connor" card moving from Screening to Offer and showing the "Offer Sent" overlay.
2. **Given** the CSS theme, **When** colors, fonts, margins, or padding are rendered, **Then** they use the design system variables defined in `app/globals.css` (e.g. `--primary`, `--ai`, `--text-1`, `--border`).

---

### Edge Cases & Error Handling

- **Missing Content/Fallback**: If an integration or FAQ list is empty, the system must not render empty cards. Proper default data lists must be bundled with the components.
- **Accordion Toggle Collisions**: If multiple accordions are clicked quickly, only one should expand at a time, preventing layouts from overlapping.
- **Layout Shift (CLS)**: The infinite scrolling brand logos must load and scroll smoothly without causing layout shifts that affect core web vitals.
- **Accessibility & Navability**: Keyboard visitors (using `Tab` key) must be able to navigate all links, pricing buttons, FAQ headers, and action items in a logical order. Focus rings must be visible.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST render the landing page under the path `/` (Next.js App Router root page).
- **FR-002**: The landing page MUST be composed of isolated, reusable section components stored in `components/landing/`:
  - `HeroSection.tsx` (incorporates the animated Kanban mockup)
  - `TrustedLogos.tsx` (incorporates the infinite scroll brand slider)
  - `ChallengesSection.tsx` (renders recruitment challenges with matching icons)
  - `SolutionsSection.tsx` (renders solution value props mapped to challenges)
  - `FeaturesSection.tsx` (renders the 6 key product feature cards)
  - `WorkflowSection.tsx` (renders the step-by-step recruitment process)
  - `IntegrationsSection.tsx` (displays integrations with job boards, calendars, Slack, and email)
  - `SecuritySection.tsx` (displays security certificates, GDPR, SOC2 compliance, data retention details)
  - `TestimonialsSection.tsx` (renders quote tiles with author metrics)
  - `ImpactMetrics.tsx` (renders key metrics with hover/focus states)
  - `PricingSection.tsx` (renders personal, plus, and business packages with aligned CTAs)
  - `FaqSection.tsx` (renders the FAQ items using the existing Accordion component)
  - `FinalCta.tsx` (renders the call-to-action band at the bottom)
- **FR-003**: The Kanban board mockup animation, including the sliding "Sarah Connor" card and the "Offer Sent" success overlay, MUST be preserved inside the `HeroSection` with identical timing and visual styling.
- **FR-004**: The system MUST reuse the existing FAQ data array and the `Accordion` client component.
- **FR-005**: Navigation links in the Header and Footer MUST scroll smoothly to their respective anchors (`#features`, `#pricing`, `#how`, etc.).

### Non-Functional & Frontend Quality Requirements

- **NFR-001 (Design Consistency)**: The styling MUST strictly match the colors, border radii, shadows, and fonts specified in `app/globals.css`. Do not modify base variables or add global styles that alter the user workspace.
- **NFR-002 (Tailwind v4 First)**: All sections MUST be styled primarily using Tailwind classes. Do not introduce custom inline styling blocks or custom stylesheet files unless absolutely necessary for specific animations.
- **NFR-003 (Mobile Responsiveness)**: The layout MUST be completely mobile-friendly, collapsing grids (`grid-3`, `grid-4`, `hero-grid`, etc.) to `grid-cols-1` on screens smaller than 820px as defined in the responsive media queries.
- **NFR-004 (Core Web Vitals)**: Components must be React Server Components (RSC) by default. Client components (`'use client'`) must only be used where state or interactivity is required (e.g. Accordion, and any interactive tabs if added).
- **NFR-005 (Accessibility)**: Screen readers must be supported via appropriate ARIA labels (e.g., `aria-label` on Kanban mockups, `aria-expanded` on accordion buttons). All interactive elements must have a visible `:focus-visible` state.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the target sections (13 sections + Header & Footer) are successfully rendered in the specified order on `/`.
- **SC-002**: Zero global CSS variables in `app/globals.css` are overwritten, ensuring the main application dashboard workspace `/dashboard` looks and behaves identically to before the refactor.
- **SC-003**: Lighthouse/Core Web Vitals score for accessibility is maintained at or above 90 on desktop.
- **SC-004**: Running `pnpm lint` and `pnpm build` completes with zero ESLint or TypeScript compilation errors.

## Assumptions

- SVGs and icons will be generated inline or using SVG tags styled with Tailwind, eliminating dependencies on external icon packages that are not already present in the workspace.
- Next.js 16 and React 19 compatibility is preserved across all landing components.
- The `Accordion` component in `components/ui/accordion.tsx` is fully operational and can be imported and reused without modification.
