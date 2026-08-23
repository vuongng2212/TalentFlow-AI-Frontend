# Phase 0: Research & Technical Decisions

**Feature Branch**: `feat/new-vers`
**Spec**: `specs/007-landing-page-kanban/spec.md`

## 1. Kanban Animation Approach
- **Decision**: Use Tailwind CSS v4 `@theme` to define custom `@keyframes` and apply them via scoped classes.
- **Rationale**: Keeps styles consolidated in `globals.css` without requiring inline styles in components. Using `transform` (translate) and `opacity` ensures smooth, hardware-accelerated animations (60fps) without triggering layout repaints.
- **Alternatives considered**: Framer Motion (rejected to avoid adding new heavy dependencies and keep bundle size small for a landing page feature); standard CSS `transition` (rejected because we need a sequenced multi-step animation, which is better served by `@keyframes`).

## 2. Kanban Mobile Responsiveness
- **Decision**: Use CSS `@media` queries within the `@keyframes` or separate animation classes for mobile (`sm:`, `md:`) to adjust the translation distances.
- **Rationale**: The column gaps and widths change on mobile (stacking vertically or having different widths). Hardcoding pixel distances in one keyframe will break layout on different screen sizes. Using percentage-based transforms (`translate(100%, 0)`) combined with `calc()` or distinct mobile keyframes provides the necessary flexibility.
- **Alternatives considered**: JavaScript-based calculation of bounding boxes via `getBoundingClientRect()` (rejected as it requires `use client` and impacts performance on load).

## 3. Pricing Section Alignment
- **Decision**: Update the `.card` classes in the pricing section to use flexbox (`flex flex-col justify-between` equivalent classes) to push the CTA button to the bottom. For the "Plus" package, use `ring-2 ring-primary shadow-lg`.
- **Rationale**: Flexbox is the standard, modern way to equalize heights and push elements to the edges within a container. Tailwind's `ring` utility is better than modifying `border` thickness because it doesn't cause layout shifting.
- **Alternatives considered**: CSS Grid layout for internal card contents (rejected, flex is simpler for this single-axis alignment).

## 4. FAQ Accordion Interaction
- **Decision**: Update the existing `components/ui/accordion.tsx` to handle the `+` to `x` rotation and color changes when active. The smooth height transition will be handled by a grid trick (`display: grid; grid-template-rows: 0fr;` to `1fr`) or max-height transition in CSS.
- **Rationale**: The component is already a Client Component (`'use client'`). We just need to refine its CSS and state representation to match the new spec.
- **Alternatives considered**: HTML `<details>` and `<summary>` elements (rejected because animating their open/close state smoothly is notoriously difficult across all browsers without complex JS workarounds).
