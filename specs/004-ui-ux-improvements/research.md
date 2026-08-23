# Phase 0: Research

## Animation Approach for Smooth Entrances and Infinite Logo Loop

**Decision:** We will use pure CSS animations combined with Tailwind CSS utilities.

**Rationale:** 
- The requirements specify hardware-accelerated animations (opacity, transforms) running at 60fps, which can easily be achieved with CSS `@keyframes` and `animation` properties.
- Using pure CSS avoids adding heavy JavaScript libraries like Framer Motion or GSAP to the client bundle, which aligns with our Next.js App Router performance and Server-First architecture principles.
- Respecting `prefers-reduced-motion` is natively supported in CSS via media queries (`@media (prefers-reduced-motion: reduce)`) or Tailwind's `motion-safe` / `motion-reduce` variants.

**Alternatives considered:** 
- *Framer Motion*: Powerful and easy for complex staggering, but adds significant client-side weight. Since we only need an infinite carousel and smooth section entrances, it's overkill.
- *Intersection Observer API with JS*: Could trigger animations on scroll, but Tailwind's custom CSS animations combined with simple fade-in classes are simpler for entrance effects. For scroll-driven entrance, we might need a tiny `useIntersectionObserver` hook or just simple CSS fade-in on load if scroll isn't strictly necessary. Since the spec says "When sections enter the viewport, Then they should smoothly animate into place", a lightweight Intersection Observer custom hook (`useIntersectionObserver`) combined with CSS transitions is the best approach.

## Pricing Tiers Content Updates

**Decision:** Update the hardcoded pricing tiers in `app/page.tsx`.

**Rationale:** The landing page currently has "Personal (Free)", "Growth", and "Business" plans. We need to rename "Growth" to "Plus" and update the descriptions as per the spec. This is a straightforward content and structure update within the existing static Server Component.

**Alternatives considered:**
- Fetching pricing from a CMS or database. However, this is just a landing page update feature and no database schema changes are requested or needed for pricing tiers yet.

## Kanban Mockup Visual Hierarchy

**Decision:** Apply consistent CSS classes for AI badges and distinct background colors/borders for kanban columns in `app/page.tsx` and `app/globals.css`.

**Rationale:** The kanban mockup is purely structural HTML/CSS. Adding targeted CSS classes or Tailwind utility combinations will unify the AI badge sizes (removing specific inline overrides like `text-[9px] py-0.5 px-1.5`) and provide distinct visual cues for the columns (e.g., using existing variables like `--primary-soft`, `--amber-soft`, `--green-soft` for column backgrounds).

**Alternatives considered:**
- Redesigning the kanban structure entirely. Not required, only styling updates are needed.

## System Metrics Emphasis

**Decision:** Enhance the system metrics cards with gradient backgrounds, larger typography, or glowing shadow effects.

**Rationale:** The spec asks for visual highlights. We can use the existing `gradient-text` class or add a subtle `box-shadow: var(--shadow-ai)` to the cards, along with increasing the font weight and size of the metrics numbers.
