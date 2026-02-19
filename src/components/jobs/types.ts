export interface NewJobForm {
  title: string;
  description: string;
  location: string;
  salaryRange: string;
  experience: string;
  education: string;
  skills: string;
}

export type JobStatusFilter = "ALL" | "OPEN" | "DRAFT" | "CLOSED";

export const initialNewJobState: NewJobForm = {
  title: "",
  description: "",
  location: "",
  salaryRange: "",
  experience: "",
  education: "",
  skills: "",
};
