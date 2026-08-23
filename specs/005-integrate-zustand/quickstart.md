# Quickstart Guide: Zustand State Management

A brief setup guide for working with the Zustand stores in this application.

## 1. Installation
The `zustand` package will be installed using pnpm:
```bash
pnpm add zustand
```

## 2. Using the Stores in Components

### UI Preferences (`useUIStore`)
Ensure fine-grained selection is used to read state:
```typescript
import { useUIStore } from '@/lib/store/useUIStore';

export default function ThemeToggle() {
  const theme = useUIStore(state => state.theme);
  const toggleTheme = useUIStore(state => state.toggleTheme);

  return (
    <button onClick={toggleTheme} className="btn secondary">
      Current Theme: {theme}
    </button>
  );
}
```

### Global Modals (`useModalStore`)
Trigger any modal from anywhere in the application:
```typescript
import { useModalStore } from '@/lib/store/useModalStore';

export default function ActionButton() {
  const openModal = useModalStore(state => state.openModal);

  return (
    <button onClick={() => openModal('upload-cv')} className="btn primary">
      Upload CV
    </button>
  );
}
```

Render global modal overlays in your routing layouts or pages:
```typescript
import { useModalStore } from '@/lib/store/useModalStore';
import UploadCvModal from '@/components/features/candidates/UploadCvModal';

export default function WorkspaceLayout({ children }) {
  const activeModal = useModalStore(state => state.activeModal);
  const closeModal = useModalStore(state => state.closeModal);

  return (
    <div>
      {children}
      <UploadCvModal 
        isOpen={activeModal === 'upload-cv'} 
        onClose={closeModal} 
      />
    </div>
  );
}
```

### Candidates Filtering & Selection (`useApplicationsStore`)
Access filter conditions and pagination values without local page hooks:
```typescript
import { useApplicationsStore } from '@/lib/store/useApplicationsStore';

export default function FilterInput() {
  const search = useApplicationsStore(state => state.filters.search);
  const setFilters = useApplicationsStore(state => state.setFilters);

  return (
    <input 
      value={search} 
      onChange={(e) => setFilters({ search: e.target.value })} 
      className="input" 
    />
  );
}
```

## 3. Running Validation & Verification

Confirm TypeScript checks pass:
```bash
pnpm lint
```

Confirm production builds succeed:
```bash
pnpm build
```

Confirm E2E tests remain functional:
```bash
pnpm test:e2e
```
