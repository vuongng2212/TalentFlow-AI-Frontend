# API Integration Check & Missing Endpoints Report

This document outlines the missing API endpoints and mismatches between the Backend API Gateway (and Notification service) and the Frontend service implementation.

---

## 1. Missing APIs by Group

### 🔴 Group A: Authentication & User Management (High Priority)
These endpoints are crucial for user registration, token management, and role administration.

*   **Registration API (`POST /auth/signup`)**
    *   **Backend Path**: `POST http://localhost:8080/api/v1/auth/signup`
    *   **Request Body**: `SignupDto` (`email`, `password`, `fullName`, `role` enum)
    *   **Frontend Service**: Missing in `auth.service.ts`.
*   **Token Refresh API (`POST /auth/refresh`)**
    *   **Backend Path**: `POST http://localhost:8080/api/v1/auth/refresh`
    *   **Request Details**: Requires `JwtRefreshGuard` (reads refresh token from HTTP-only cookie). Returns new access/refresh tokens.
    *   **Frontend Service**: Missing in `auth.service.ts` and not configured in `api-client.ts` interceptors.
*   **Role Update API (`PATCH /users/:id/role`)**
    *   **Backend Path**: `PATCH http://localhost:8080/api/v1/users/:id/role`
    *   **Request Body**: `UpdateRoleDto` (`role` enum)
    *   **Frontend Service**: Missing in `user.service.ts`.

---

### 🟡 Group B: Applications & CV Processing (Medium Priority)
This endpoint handles CV file uploads using multipart forms.

*   **CV Upload Application API (`POST /applications/upload`)**
    *   **Backend Path**: `POST http://localhost:8080/api/v1/applications/upload`
    *   **Request Type**: `multipart/form-data`
    *   **Request Body**: `file` (CV file binary - PDF/DOC/DOCX, max 10MB), `jobId` (string/UUID), `coverLetter` (string, optional).
    *   **Frontend Service**: Missing in `application.service.ts`.

---

### 🟢 Group C: Email Templates Management (Low Priority)
Full CRUD for custom workspace email templates.

*   **Frontend Service Status**: File `services/api/email-templates.service.ts` does not exist.
*   **Required Endpoints**:
    *   `POST http://localhost:8080/api/v1/email-templates` (Create template)
    *   `GET http://localhost:8080/api/v1/email-templates` (List templates in active workspace)
    *   `GET http://localhost:8080/api/v1/email-templates/:id` (Get template details)
    *   `PATCH http://localhost:8080/api/v1/email-templates/:id` (Update template subject/body)
    *   `DELETE http://localhost:8080/api/v1/email-templates/:id` (Delete template)

---

### 🟢 Group D: Notifications & Real-Time Alerts (Low Priority)
Dispatches and handles notification triggers and WebSocket events.

*   **Frontend Service Status**: File `services/api/notification.service.ts` does not exist. WebSocket listeners are not implemented.
*   **Required HTTP Endpoints**:
    *   `POST http://localhost:8080/api/notifications/send` (Send template-based email/alerts)
    *   `GET http://localhost:8080/api/notifications/:id` (Get history of a notification)
*   **Required WebSocket Namespace**: `/notifications`
    *   **Incoming Events**: `joinUserRoom`, `leaveUserRoom`
    *   **Outgoing Broadcasts**: Emits real-time notification alerts.

---

## 2. Inconsistencies & Cleanup

*   **`POST /users` discrepancy**:
    *   The frontend service lists `createUser` pointing to `POST /users`. However, the backend does not expose `POST /users` (registration must go through `POST /auth/signup`).
    *   **Required Action**: Update `createUser` in `user.service.ts` or replace its calls with `authService.signup`.

---

## 3. AI Prompts for Integration

Copy and use this prompt in your AI assistant to generate and wire up these missing API integrations:

```text
Please integrate the missing API endpoints for our Next.js application based on our existing patterns (using `api` wrapper from `lib/api-client.ts`):

1. Update `/services/api/auth.service.ts` to add:
   - `signup(data: SignupDto)` -> POST /auth/signup
2. Update `/services/api/user.service.ts` to add:
   - `updateUserRole(id: string, role: string)` -> PATCH /users/${id}/role
   - Remove/replace the non-existent `createUser` (POST /users) with authService.signup call.
3. Update `/services/api/application.service.ts` to add:
   - `uploadApplicationCv(formData: FormData)` -> POST /applications/upload with "multipart/form-data" headers
4. Create a new service file `/services/api/email-templates.service.ts` for full CRUD mapping of `/email-templates` (GET, GET by ID, POST, PATCH, DELETE).
5. Create a new service file `/services/api/notification.service.ts` for notifications mapping:
   - `sendNotification(data: SendNotificationDto)` -> POST /api/notifications/send
   - `getNotification(id: string)` -> GET /api/notifications/${id}
6. If WebSockets are needed for real-time notifications, scaffold a simple hook `/hooks/useNotificationSocket.ts` connecting to `http://localhost:8081/notifications` namespace (or the appropriate notification service port), handling `joinUserRoom` on mount with JWT auth in headers/cookies.

Ensure all services match our axios response unwrapping pattern in `lib/api-client.ts`. Use types defined in `/types` or write typescript interfaces matching standard NestJS DTO inputs.
```
