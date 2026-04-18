export const APP_NAME = "TalentFlow AI";
export const APP_DESCRIPTION = "Intelligent Recruitment Platform";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  DASHBOARD: "/dashboard",
  JOBS: "/dashboard/jobs",
  CANDIDATES: "/dashboard/candidates",
  APPLICATIONS: "/dashboard/applications",
  INTERVIEWS: "/dashboard/interviews",
  ANALYTICS: "/dashboard/analytics",
  UPLOAD: "/dashboard/upload",
  SETTINGS: "/dashboard/settings",
  USERS: "/dashboard/users",
} as const;

export const APPLICATION_STAGES = {
  APPLIED: "Applied",
  SCREENING: "Screening",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  HIRED: "Hired",
  REJECTED: "Rejected",
} as const;

export const JOB_STATUS = {
  DRAFT: "Draft",
  OPEN: "Open",
  CLOSED: "Closed",
  ARCHIVED: "Archived",
} as const;

export const USER_ROLES = {
  ADMIN: "Admin",
  RECRUITER: "Recruiter",
  INTERVIEWER: "Interviewer",
} as const;
