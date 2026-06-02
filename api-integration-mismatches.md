# TalentFlow API Integration Mismatch Report

This document outlines all current mismatches between the TalentFlow AI Backend (API Gateway) and the TalentFlow AI Frontend implementation. 

The issues are sorted by priority to help guide the integration process incrementally.

---

## 🔴 HIGH PRIORITY: Architecture & Core Models

These issues block fundamental communication between FE and BE and require structural changes.

### 1. Missing API Client & Response Wrapper
*   **Backend:** Returns a standardized response wrapper for all endpoints:
    ```json
    {
      "status": 200,
      "message": "Success",
      "data": { ... }, 
      "timestamp": "..."
    }
    ```
    For lists, `data` contains `{ "data": [...], "meta": { "total", "page", "limit", "totalPages" } }`.
*   **Frontend:** Uses internal Next.js mock routes (`app/api/*`) and expects flat arrays directly from `services/mockData.ts`.
*   **Action Required:**
    *   Create a centralized API client utility (`lib/api-client.ts`) configured with `NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1`.
    *   Implement interceptors to automatically unwrap the `data` payload and handle global errors based on `status`.
    *   Refactor Server Components/Actions to call BE directly instead of internal Next.js routes.

### 2. Candidate vs. Application Entity Merger
*   **Backend:** Strictly separates `Candidate` (Personal info: name, email, resume) and `Application` (The relationship between a Candidate and a Job: stage, status, appliedAt).
*   **Frontend:** The `Candidate` interface (`types/index.ts`) merges both concepts. It holds personal info but also has `stage`, `score`, and `appliedDate`.
*   **Action Required:**
    *   Separate the types in FE to match BE: `Candidate` and `Application`.
    *   **Crucial:** The Kanban/Pipeline board currently fetches "Candidates" to move them across stages. This needs to be refactored to fetch and update "Applications" instead (`GET /applications` and `PUT /applications/:id`).

### 3. Authentication & User Context
*   **Backend:** Implements secure auth via `/auth/login` (returns session) and `/auth/me` (returns user profile + role).
*   **Frontend:** Uses a mocked `RoleContext` where the user just selects a role via `setRole` without actual authentication.
*   **Action Required:**
    *   Implement a real login page/modal mapping to `POST /auth/login`.
    *   Store user state via Context API / Zustand using `GET /auth/me`.
    *   Configure the API client to include credentials (cookies) in every request.

### 4. Job Entity Field Mismatches
*   **Backend (`GET /jobs`):** Uses `employmentType`, `requirements` (array), `salaryMin`, `salaryMax`, `status`, `createdBy` (object), and `_count.applications`.
*   **Frontend (`Job` type):** Uses `type`, `salaryRange` (string), `owner` (string), `applicantsCount`, `filledPipelines`.
*   **Action Required:**
    *   Update the `Job` type in `types/index.ts`.
    *   Map BE fields to FE UI components (e.g., format `salaryMin` and `salaryMax` into a display string for `salaryRange`).
    *   Extract `owner` from `createdBy.fullName` and `applicantsCount` from `_count.applications`.

---

## 🟡 MEDIUM PRIORITY: Features & Formatting

These issues affect specific features like filtering, pagination, and dashboard metrics.

### 5. Pagination & Metadata Handling
*   **Backend:** List endpoints (`/jobs`, `/candidates`, `/applications`, `/users`) are paginated and return a `meta` object.
*   **Frontend:** `mockData.ts` returns all items at once. FE list components likely don't support pagination controls yet.
*   **Action Required:**
    *   Update FE table/list components to accept and display pagination controls (Next, Previous, Page Numbers).
    *   Update the API query logic to pass `?page=1&limit=10`.

### 6. Dashboard Analytics Data Mapping
*   **Backend:** Exposes specific widget endpoints:
    *   `/analytics/overview` (Totals, rates)
    *   `/analytics/pipeline` (Funnel breakdown)
    *   `/analytics/trends` (Historical chart data)
    *   `/analytics/top-jobs`
*   **Frontend:** `getDashboardStats()` manually calculates fake stats by counting arrays (`totalCandidates`, `activeJobs`, `interviewsThisWeek`, etc.).
*   **Action Required:**
    *   Replace `getDashboardStats()` with calls to the individual `/analytics/*` endpoints.
    *   Adjust the Dashboard UI widgets to consume the new response structures.

### 7. Interview Management
*   **Backend:** Has a dedicated module for Interviews with full CRUD (`/interviews`).
*   **Frontend:** Interviews are currently just text entries inside a Candidate's mock `timeline`.
*   **Action Required:**
    *   Implement types and UI components to display Interviews as first-class entities.
    *   Link Interviews to Applications as defined by the BE schema.

---

## 🟢 LOW PRIORITY: Deprecations & Unused Modules

These issues involve cleanup or features not yet prioritized in the current sprint.

### 8. Deprecated Mock Entities (Invoices)
*   **Frontend:** Has an `Invoice` type and `getInvoices` function in `mockData.ts`.
*   **Backend:** Does not have an invoice module (this ATS seems focused on hiring, not billing).
*   **Action Required:**
    *   Remove `Invoice` type and related mock data/components if they are just leftover boilerplate templates.

### 9. Workspaces Feature
*   **Backend:** Has a `/workspaces` endpoint module.
*   **Frontend:** Does not currently have UI mapping for workspaces or multi-tenant switching.
*   **Action Required:**
    *   Keep this in mind for future roadmap items when multi-tenancy is required.

---

## 🚀 Recommended Next Steps

To begin resolving these issues without breaking the app entirely:

1. **Step 1:** Create `lib/api-client.ts` to establish the connection pattern to `http://localhost:8080/api/v1`.
2. **Step 2:** Refactor `types/index.ts` to match backend models (updating `Job`, splitting `Candidate` and `Application`).
3. **Step 3:** Convert one non-critical page (e.g., Jobs List) to use the real API Client and new types to test the flow.
4. **Step 4:** Tackle the Kanban board by swapping from Mock Candidates to Real Applications.
5. **Step 5:** Wire up Authentication.