# Data Model: Design System Color Tokens

Since this is a CSS-only design system refactor, there are no database entities or schemas affected. Instead, our "data model" represents the design token dictionary mapping.

## CSS Custom Properties Mapping

The following design system color token values are defined under the `:root` selector:

```css
:root {
  /* Brand colors */
  --primary: #4F46E5;       /* Indigo 600 */
  --primary-hover: #4338CA; /* Indigo 700 */
  --primary-soft: #EEF2FF;  /* Indigo 50 */
  --primary-glow: rgba(79, 70, 229, 0.15);

  /* AI specific colors */
  --ai-accent: #0D9488;      /* Teal 600 */
  --ai-accent-soft: #CCFBF1; /* Teal 100 */
  --shadow-ai: 0 0 16px rgba(13, 148, 136, 0.15); /* Teal glow */
}

.dark {
  /* Dark theme overrides */
  --primary-soft: #1E1B4B;  /* Indigo 900 */
  --primary-glow: rgba(79, 70, 229, 0.3);
  --ai-soft: #115E59;       /* Teal 800 */
  --ai-glow: rgba(13, 148, 136, 0.25);
}
```

## Tailwind `@theme` configuration map

These variables map to Tailwind theme colors inside `@theme` in `globals.css`:

```css
@theme {
  --color-primary: var(--primary);
  --color-primary-hover: var(--primary-hover);
  --color-primary-soft: var(--primary-soft);
  --color-ai-accent: var(--ai-accent);
  --color-ai-accent-soft: var(--ai-accent-soft);
}
```
