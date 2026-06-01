# Interface Contracts: High-Fidelity ATS Template Porting

This document defines the mock interface contracts between components, routing, and data access layers.

## 1. Mock API Endpoints (Data Service Contracts)

Since there is no external database, all data logic is abstracted into a mock database module `/services/mockData.ts` exposing async standard operations mimicking remote REST APIs.

### Get All Candidates
- **Signature**: `getCandidates(filters?: CandidateFilters): Promise<Candidate[]>`
- **Filter Properties**:
  ```typescript
  export interface CandidateFilters {
    search?: string;
    stage?: string; // 'applied' | 'screening' | etc. or 'all'
    minScore?: number;
  }
  ```

### Get Single Candidate Details
- **Signature**: `getCandidateById(id: string): Promise<Candidate | null>`

### Update Candidate Stage (Drag-and-Drop Mutation)
- **Signature**: `updateCandidateStage(id: string, stage: string): Promise<Candidate>`
- **Validation**: Throws an error if `stage` is not one of the allowed union states.

### Get Jobs List
- **Signature**: `getJobs(search?: string, status?: string): Promise<Job[]>`

### Get Invoices (Billing history)
- **Signature**: `getInvoices(): Promise<Invoice[]>`

---

## 2. Shared Workspace Context (Role Coordination Contract)

A React Context `RoleContext` is used to share user privilege states between layout navigation menus and pages.

```typescript
export interface RoleContextProps {
  role: 'Recruiter' | 'Admin';
  setRole: (role: 'Recruiter' | 'Admin') => void;
  isMounted: boolean; // Protects client-side state from hydration flashes
}
```

- **Hooks Usage**: Components call `useWorkspaceRole()` custom hook to retrieve the current context.
- **Accessibility Constraints**: When options are hidden based on roles, components are unmounted or set to `aria-hidden="true"` to prevent assistive tools from focusing them.

---

## 3. UI Component Contracts

### Reusable Tabs Component
- **Props**:
  ```typescript
  interface TabsProps {
    tabs: { id: string; label: string }[];
    activeTab: string;
    onChange: (id: string) => void;
  }
  ```

### Reusable FAQ Accordion Component
- **Props**:
  ```typescript
  interface AccordionProps {
    items: { question: string; answer: string }[];
  }
  ```
- **Interactivity**: Clicking the header toggles the open state smoothly with transition timings.
