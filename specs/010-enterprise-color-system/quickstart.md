# Quickstart Guide: Enterprise Theme Customization

This guide describes how to run and verify the new Enterprise Color System theme updates.

## 1. Run Dev Server

Start the development server to preview color system updates in real time:

```bash
pnpm dev
```

The application will be accessible at [http://localhost:3000](http://localhost:3000).

## 2. Validation Checklist

Ensure the following criteria are met:

### Primary Branding
- [ ] Open the landing page and verify the main buttons use Indigo (`#4F46E5` / hover `#4338CA`) instead of Purple (`#7C3AED` / hover `#6D28D9`).
- [ ] Verify focus outlines on input controls leverage the Indigo glow instead of Purple.
- [ ] Check active navigation options inside layouts.

### AI Features
- [ ] Check that AI recommendation elements or chips (`.ai-chip`) use a teal gradient instead of a purple gradient.
- [ ] Verify the AI tag above score indicators uses a teal gradient and has a teal shadow glow.

### Shadows & Layouts
- [ ] Inspect the mockups/cards (`.mockup`). Verify the shadow is elegant and neutral (`box-shadow: 0 4px 24px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)`).
- [ ] Verify there are no random purple glows or glows surrounding generic panels.

### Typography
- [ ] Verify that body paragraph elements and normal pages display with a `line-height: 1.6` for optimal readability.
