# Research: Enterprise Color System Refactor

## 1. Technical Decisions & Color Mappings

We need to update the color system in `app/globals.css` to build enterprise trust. Below is the mapping from the old (purple-centric) system to the new (indigo & teal-centric) system:

### Brand Theme Variables

| Variable | Old Value | New Value | Rationale |
|---|---|---|---|
| `--primary` | `#7C3AED` | `#4F46E5` | Change brand primary to professional Indigo-600. |
| `--primary-hover` | `#6D28D9` | `#4338CA` | Change primary hover to Indigo-700. |
| `--primary-soft` | `#EDE9FE` | `#EEF2FF` | Change primary soft background to Indigo-50 |
| `--primary-glow` | `rgba(124,58,237,0.15)` | `rgba(79,70,229,0.15)` | Sync with new primary Indigo color. |

*(In `.dark` selector, we must also update the dark-mode overrides of these variables).*

### AI-specific Theme Variables

We separate AI branding from main branding by creating dedicated AI accent variables:

| Variable | Value | Rationale |
|---|---|---|
| `--ai-accent` | `#0D9488` | Teal-600 for high-contrast, high-trust AI features. |
| `--ai-accent-soft` | `#CCFBF1` | Teal-100 for soft AI backgrounds. |

### Shadow Adjustments

- **`--shadow-ai`**: Currently a purple glow (`0 0 16px rgba(124,58,237,0.20)`). We will change it to a neutral xám/gray/neutral glow (`0 0 16px rgba(0,0,0,0.05)`) or disable it (`none`) for generic non-AI components, but since the variable is called `--shadow-ai`, we should probably adjust it to utilize `--ai-accent` if it's strictly for AI, OR set it to a neutral drop shadow for general usage.
  - *Decision*: We will keep `--shadow-ai` to target AI features, using teal accent: `0 0 16px rgba(13,148,136,0.15)`.
  - For generic items previously using `--shadow-ai` that are NOT AI features, we remove or replace with neutral shadows.
- **`.mockup` shadow**: Currently `box-shadow: var(--shadow-hover), 0 0 60px rgba(124,58,237,.16)`. We replace this with a subtle, elegant shadow: `box-shadow: 0 4px 24px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)`.

### Typography Adjustments

- **`body` line-height**: Update from `1.45` to `1.6` globally to enhance readability.

---

## 2. Alternatives Considered

### Alternative A: Tailwind-only Class Replacements
Instead of modifying `globals.css` CSS variables, we could search and replace Tailwind classes (e.g., `bg-purple-600` to `bg-indigo-600`) across all component files.
- **Why Rejected**: Higher risk of regression, harder to maintain, and does not align with the centralized design token architecture defined in `globals.css`.

### Alternative B: Keeping `--shadow-ai` as Purple Glow
- **Why Rejected**: The prompt explicitly asks to: *"Xóa hiệu ứng bóng đổ phát sáng tím `--shadow-ai` khỏi các phần không phải AI (thiết lập về `none` hoặc dùng bóng đổ xám nhạt trung tính)."* Keeping it purple violates the spec requirements for brand overhaul.
