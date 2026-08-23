# Data Model: Dashboard Layout and Component Enhancements

## Key Entities & Data Contracts

The frontend utilizes four read-only models fetched from the Backend REST API for rendering the dashboard metrics, charts, and tables. These models correspond to the entities defined below.

### 1. DashboardMetrics
This model represents high-level metrics summary of the system.
* **Fields**:
  - `totalJobs`: number (Total number of requisitions/jobs in workspace)
  - `openJobs`: number (Number of jobs currently active/open)
  - `totalCandidates`: number (Total candidates stored in database)
  - `totalApplications`: number (Total application submissions across all jobs)
  - `hiredCount`: number (Number of applications placed in HIRED stage)
  - `hireRate`: number (Hired applications as a percentage of total applications)
* **Validation Rules**:
  - All metrics must be non-negative integers.
  - `hireRate` must be a number between 0 and 100.
  - If total applications is 0, `hireRate` defaults to 0.

### 2. PipelineStageCount
Represents candidate distribution per application stage.
* **Fields**:
  - `stage`: string (Mapped to `ApplicationStage` enum values: `APPLIED`, `SCREENING`, `INTERVIEW`, `OFFER`, `HIRED`, `REJECTED`)
  - `count`: number (Number of applications in this stage)
* **Validation Rules**:
  - `stage` must be one of the pre-defined `ApplicationStage` enum values.
  - `count` must be a non-negative integer.

### 3. TrendData
Data points representing daily application volumes over time.
* **Fields**:
  - `date`: string (ISO 8601 date representation or `YYYY-MM-DD` string)
  - `applications`: number (Number of applications submitted on that date)
* **Validation Rules**:
  - `date` must be a valid date representation.
  - `applications` must be a non-negative integer.

### 4. TopJobData
Represents the most active open roles based on applicant volume.
* **Fields**:
  - `id`: string (UUID or unique job identifier)
  - `title`: string (Title of the job role)
  - `department`: string (Department name, e.g., "Engineering", "Sales", "Product")
  - `status`: string (Mapped to `JobStatus` enum: `OPEN`, `DRAFT`, `CLOSED`)
  - `applicationCount`: number (Total number of applications received for this job)
* **Validation Rules**:
  - `id` must be a non-empty string.
  - `title` and `department` must be non-empty strings.
  - `status` must be a valid `JobStatus`.
  - `applicationCount` must be a non-negative integer.
