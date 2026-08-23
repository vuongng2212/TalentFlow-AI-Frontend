# Quickstart: UI/UX Improvements

This feature updates the landing page (`app/page.tsx`) and global styles (`app/globals.css`).

## Getting Started

1.  Run the development server: `pnpm dev`
2.  Open `http://localhost:3000` to view the landing page.

## Key Changes to Verify

*   **Kanban Mockup**: Scroll to the hero section mockup. Check that all AI badges have uniform sizing and columns have distinct backgrounds/borders.
*   **Animations**: Refresh the page and scroll down. Verify that sections fade in smoothly. Check the logos section to ensure it scrolls infinitely from left to right.
*   **Metrics**: Scroll to the system metrics section (50%, 85%, etc.) and ensure they stand out visually.
*   **Pricing**: Scroll to the pricing section. Verify the three plans are: Free, Plus, and Business, with the newly updated descriptions.

## Testing Accessibility

*   In your OS or browser DevTools, toggle **Emulate CSS prefers-reduced-motion**.
*   Verify that the infinite logo scroll stops and fade-in animations are disabled or instantly complete, respecting the user's preference.
