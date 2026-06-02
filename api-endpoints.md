# TalentFlow API Gateway Endpoints & Responses

This document outlines the available API endpoints in the TalentFlow API Gateway, including response samples based on tests using the `seed-admin@talentflow.invalid` account.

**Base URL**: `http://localhost:8080/api/v1`

---

## Authentication (`/auth`)

### POST `/auth/login`
Authenticates a user and returns their profile with session cookies.

**Request Body:**
```json
{
  "email": "seed-admin@talentflow.invalid",
  "password": "SeedPassword123!"
}
```

**Response (200 OK):**
```json
{
  "status": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "31c9e508-f241-41de-9c55-809905f7110b",
      "email": "seed-admin@talentflow.invalid",
      "fullName": "Seed System Admin Updated",
      "role": "ADMIN",
      "createdAt": "2026-06-01T15:01:39.257Z"
    }
  },
  "timestamp": "2026-06-02T10:10:13.377Z"
}
```

### GET `/auth/me`
Retrieves the currently authenticated user's profile.

**Response (200 OK):**
```json
{
  "status": 200,
  "message": "Success",
  "data": {
    "user": {
      "id": "31c9e508-f241-41de-9c55-809905f7110b",
      "email": "seed-admin@talentflow.invalid",
      "fullName": "Seed System Admin Updated",
      "role": "ADMIN"
    }
  },
  "timestamp": "2026-06-02T10:10:24.090Z"
}
```

---

## Users (`/users`)

### GET `/users`
Retrieves a paginated list of users.

**Response (200 OK):**
```json
{
  "status": 200,
  "message": "Success",
  "data": {
    "data": [
      {
        "id": "42adfa81-f49e-4632-bb08-7962f07f3676",
        "email": "seed-recruiter@talentflow.invalid",
        "fullName": "Seed Lead Recruiter",
        "role": "RECRUITER",
        "createdAt": "2026-06-01T15:01:39.257Z",
        "updatedAt": "2026-06-01T15:01:39.257Z",
        "deletedAt": null
      },
      {
        "id": "31c9e508-f241-41de-9c55-809905f7110b",
        "email": "seed-admin@talentflow.invalid",
        "fullName": "Seed System Admin Updated",
        "role": "ADMIN",
        "createdAt": "2026-06-01T15:01:39.257Z",
        "updatedAt": "2026-06-02T09:49:42.974Z",
        "deletedAt": null
      }
    ],
    "meta": {
      "total": 3,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  },
  "timestamp": "2026-06-02T10:10:31.260Z"
}
```

---

## Jobs (`/jobs`)

### GET `/jobs`
Retrieves a paginated list of jobs.

**Response (200 OK):**
```json
{
  "status": 200,
  "message": "Success",
  "data": {
    "data": [
      {
        "id": "72229da8-7909-4dc0-a93a-b3c6f4a1bc98",
        "title": "Senior Backend Engineer",
        "department": "Engineering",
        "location": "Ho Chi Minh City",
        "employmentType": "FULL_TIME",
        "description": "Build scalable backend services for ATS workflows and hiring automation.",
        "requirements": [
          "3+ years experience with Node.js or NestJS",
          "Strong SQL and data modeling skills",
          "Experience with message queues and distributed systems"
        ],
        "salaryMin": 2500,
        "salaryMax": 4000,
        "status": "OPEN",
        "createdById": "42adfa81-f49e-4632-bb08-7962f07f3676",
        "createdBy": {
          "id": "42adfa81-f49e-4632-bb08-7962f07f3676",
          "email": "seed-recruiter@talentflow.invalid",
          "fullName": "Seed Lead Recruiter"
        },
        "createdAt": "2026-06-01T15:01:39.284Z",
        "updatedAt": "2026-06-01T15:01:39.284Z",
        "deletedAt": null,
        "_count": {
          "applications": 2
        }
      }
    ],
    "meta": {
      "total": 3,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  },
  "timestamp": "2026-06-02T10:10:36.840Z"
}
```

---

## Applications (`/applications`)

### GET `/applications`
Retrieves a paginated list of job applications.

**Response (200 OK):**
```json
{
  "status": 200,
  "message": "Success",
  "data": {
    "data": [
      {
        "id": "5b76bce3-163c-4797-b5bd-531eccd16acd",
        "jobId": "143eb4c2-f3a5-4da4-9c9d-1409059bedfa",
        "candidateId": "153e6922-d114-40ac-a816-c73f7766ab72",
        "stage": "APPLIED",
        "status": "SUBMITTED",
        "cvFileKey": null,
        "cvFileUrl": null,
        "coverLetter": null,
        "notes": "Initial application submitted and awaiting review.",
        "appliedAt": "2026-06-01T15:01:39.291Z",
        "reviewedAt": null,
        "createdAt": "2026-06-01T15:01:39.291Z",
        "updatedAt": "2026-06-01T15:01:39.291Z",
        "deletedAt": null,
        "candidate": {
          "id": "153e6922-d114-40ac-a816-c73f7766ab72",
          "email": "seed-charlie.candidate@talentflow.invalid",
          "fullName": "Seed Charlie Le"
        },
        "job": {
          "id": "143eb4c2-f3a5-4da4-9c9d-1409059bedfa",
          "title": "DevOps Engineer",
          "department": "Platform",
          "location": "Remote",
          "employmentType": "CONTRACT"
        }
      }
    ],
    "meta": {
      "total": 3,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  },
  "timestamp": "2026-06-02T10:10:41.654Z"
}
```

---

## Candidates (`/candidates`)

### GET `/candidates`
Retrieves a paginated list of candidates.

**Response (200 OK):**
```json
{
  "status": 200,
  "message": "Success",
  "data": {
    "data": [
      {
        "id": "367e4d88-497d-41c5-8c07-964e84ca0413",
        "email": "seed-bob.candidate@talentflow.invalid",
        "fullName": "Seed Bob Tran",
        "phone": "+84903333444",
        "linkedinUrl": "https://linkedin.com/in/seed-bob-tran",
        "resumeUrl": "https://minio.local/talentflow-cvs/seed-bob-tran.pdf",
        "resumeText": "Seed frontend engineer focused on React, TypeScript, and accessibility.",
        "createdAt": "2026-06-01T15:01:39.278Z",
        "updatedAt": "2026-06-01T15:01:39.278Z",
        "_count": {
          "applications": 1
        }
      }
    ],
    "meta": {
      "total": 4,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  },
  "timestamp": "2026-06-02T10:10:52.836Z"
}
```

---

## Interviews (`/interviews`)

### GET `/interviews`
Retrieves a paginated list of interviews.

**Response (200 OK):**
```json
{
  "status": 200,
  "message": "Success",
  "data": {
    "data": [
      {
        "id": "6d571fdb-745a-4dfa-bb4b-8df4d8feb9f1",
        "applicationId": "f5960860-5464-4dd5-95c3-98dc763cc5f7",
        "interviewerId": "bb19e50e-24df-46c7-acae-0b5dcdbab1f1",
        "type": "TECHNICAL",
        "status": "COMPLETED",
        "scheduledAt": "2026-05-25T15:01:39.307Z",
        "duration": 90,
        "location": "https://zoom.us/j/seed-alice-technical",
        "notes": "Completed system design round. Candidate performed well.",
        "createdAt": "2026-06-01T15:01:39.327Z",
        "updatedAt": "2026-06-01T15:01:39.327Z",
        "interviewer": {
          "id": "bb19e50e-24df-46c7-acae-0b5dcdbab1f1",
          "email": "seed-interviewer@talentflow.invalid",
          "fullName": "Seed Technical Interviewer"
        },
        "application": {
          "id": "f5960860-5464-4dd5-95c3-98dc763cc5f7",
          "candidate": {
            "id": "6008bb27-61c0-4020-a646-8702d68bdf5f",
            "email": "seed-alice.candidate@talentflow.invalid",
            "fullName": "Seed Alice Nguyen"
          },
          "job": {
            "id": "72229da8-7909-4dc0-a93a-b3c6f4a1bc98",
            "title": "Senior Backend Engineer"
          }
        }
      }
    ],
    "meta": {
      "total": 4,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  },
  "timestamp": "2026-06-02T10:11:01.224Z"
}
```

---

## Analytics (`/analytics`)

### GET `/analytics/overview`
Retrieves high-level overview metrics for the dashboard.

**Response (200 OK):**
```json
{
  "status": 200,
  "message": "Success",
  "data": {
    "totalJobs": 3,
    "openJobs": 2,
    "totalCandidates": 4,
    "totalApplications": 3,
    "hiredCount": 0,
    "hireRate": 0
  },
  "timestamp": "2026-06-02T10:11:16.682Z"
}
```

### GET `/analytics/pipeline`
Retrieves the breakdown of applications by stage.

**Response (200 OK):**
```json
{
  "status": 200,
  "message": "Success",
  "data": [
    { "stage": "APPLIED", "count": 1 },
    { "stage": "SCREENING", "count": 1 },
    { "stage": "INTERVIEW", "count": 1 },
    { "stage": "OFFER", "count": 0 },
    { "stage": "HIRED", "count": 0 },
    { "stage": "REJECTED", "count": 0 }
  ],
  "timestamp": "2026-06-02T10:11:20.424Z"
}
```

### GET `/analytics/trends`
Retrieves the count of applications over a historical period (last 30 days).

**Response (200 OK):**
```json
{
  "status": 200,
  "message": "Success",
  "data": [
    { "date": "2026-05-30", "applications": 0 },
    { "date": "2026-05-31", "applications": 0 },
    { "date": "2026-06-01", "applications": 3 }
  ],
  "timestamp": "2026-06-02T10:11:38.723Z"
}
```

### GET `/analytics/top-jobs`
Retrieves metrics for top-performing jobs based on application counts.

**Response (200 OK):**
```json
{
  "status": 200,
  "message": "Success",
  "data": [
    {
      "id": "72229da8-7909-4dc0-a93a-b3c6f4a1bc98",
      "title": "Senior Backend Engineer",
      "department": "Engineering",
      "status": "OPEN",
      "applicationCount": 2
    },
    {
      "id": "576a93de-4589-4f2a-8c2d-f464b3b9c18d",
      "title": "Frontend Engineer",
      "department": "Engineering",
      "status": "OPEN",
      "applicationCount": 1
    }
  ],
  "timestamp": "2026-06-02T10:11:38.733Z"
}
```

---

*Note: Some lists have been truncated for brevity in this documentation. The `/workspaces` endpoints returned 404 Not Found during testing.*
