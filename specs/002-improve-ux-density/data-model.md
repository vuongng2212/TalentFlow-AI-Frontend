# Data Model & Contracts

## Entities

### RoleContext
- `role`: `'admin' | 'recruiter' | 'hiring_manager'`
- `tenantId`: `string`
- `tenantName`: `string`
- `permissions`: `string[]`

### FilterState
- `query`: `string`
- `status`: `string[]` (e.g., active, closed, pending)
- `roles`: `string[]`
- `dateRange`: `{ start: string, end: string } | null`
- `savedViewId`: `string | null`

### ListState
- `status`: `'idle' | 'loading' | 'success' | 'error' | 'empty'`
- `error`: `string | null`
- `data`: `any[]`
- `totalCount`: `number`

## Contracts

No external API contracts are newly defined for this UX improvement as this is purely a frontend refinement interacting with the existing services (`services/mockData.ts`, `services/schemas.ts`). The feature will strictly type the frontend components using the above interface representations.