# Technical Research: B2B SaaS Landing Page Refactor

This document analyzes the engineering decisions and patterns selected for the landing page refactor.

## 1. Landing Page Section Sequence

### Decision
The landing page will render exactly 13 sections in the following strict vertical sequence:
1. **Header / Navigation**: User sign-in, signup, and links.
2. **Hero Section**: Core value proposition hook + interactive Kanban mockup.
3. **Trusted By / Social Proof**: Auto-scrolling enterprise logo tiles.
4. **Recruitment Challenges**: Problems and friction points recruiter teams face.
5. **Smart ATS Solutions**: Value props mapping solutions to the challenges.
6. **Key Features & Benefits**: Detailed 6-card feature grid with status badges.
7. **Recruitment Workflow**: Visual step-by-step process representation ("How it works").
8. **Integrations**: Displaying connectivity with API endpoints, job boards, Slack.
9. **Security & Compliance**: Enterprise trust signals (SOC2, GDPR, data retention).
10. **Customer Testimonials**: Quotes from real teams (Novaware, Cloudkit, Axiom Data).
11. **Business Impact / Metrics**: Percentage-based metrics cards with hover scaling.
12. **Pricing**: 3-tiered package grid (Personal, Plus, Business) with clear CTAs.
13. **FAQ**: Interactive QA items in a collapsible list.
14. **Final CTA**: High-converting band at the bottom.
15. **Footer**: Navigation links and copyright.

### Rationale
This sequence follows standard high-converting B2B SaaS frameworks (Attention -> Interest -> Desire -> Action). It introduces the product hook first, establishes credibility, defines the problem, introduces our solution/features, explains how it works, shows integrations/compliance for enterprise compatibility, backs it up with social proof/metrics, lays out pricing, clears up objections in the FAQ, and provides a clear concluding CTA.

### Alternatives Considered
- *Putting pricing at the top*: Rejected because pricing packages are meaningless to enterprise customers before they understand the feature set, metrics, and security.
- *Removing Challenges/Solutions*: Rejected because B2B conversion relies on emotional resonance with existing business pain points.

---

## 2. Component Decomposition & Next.js RSC Architecture

### Decision
- Create a directory `components/landing/`.
- Decompose the monolith into 13 isolated components, one per section.
- Render all landing page components as React Server Components (RSC) by default.
- Wrap the client-side `Accordion` component inside `FaqSection.tsx` so that client state is strictly localized to a leaf node.
- Use `'use client'` inside component headers only for elements requiring state (e.g. FAQ, interactive mobile navigation menu if needed).

### Rationale
- Comply with **Constitution Principle I** (Next.js App Router & Server-First).
- Reduces the size of the JavaScript bundle shipped to client browsers, improving Core Web Vitals (LCP, INP) scores.
- Simplifies dependency graphs and allows clean file separation.

### Alternatives Considered
- *Keeping everything client-side*: Rejected because it leads to bloated bundle sizes, slow initial page loads, and violates the project constitution.

---

## 3. Styling Variables & Tailwind CSS v4 Integration

### Decision
- Reuse existing custom properties defined in `/home/vuongnguyen/Projects/TalentFlow/TalentFlow-AI-Frontend/app/globals.css` (e.g., `--primary`, `--ai`, `--text-1`, `--border`).
- Do not add new global CSS variables that modify the environment.
- Any custom CSS classes or animations will be scoped using Tailwind utility classes or local custom rules inside `app/globals.css`.

### Rationale
- Reusing existing variables prevents style pollution.
- Ensures the core dashboard workspace (`/dashboard`) retains its exact look-and-feel with zero visual regression.
- Standardizes development with Tailwind v4 `@theme` configuration.

### Alternatives Considered
- *Using a separate stylesheet (CSS modules)*: Rejected because the project uses Tailwind v4 globally, and compiling external stylesheets can cause styling conflicts or layout shifts.

---

## 4. Navigation & Smooth Scroll Implementation

### Decision
- Anchor navigation links inside the Header and Footer to matching section IDs on the page (e.g. `#features`, `#pricing`, `#how`).
- Rely on the native CSS property `scroll-behavior: smooth` already defined on the `html` element or added to `app/globals.css`.
- Ensure anchor tags remain accessible with keyboard focus rings.

### Rationale
- Smooth scrolling increases the perceived quality of the website.
- Utilizing native CSS scroll behavior requires zero JavaScript overhead, maximizing performance.

### Alternatives Considered
- *JS-based smooth scroll library (e.g. React-Scroll)*: Rejected because it adds unnecessary third-party package dependencies and bundle size.

---

## 5. Mobile Responsiveness & Stacking Strategy

### Decision
- Use responsive Tailwind breakpoints (`md:`, `lg:`) to reflow grid layouts.
- For layouts like `grid-3`, `grid-4`, and the custom Hero layout, stack columns vertically (`grid-cols-1`) on screen sizes smaller than `820px` (or using `md:grid-cols-2 lg:grid-cols-3` cascades).
- Leverage Tailwind's flexbox wraps (`flex-wrap`, `justify-between`, etc.) for navigation links and footers.

### Rationale
- Ensure the landing page loads perfectly on all modern screen viewports (desktop, tablet, mobile).
- Comply with **NFR-003** (Mobile Responsiveness).

### Alternatives Considered
- *Device-specific routing (e.g. loading separate mobile pages)*: Rejected because it is complex to maintain and Next.js responsive designs handle layouts cleanly in a single viewport-driven page.
