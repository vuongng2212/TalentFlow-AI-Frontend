# Quickstart: Landing Page Kanban Animation

**Feature Branch**: `feat/new-vers`
**Spec**: `specs/007-landing-page-kanban/spec.md`

## Overview

This feature enhances the Landing Page with an animated Kanban mockup in the hero section, aligns the pricing cards for better readability, and adds interactive FAQ accordions.

## Getting Started

1. Start the Next.js development server:
   ```bash
   pnpm dev
   ```

2. Open your browser and navigate to `http://localhost:3000`.

3. **Verify Kanban Animation**:
   - Look at the Hero section mockup.
   - You should see the "Sarah Connor" card automatically move from the "Screening" column to "Interview", then to "Offer", ending with a "Success Overlay".

4. **Verify Pricing Section**:
   - Scroll down to the Pricing section.
   - Verify that all CTA buttons are perfectly aligned at the bottom of the cards.
   - Verify the "Plus" package is distinctly highlighted.

5. **Verify FAQ Section**:
   - Scroll down to the FAQ section.
   - Click on different questions.
   - Ensure they open/close smoothly, the icon rotates (`+` to `x`), and active items change color to the primary theme color.

## Key Files Modified

- `app/page.tsx` - The landing page structure
- `app/globals.css` - Custom scoped CSS animations (`@theme` keyframes)
- `components/ui/accordion.tsx` - FAQ interactive component logic and styling
