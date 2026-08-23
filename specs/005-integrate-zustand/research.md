# Research: Zustand State Integration

This document addresses technical decisions and best practices for integrating Zustand into the TalentFlow AI Frontend (Next.js 16 App Router).

## 1. Preventing Hydration Mismatch

### Problem
Zustand's `persist` middleware reads layout and theme states directly from `localStorage` on page mount. However, during Server-Side Rendering (SSR), the server has no access to `localStorage` and renders default values (e.g., `theme: 'light'` and `sidebarExpanded: true`). When the client receives the HTML and hydrates the store, a hydration mismatch occurs if the stored preferences differ, leading to React hydration warnings or layout flickers.

### Solution
We evaluate three primary approaches:
1. **Approach A: Client-only rendering for state-dependent components**
   Wrap the components using the store in a custom `ClientOnly` wrapper or guard using a `mounted` state (`useState` + `useEffect`).
   - *Pros*: Extremely reliable; zero chance of mismatch.
   - *Cons*: Prevents SEO parsing of the wrapped DOM tree (not an issue for workspace layout).
2. **Approach B: Client-side effects application**
   Render standard layout classes on the server. In a `useEffect` hook inside a client provider, read the store and update classes/attributes on the document root (e.g., adding `.dark` class or `.sidebar-collapsed`).
   - *Pros*: Keeps full HTML parsing structure intact. Theme and layout are adjusted immediately on mount.
   - *Cons*: Potential minor layout shift (CLS) if dark/collapsed state is applied slightly after mount. We minimize this by rendering a shell layout that adapts instantly.
3. **Approach C: Safe CSS-based selectors**
   Rather than using JS conditionals (`{sidebarExpanded && <Text />}`), render both elements with CSS display selectors (e.g., `.sidebar-expanded-only` and `.sidebar-collapsed-only`). The visibility is toggled by the parent container class (`.sidebar-collapsed`).
   - *Pros*: Completely hydration safe. The exact same HTML is generated on both server and client.

### Decision
We will use a combination of **Approach B** (Client-side class updates on mount) and **Approach C** (CSS-driven visibility selectors).
- A custom client-side `<WorkspaceShell>` wrapper component will render the workspace shell layout. In `useEffect`, it checks the state of `useUIStore.getState()` and sets a local `mounted` state to `true` to safely toggle `.sidebar-collapsed` class on the shell container.
- We will avoid JS conditionals for layout toggling in `Sidebar.tsx` and instead use CSS rules: `.shell.sidebar-collapsed .sidebar-expanded-only { display: none; }` and `.shell:not(.sidebar-collapsed) .sidebar-collapsed-only { display: none; }`.

---

## 2. Selective Store Subscription

### Problem
Subscribing to the entire store (e.g., `const store = useApplicationsStore()`) triggers component re-renders whenever *any* state in that store changes, even if the component doesn't consume the changed values.

### Solution
Always use selective, fine-grained selectors when fetching state:
```typescript
const search = useApplicationsStore(state => state.filters.search);
const setFilters = useApplicationsStore(state => state.setFilters);
```
For complex selections, use Zustand's `useShallow` hook to prevent extra renders.

---

## 3. Storage Mechanism

- **Theme & Sidebar state**: Stored in `localStorage` using Zustand's `persist` middleware, since these are user visual preferences that must survive sessions.
- **Modals state**: Stored in transient in-memory state. Modals should close on refresh or navigation.
- **Applications page filters/pagination**: Stored in transient in-memory state. This ensures a recruiter preserves filter status during session-level navigations (e.g., clicking into a candidate profile and clicking "back" using the router), but resets on fresh visits.
