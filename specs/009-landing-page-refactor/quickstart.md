# Quickstart Guide: B2B SaaS Landing Page Refactor

This guide explains how to spin up the local development environment, verify the refactored landing page, and run the testing suite.

## 1. Local Environment Setup

Ensure you have the primary package manager `pnpm` installed.

1. **Install dependencies** (if not already done):
   ```bash
   pnpm install
   ```

2. **Start the local Next.js development server**:
   ```bash
   pnpm dev
   ```

3. **Open the browser**:
   Navigate to `http://localhost:3000` to view the refactored landing page.

---

## 2. Visual & Functional Verification Steps

### Verification Flow 1: 13 Targeted Landing Sections
Scroll down the landing page and verify that all 13 targeted sections appear in the exact order below:
1. Header / Navigation
2. Hero Section (Kanban animation)
3. Trusted By / Social Proof (infinite scroll brand logo slider)
4. Recruitment Challenges
5. Smart ATS Solutions
6. Key Features & Benefits (6-card feature grid)
7. Recruitment Workflow (step-by-step)
8. Integrations
9. Security & Compliance
10. Customer Testimonials
11. Business Impact / Metrics
12. Pricing (Personal, Plus, Business plans)
13. FAQ (Accordion)
14. Final CTA
15. Footer

### Verification Flow 2: Hero Kanban Animation
1. Load `http://localhost:3000`.
2. Inspect the Kanban board mockup in the Hero.
3. Verify that the "Sarah Connor" card initiates its movement cycle from **Screening** and ends in **Offer** on a 12-second loop.
4. Verify that the "Offer Sent" success overlay appears on cue.

### Verification Flow 3: FAQ Accordion Toggle Collisions
1. Scroll down to the FAQ section.
2. Click multiple accordion items rapidly.
3. Verify that only one accordion item stays expanded at a time, preventing layouts from overlapping.
4. Confirm that the plus symbol (`+`) rotates to `x` when open.

### Verification Flow 4: Responsive Stacking
1. Open the browser Developer Tools and toggle the Device Toolbar (or manually resize the window).
2. Set the width to `< 820px`.
3. Verify that all grid layouts (Hero grid, logo carousels, feature cards, pricing tables, challenges) wrap and stack vertically.

### Verification Flow 5: Dashboard Workspace Safety
1. Navigate to `/dashboard` (or click "Login" and log in).
2. Verify that all workspace pages retain their correct layouts, headers, sidebars, and fonts.
3. Confirm that no styles were corrupted or regressed in the dashboard workspace due to landing-page-specific styles.

---

## 3. Code Quality & Compilation Checks

Run the following commands before submitting code or creating a PR to ensure compliance with the quality gates:

- **Lint checks**:
  ```bash
  pnpm lint
  ```

- **Production compilation check**:
  ```bash
  pnpm build
  ```
