import { Candidate } from "@/types";

export interface Interview {
  id: string;
  candidate: Candidate;
  position: string;
  date: Date;
  duration: number;
  type: "VIDEO" | "ONSITE";
  interviewer: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  meetingLink?: string;
  location?: string;
}

export interface NewInterviewForm {
  candidateId: string;
  jobId: string;
  date: string;
  time: string;
  duration: string;
  type: "VIDEO" | "ONSITE";
  interviewer: string;
  location: string;
  meetingLink: string;
  notes: string;
}

export type InterviewFilter = "ALL" | "TODAY" | "UPCOMING";

export const initialNewInterviewState: NewInterviewForm = {
  candidateId: "",
  jobId: "",
  date: "",
  time: "",
  duration: "60",
  type: "VIDEO",
  interviewer: "",
  location: "",
  meetingLink: "",
  notes: "",
};
