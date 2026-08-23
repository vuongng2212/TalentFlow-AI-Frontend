# CSS UI Design Contracts

Since this is a frontend-only styling change, the contract is a UI/UX contract defining how visual components must consume the updated CSS variables.

## 1. Class-based Styling Contracts

### Primary Brand Elements
All standard elements utilizing the `--primary` family should automatically adapt:
- Buttons (`.btn.primary`)
- Text inputs focus rings (`.input:focus`, `.select:focus`, etc.)
- Active Navigation links (`.nav-link.active`)
- Active Tabs (`.tab.active`)

### AI Feature Elements
Any element representing AI capabilities or insights must use the teal accent colors:
- **`.ai-chip`**: Must have gradient transition from teal-600 to teal-700.
  ```css
  .ai-chip {
    background: linear-gradient(135deg, var(--ai-accent), #0F766E); /* Teal 600 -> Teal 700 */
    color: white;
    font-size: 11px;
    letter-spacing: .04em;
  }
  ```
- **`.score::after`** (AI badge above score circles):
  ```css
  .score::after {
    background: linear-gradient(135deg, var(--ai-accent), #0F766E);
    box-shadow: var(--shadow-ai);
  }
  ```

### Non-AI Container Shadow Profile (`.mockup`)
Containers showcasing standard dashboard/layout mockups must not use purple glowing shadows.
- **`.mockup`**:
  ```css
  .mockup {
    border-radius: 20px;
    border: 1px solid var(--border);
    background: var(--surface);
    box-shadow: 0 4px 24px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06);
    padding: 16px;
  }
  ```
