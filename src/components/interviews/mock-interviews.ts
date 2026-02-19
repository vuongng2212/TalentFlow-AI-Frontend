import { mockCandidates } from "@/lib/mock-data";
import { Interview } from "./types";

export const mockInterviews: Interview[] = [
  {
    id: "1",
    candidate: mockCandidates[2],
    position: "Frontend Developer",
    date: new Date(2026, 1, 3, 10, 0),
    duration: 60,
    type: "VIDEO",
    interviewer: "Jane Recruiter",
    status: "SCHEDULED",
    meetingLink: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: "2",
    candidate: mockCandidates[3],
    position: "Backend Engineer",
    date: new Date(2026, 1, 3, 14, 30),
    duration: 45,
    type: "VIDEO",
    interviewer: "John Interviewer",
    status: "SCHEDULED",
    meetingLink: "https://zoom.us/j/123456789",
  },
  {
    id: "3",
    candidate: mockCandidates[1],
    position: "Full-Stack Developer",
    date: new Date(2026, 1, 4, 11, 0),
    duration: 60,
    type: "ONSITE",
    interviewer: "Jane Recruiter",
    status: "SCHEDULED",
    location: "Office - Conference Room A",
  },
  {
    id: "4",
    candidate: mockCandidates[0],
    position: "Senior Full-Stack Developer",
    date: new Date(2026, 1, 5, 9, 30),
    duration: 90,
    type: "VIDEO",
    interviewer: "John Interviewer",
    status: "SCHEDULED",
    meetingLink: "https://teams.microsoft.com/l/meetup-join/...",
  },
];
