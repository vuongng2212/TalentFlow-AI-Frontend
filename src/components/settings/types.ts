import { User } from "@/types";

export type SettingsTab = "profile" | "notifications" | "team" | "preferences";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export interface SettingsTabItem {
  id: SettingsTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Jane Recruiter",
    email: "jane@talentflow.ai",
    role: "RECRUITER",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
  },
  {
    id: "2",
    name: "John Interviewer",
    email: "john@talentflow.ai",
    role: "INTERVIEWER",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@talentflow.ai",
    role: "ADMIN",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
  },
];
