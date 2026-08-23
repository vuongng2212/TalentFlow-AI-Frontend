# Data Model: High-Fidelity ATS Template Porting

This document outlines the core domain entities, fields, relationships, and validation criteria implemented for the TalentFlow applicant tracking system.

## 1. WorkspaceRole (Context State)
Represents the current role context of the workspace administrator or hiring manager.
- **Type**: Union
- **Values**: `'Recruiter'` | `'Admin'`
- **Validation**: Fallbacks to `'Recruiter'` if value is invalid or null.

---

## 2. Candidate
Represents an applicant applying for a job in the ATS.

| Field Name | Type | Validation Rules / Notes |
|------------|------|--------------------------|
| `id` | `string` | Unique candidate identifier |
| `name` | `string` | Minimum length 2 characters |
| `title` | `string` | Professional headline / job title |
| `avatar` | `string` | URL or initials abbreviation |
| `stage` | `string` | Union: `'applied'` \| `'screening'` \| `'interview'` \| `'offer'` \| `'hired'` \| `'rejected'` |
| `score` | `number` | Bound: `0 <= score <= 100` (represents match rating) |
| `scoreCategory` | `string` | Calculated: `'high'` (score >= 80) \| `'mid'` (score >= 50) \| `'low'` (score < 50) |
| `skills` | `string[]` | Array of skill tags (e.g. `'React'`, `'Next.js'`) |
| `appliedDate` | `string` | ISO Date String format |
| `email` | `string` | Valid email check |
| `phone` | `string` | Optional contact phone |
| `summary` | `string` | Professional experience summary |
| `timeline` | `ActivityEvent[]` | Log of recruiting events / notes |
| `scorecard` | `EvaluationCriteria[]` | Grid of structured skill evaluations |

### ActivityEvent
Represents an item in the chronological activity timeline for a candidate.
- `id`: `string`
- `date`: `string` (formatted date)
- `user`: `string` (who performed the action)
- `action`: `string` (e.g. "Moved candidate to Interview", "Added feedback score")
- `notes`: `string` (optional commentary)

### EvaluationCriteria
Represents an individual score element within the candidate's dossier sheet.
- `criteria`: `string` (e.g. "Technical Competence", "Culture Fit", "Domain Knowledge")
- `score`: `number` (1 to 5 stars or 0 to 100 slider value)
- `notes`: `string` (optional description)

---

## 3. Job
Represents a job opening advertised inside the workspace directory.

| Field Name | Type | Validation Rules / Notes |
|------------|------|--------------------------|
| `id` | `string` | Unique job identifier |
| `title` | `string` | Title of the position |
| `department` | `string` | Department classification (e.g. `'Engineering'`, `'Product'`) |
| `location` | `string` | Location details (e.g. `'San Francisco, CA'`, `'Remote'`) |
| `type` | `string` | Job classification (e.g. `'Full-time'`, `'Contract'`) |
| `status` | `string` | Union: `'open'` \| `'draft'` \| `'closed'` |
| `applicantsCount` | `number` | Count of total candidates assigned |
| `filledPipelines` | `number` | Steps finished in the hiring configuration (max 5) |
| `createdAt` | `string` | Creation date |

---

## 4. Invoice
Represents billing records and subscriptions in the system.

| Field Name | Type | Validation Rules / Notes |
|------------|------|--------------------------|
| `id` | `string` | Invoice reference code (e.g. `INV-2026-001`) |
| `date` | `string` | Date of billing |
| `amount` | `string` | USD transaction amount |
| `status` | `string` | Union: `'paid'` \| `'pending'` |
