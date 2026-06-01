# Research & Best Practices for High-Fidelity ATS Template Porting

This document outlines the technical research, decision rationale, and alternatives evaluated for porting the TalentFlow static high-fidelity recruiting template into Next.js 16 (App Router) & React 19.

## 1. Native HTML5 Drag and Drop in React 19 / Next.js 16

### Challenge
We need to support an interactive Kanban board spanning 6 stages (Applied, Screening, Interview, Offer, Hired, Rejected) with drag-and-drop operations that update applicant counts dynamically without complex client side libraries (e.g. `react-beautiful-dnd` which is defunct, or `@dnd-kit` which adds significant boilerplate).

### Rationale & Solution
- **Native HTML5 Drag and Drop** is lightweight, zero-dependency, and extremely fast. We can implement it using native React synthetic events: `onDragStart`, `onDragEnd`, `onDragOver`, `onDragLeave`, and `onDrop`.
- **Handling Hydration Mismatches**: Since candidates lists are loaded dynamically and may have different states, standard HTML5 attributes should not cause server-client hydration mismatches as long as the initial rendered state matches what is generated on the server (using our mock DB as a single source of truth).
- **Interactive State**: We track candidate positions inside a React `useState` array and update the candidate's `stage` property directly when `onDrop` triggers.

### Alternatives Considered
- **@dnd-kit**: Powerful but introduces additional layout structures and complex providers.
- **react-beautiful-dnd**: Incompatible with React 19 and does not support strict Mode out-of-the-box anymore.
- **Decision**: Custom native HTML5 drag-and-drop implementation provides the most lightweight, robust, and highly performing solution meeting **SC-002** (Kanban drag action < 50ms).

---

## 2. Role Management & Hydration Flash Prevention

### Challenge
The layout and sidebar navigation must change dynamically when the user toggles between the `Recruiter` and `Admin` roles. We need to persist this setting to LocalStorage (`tf-role`) but prevent visual flashes/hydration errors (where the server renders one view and the client shows another).

### Rationale & Solution
- **RoleContext & Provider**: We will implement a `RoleProvider` component that reads the role setting from local storage and keeps it in state.
- **Preventing Hydration Mismatches**:
  - To avoid hydration mismatches, we default to the server-side fallback (`Recruiter`) during server rendering.
  - In our client component layout, we use a `useEffect` hook to read from LocalStorage *after* hydration and update the state.
  - Elements marked `data-role-only` are dynamically shown or hidden via CSS variables or standard conditional checks *after* the client-side mount is confirmed (`isMounted` flag pattern).
- **Authorization Enforcement**: If a user attempts to view `/admin/users` (an Admin-only route) while in the `Recruiter` role, they are shown a dedicated "Access Denied" error message component instead of a blank page.

### Alternatives Considered
- **Cookie-based sessions**: Cookies could be read on the server to prevent hydration flashes entirely. However, since we are building a purely static mock-driven workspace frontend (without server middleware), client-side state synchronized to LocalStorage is simpler and perfectly mirrors the static template's design logic.

---

## 3. Tailwind CSS v4 Theme Porting

### Challenge
Tailwind CSS 4 replaces the javascript-based `tailwind.config.js` configuration with CSS-first custom properties and theme definitions in the `@theme` directive in `globals.css`.

### Rationale & Solution
We will import the static variables from the template directly into the `@theme` block inside [app/globals.css](app/globals.css):
```css
@import "tailwindcss";

@theme {
  --color-brand-purple: #7C3AED;
  --color-brand-purple-hover: #6D28D9;
  --color-brand-purple-soft: #EDE9FE;
  
  --color-brand-green: #10B981;
  --color-brand-green-soft: #D1FAE5;
  
  --color-surface: #FFFFFF;
  --color-surface-2: #F4F4F5;
  --color-border: #E4E4E7;
  --color-border-hover: #D1D5DB;
  
  --font-jakarta: "Plus Jakarta Sans", var(--font-geist-sans), sans-serif;
  
  --shadow-card: 0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.05);
  --shadow-hover: 0 4px 12px rgba(0,0,0,0.10);
  --shadow-ai: 0 0 16px rgba(124,58,237,0.20);
}
```
This enables native Tailwind utilities like `bg-brand-purple`, `shadow-card`, and `font-jakarta` while keeping theme definitions close to CSS custom properties.

---

## 4. Lightweight Client-Side Form Validations in React 19

### Challenge
We need structured feedback and constraints checking for forms (Login, Signup, Workspace Settings) ensuring immediate validation errors, visible helper text, and error boundaries matching visual parity.

### Rationale & Solution
- In React 19, we can leverage HTML5 validation combined with basic client-side check on fields (email formats, password lengths).
- For strict code parity, Zod schema declarations are defined in `/types/index.ts` to represent form models. We can run standard checks on submit.
- Fields will dynamically add/remove `error` border classes and display message arrays directly under the inputs.
