# TalentFlow AI Frontend — API Integration Planning

> **Sprint Goal**: Kết nối frontend Next.js với backend API Gateway NestJS, chuyển từ mock data sang API thật.
>
> **Estimate tổng**: ~29h | **20 cards active** + **3 cards blocked**

---

## Phân tích hiện trạng

### Backend API Gateway — Endpoints có sẵn

| Module           | Endpoint               | Method | Auth            | Mô tả                         |
| ---------------- | ---------------------- | ------ | --------------- | ----------------------------- |
| **Auth**         | `/auth/signup`         | POST   | Public          | Đăng ký                       |
|                  | `/auth/login`          | POST   | Public          | Đăng nhập, set cookies        |
|                  | `/auth/refresh`        | POST   | Refresh Guard   | Refresh token                 |
|                  | `/auth/me`             | GET    | JWT Guard       | Lấy profile                   |
|                  | `/auth/logout`         | POST   | JWT Guard       | Đăng xuất, clear cookies      |
| **Jobs**         | `/jobs`                | GET    | Public          | Danh sách + pagination/filter |
|                  | `/jobs/:id`            | GET    | Public          | Chi tiết job                  |
|                  | `/jobs`                | POST   | RECRUITER/ADMIN | Tạo job                       |
|                  | `/jobs/:id`            | PUT    | RECRUITER/ADMIN | Cập nhật job                  |
|                  | `/jobs/:id`            | DELETE | RECRUITER/ADMIN | Xóa job (soft)                |
| **Applications** | `/applications`        | GET    | JWT Guard       | Danh sách ứng tuyển           |
|                  | `/applications/:id`    | GET    | JWT Guard       | Chi tiết                      |
|                  | `/applications`        | POST   | JWT Guard       | Ứng tuyển                     |
|                  | `/applications/upload` | POST   | JWT Guard       | Ứng tuyển + upload CV         |
|                  | `/applications/:id`    | PUT    | JWT Guard       | Cập nhật (stage/status)       |
|                  | `/applications/:id`    | DELETE | JWT Guard       | Rút ứng tuyển                 |

### Vấn đề cần giải quyết

1. **Response Format**: Backend `TransformInterceptor` bọc tất cả response → `{ status, message, data, timestamp }`. Frontend cần align.
2. **Pagination**: Backend dùng `meta` key → Frontend đang dùng `pagination` key.
3. **Auth**: Backend set **HttpOnly cookies** → Frontend đang dùng **localStorage**. Cần chuyển sang `credentials: 'include'`.
4. **Domain Types**: Frontend types khác Prisma models (`salaryRange` vs `salaryMin/salaryMax`, flat vs nested Application).

---

## Labels

| Label          | Màu       | Mô tả                          |
| -------------- | --------- | ------------------------------ |
| `auth`         | 🔴 Red    | Authentication & Authorization |
| `jobs`         | 🔵 Blue   | Jobs module                    |
| `applications` | 🟢 Green  | Applications module            |
| `infra`        | 🟡 Yellow | Infrastructure / shared code   |
| `dashboard`    | 🟣 Purple | Dashboard & UI pages           |

---

## Phase 1: Auth Foundation (~9.5h)

### Card 1: `[infra]` Align API response types với backend TransformInterceptor

**Priority**: 🔥 Critical — blocks everything
**Estimate**: 1h
**Files**: `src/lib/api/types.ts`

- [ ] Thêm `status` field vào `ApiResponse<T>` → `{ status, message, data, timestamp }`
- [ ] Đổi `PaginatedResponse<T>` dùng `meta` key thay vì `pagination`
- [ ] Xóa `hasNext` / `hasPrev` (backend không trả)
- [ ] Cập nhật `ApiErrorResponse` match backend error format
- [ ] Cập nhật auth types: `LoginResponseData`, `SignupResponseData`, `AuthUser`
- [ ] Cập nhật barrel export `src/lib/api/index.ts`

### Card 2: `[infra]` Align domain types với Prisma models

**Priority**: 🔥 Critical — blocks everything
**Estimate**: 1h
**Files**: `src/types/index.ts`

- [ ] `Job`: `salaryRange` → `salaryMin/salaryMax`, thêm `employmentType`, `department`, `createdById`
- [ ] `Job`: `requirements` → `Record<string, unknown> | null` (JSON)
- [ ] `Job`: xóa `createdBy: User` và `applicationCount` (backend không trả)
- [ ] `Application`: align với `ApplicationResponseDto` — flat structure, không nested
- [ ] `ApplicationStatus`: đổi sang 9 giá trị backend (`SUBMITTED`, `REVIEWING`, `SHORTLISTED`, ...)
- [ ] `JobStatus`: thêm `ARCHIVED`
- [ ] Thêm `EmploymentType` enum
- [ ] `Candidate`: thêm `linkedinUrl`, `resumeText`, xóa `appliedPosition`, `appliedDate`, `stage`, `aiScore`
- [ ] Tất cả `Date` → `string` (ISO format từ API)

### Card 3: `[auth]` Rewrite API client — cookie-based auth

**Priority**: 🔥 Critical
**Estimate**: 2h
**Files**: `src/lib/api/client.ts`

- [ ] Xóa toàn bộ localStorage token management (`getAccessToken`, `setTokens`, `clearTokens`, etc.)
- [ ] Thêm `credentials: 'include'` vào mọi fetch request
- [ ] Xóa `Authorization: Bearer` header logic
- [ ] Sửa `attemptTokenRefresh()`: gọi POST `/auth/refresh` với `credentials: 'include'` (không gửi body)
- [ ] Xóa export `tokenManager`
- [ ] Thêm method `api.upload()` cho multipart/form-data (không set `Content-Type`)
- [ ] Test: verify cookies tự đính kèm qua Next.js proxy

### Card 4: `[auth]` Rewrite auth store — real API calls

**Priority**: 🔥 Critical
**Estimate**: 2h
**Files**: `src/store/auth-store.ts`

- [ ] `login(email, password)` → `api.post('/auth/login', { email, password })` → set user từ response
- [ ] `signup(data)` → `api.post('/auth/signup', data)` → set user
- [ ] `logout()` → `api.post('/auth/logout')` → clear state
- [ ] Thêm `checkAuth()` → `api.get('/auth/me')` → restore session khi app mount
- [ ] Thêm `error` state cho error handling
- [ ] Xóa import `getMockUser`, `sleep` từ mock-data
- [ ] Persist chỉ `user` + `isAuthenticated` vào Zustand persist (giữ nguyên)

### Card 5: `[auth]` Thêm AuthProvider — auto check session

**Priority**: 🟡 High
**Estimate**: 1h
**Files**: `src/components/providers/auth-provider.tsx` (NEW), `app/layout.tsx`

- [ ] Tạo `AuthProvider` component gọi `checkAuth()` khi mount
- [ ] Show loading state trong khi checking
- [ ] Wrap app trong `AuthProvider`
- [ ] Handle case: cookie hết hạn → user = null

### Card 6: `[auth]` Update Login page — real auth flow

**Priority**: 🟡 High
**Estimate**: 1h
**Files**: `app/(auth)/login/page.tsx`

- [ ] Gọi `login()` từ updated auth store
- [ ] Hiển thị backend error message thay vì hardcoded string
- [ ] Xóa demo credentials hint (hoặc giữ cho dev mode)
- [ ] Handle loading/error states đúng cách
- [ ] Test: login → redirect → dashboard

### Card 7: `[auth]` Update Signup page — real auth flow

**Priority**: 🟡 High
**Estimate**: 1h
**Files**: `app/(auth)/signup/page.tsx`

- [ ] Gọi `signup()` từ updated auth store
- [ ] Hiển thị validation errors từ backend
- [ ] Form validation với Zod (role selection)
- [ ] Test: signup → redirect → dashboard

### Card 8: `[auth]` Route protection middleware

**Priority**: 🟡 High
**Estimate**: 1.5h
**Files**: `middleware.ts` (NEW hoặc update), `app/dashboard/layout.tsx`

- [ ] Redirect `/dashboard/*` về `/login` nếu chưa authenticated
- [ ] Redirect `/login`, `/signup` về `/dashboard` nếu đã authenticated
- [ ] Handle server-side check (Next.js middleware hoặc client-side guard)

---

## Phase 2: Jobs Integration (~7.5h)

### Card 9: `[jobs]` Service layer + SWR hooks cho Jobs

**Priority**: 🟡 High
**Estimate**: 2h
**Files**: `src/services/jobs.ts` (NEW)

- [ ] `useJobs(params?: JobListParams)` — paginated list hook
- [ ] `useJob(id: string)` — single job detail hook
- [ ] `useCreateJob()` — mutation hook (POST)
- [ ] `useUpdateJob(id: string)` — mutation hook (PUT)
- [ ] `useDeleteJob(id: string)` — mutation hook (DELETE)
- [ ] Export tất cả từ barrel `src/services/index.ts`

### Card 10: `[jobs]` Update Jobs list page

**Priority**: 🟡 High
**Estimate**: 2h
**Files**: `app/dashboard/jobs/page.tsx`, `src/components/jobs/*`

- [ ] Thay `mockJobs` bằng `useJobs()` hook
- [ ] Pagination UI kết nối với `meta` từ API
- [ ] Filter/search gửi query params đúng format backend
- [ ] Loading/error/empty states
- [ ] Adapt UI cho new `Job` type (salaryMin/salaryMax, employmentType)

### Card 11: `[jobs]` Update Job detail page

**Priority**: 🟡 Medium
**Estimate**: 1.5h
**Files**: `app/dashboard/jobs/[id]/page.tsx`, `src/components/job-detail/*`

- [ ] Thay mock data bằng `useJob(id)` hook
- [ ] Adapt UI cho new `Job` type
- [ ] Hiển thị `requirements` JSON đúng cách
- [ ] Edit/Delete actions gọi real API

### Card 12: `[jobs]` Job create/edit form

**Priority**: 🟡 Medium
**Estimate**: 2h
**Files**: `src/components/jobs/job-form.tsx` (NEW hoặc update)

- [ ] Form với react-hook-form + Zod validation
- [ ] Fields: title, description, department, location, employmentType, salaryMin, salaryMax, requirements, status
- [ ] Submit → `useCreateJob()` hoặc `useUpdateJob()`
- [ ] Success → redirect/toast, revalidate list

---

## Phase 3: Applications Integration (~6.5h)

### Card 13: `[applications]` Service layer + SWR hooks

**Priority**: 🟡 Medium
**Estimate**: 2h
**Files**: `src/services/applications.ts` (NEW)

- [ ] `useApplications(params?)` — paginated list
- [ ] `useApplication(id)` — detail
- [ ] `useCreateApplication()` — submit (POST)
- [ ] `useUploadCv()` — multipart upload, dùng `api.upload()`
- [ ] `useUpdateApplication(id)` — update stage/status
- [ ] `useDeleteApplication(id)` — withdraw

### Card 14: `[applications]` Update Applications/Candidates pages

**Priority**: 🟡 Medium
**Estimate**: 3h
**Files**: `app/dashboard/candidates/page.tsx`, `src/components/candidates/*`, `src/components/candidate-detail/*`

- [ ] Thay `mockCandidates` bằng `useApplications()` data
- [ ] Kanban view: group applications theo `stage`
- [ ] Drag-and-drop → `useUpdateApplication()` để đổi stage
- [ ] Candidate detail → application detail từ API
- [ ] Loading/error states

### Card 15: `[applications]` CV Upload integration

**Priority**: 🟡 Medium
**Estimate**: 1.5h
**Files**: `app/dashboard/upload/page.tsx`, `src/components/upload/*`

- [ ] File picker: validate MIME (PDF/DOCX), max 10MB client-side
- [ ] Build `FormData` with `file`, `jobId`, optional `coverLetter`
- [ ] Gọi `api.upload('/applications/upload', formData)`
- [ ] Progress indicator (nếu cần)
- [ ] Success/error toast

---

## Phase 4: Dashboard & Shared (~3.5h)

### Card 16: `[dashboard]` Dashboard page — real data

**Priority**: 🟡 Medium
**Estimate**: 2h
**Files**: `app/dashboard/page.tsx`

- [ ] Stats: dùng `useJobs()` + `useApplications()` để tính open jobs, total applications
- [ ] Recent Jobs list từ API (limit 5, sort by createdAt desc)
- [ ] Recent Applications/Candidates từ API
- [ ] Xóa tất cả `mockJobs`, `mockCandidates` imports
- [ ] Loading skeleton trong khi fetch

### Card 17: `[infra]` Update `use-fetch.ts` hooks cho new response format

**Priority**: 🟡 High
**Estimate**: 1h
**Files**: `src/hooks/use-fetch.ts`

- [ ] `useFetch<T>`: trả `data` từ `response.data` (ApiResponse wrapper)
- [ ] `useFetchList<T>`: trả `data` từ `response.data.data`, `meta` từ `response.data.meta`
- [ ] `useMutation<T>`: handle response đúng format
- [ ] Computed fields: `isEmpty`, `hasNext`, `hasPrev` từ meta

### Card 18: `[infra]` Update error handling cho backend format

**Priority**: 🟡 Medium
**Estimate**: 0.5h
**Files**: `src/lib/api/errors.ts`

- [ ] `parseApiError()`: handle `{ status, message, error, timestamp }` format
- [ ] Map validation errors từ NestJS class-validator format
- [ ] Test edge cases: 400, 401, 403, 404, 409, 422, 500

---

## Phase 5: Cleanup (~2h)

### Card 19: `[infra]` Feature flag — mock/real API toggle

**Priority**: 🟢 Low
**Estimate**: 1h
**Files**: `src/services/*`, `.env.local`

- [ ] Service hooks check `featureFlags.enableMockApi`
- [ ] Mock mode: return mock data, Real mode: fetch API
- [ ] Set `NEXT_PUBLIC_ENABLE_MOCK_API=false` khi backend ready
- [ ] Xóa `src/lib/mock-data.ts` khi hoàn tất migration

### Card 20: `[infra]` Cleanup — xóa mock data dependencies

**Priority**: 🟢 Low
**Estimate**: 1h

- [ ] Grep tất cả imports từ `mock-data.ts`
- [ ] Thay thế bằng real service hooks
- [ ] Xóa `src/lib/mock-data.ts` (hoặc giữ cho dev/test)
- [ ] Xóa `sleep()` util nếu không còn dùng
- [ ] Verify build: `npm run build` pass

---

## Blocked — Chờ Backend

### Card 21: `[dashboard]` Analytics page — chờ backend

Backend chưa có `/analytics/*` endpoints. Giữ mock data hoặc disable tạm.

### Card 22: `[dashboard]` Interviews page — chờ backend

Backend chưa có `/interviews/*` endpoints. Giữ mock data hoặc disable tạm.

### Card 23: `[dashboard]` Candidates endpoint riêng — chờ backend

Backend không có `/candidates` endpoint riêng. Candidate data lấy từ `/applications` response. Cần discuss với backend team.

---

## Dependency Graph

```
Card 1 (API types) ──┐
                      ├──→ Card 3 (API client) ──→ Card 4 (Auth store) ──→ Card 5 (AuthProvider)
Card 2 (Domain types)┘                                    │
                                                           ├──→ Card 6 (Login page)
                                                           ├──→ Card 7 (Signup page)
                                                           └──→ Card 8 (Route protection)
                                                                       │
Card 17 (use-fetch) ──→ Card 9 (Jobs service) ──→ Card 10 (Jobs list)
Card 18 (Errors)   │                           ├──→ Card 11 (Job detail)
                   │                           └──→ Card 12 (Job form)
                   │
                   └──→ Card 13 (App service) ──→ Card 14 (App pages)
                                              ├──→ Card 15 (CV upload)
                                              └──→ Card 16 (Dashboard)
                                                           │
                                              Card 19 (Feature flag) ──→ Card 20 (Cleanup)
```

## Estimate tổng

| Phase                       | Cards        | Estimate |
| --------------------------- | ------------ | -------- |
| Phase 1: Auth Foundation    | 1–8          | ~9.5h    |
| Phase 2: Jobs               | 9–12         | ~7.5h    |
| Phase 3: Applications       | 13–15        | ~6.5h    |
| Phase 4: Dashboard & Shared | 16–18        | ~3.5h    |
| Phase 5: Cleanup            | 19–20        | ~2h      |
| **Tổng**                    | **20 cards** | **~29h** |
