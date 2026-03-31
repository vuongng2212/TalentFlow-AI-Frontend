import type { EmploymentType, Job, JobStatus } from "@/types";

export interface NewJobForm {
  title: string;
  description: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  salaryMin: string;
  salaryMax: string;
  status: JobStatus;
  skills: string;
}

export type JobStatusFilter = "ALL" | "OPEN" | "DRAFT" | "CLOSED";

export const initialNewJobState: NewJobForm = {
  title: "",
  description: "",
  department: "",
  location: "",
  employmentType: "FULL_TIME",
  salaryMin: "",
  salaryMax: "",
  status: "DRAFT",
  skills: "",
};

export function jobToForm(job: Job): NewJobForm {
  // Backend returns requirements as string[] or legacy Record with .skills
  const skillsList: string[] = Array.isArray(job.requirements)
    ? job.requirements
    : (((job.requirements as Record<string, unknown>)?.skills as string[]) ??
      []);

  return {
    title: job.title,
    description: job.description ?? "",
    department: job.department ?? "",
    location: job.location ?? "",
    employmentType: job.employmentType,
    salaryMin: job.salaryMin != null ? String(job.salaryMin) : "",
    salaryMax: job.salaryMax != null ? String(job.salaryMax) : "",
    status: job.status,
    skills: skillsList.join(", "),
  };
}
