import { useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Upload, Users, Share2 } from "lucide-react";
import { Job, Candidate } from "@/types";

interface JobSidebarProps {
  job: Job;
  applicants: Candidate[];
}

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
}

const hiringTeam: TeamMember[] = [
  {
    name: "Jane Recruiter",
    role: "Lead Recruiter",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=recruiter",
  },
  {
    name: "John Tech Lead",
    role: "Hiring Manager",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  },
];

export function JobSidebar({ job, applicants }: JobSidebarProps) {
  const avgAiScore = useMemo(() => {
    if (applicants.length === 0) return 0;
    const total = applicants.reduce((sum, c) => sum + (c.aiScore || 0), 0);
    return Math.round(total / applicants.length);
  }, [applicants]);

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Total Applications
            </p>
            <p className="text-2xl font-bold">{job.applicationCount}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Active Candidates
            </p>
            <p className="text-2xl font-bold">{applicants.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Avg. AI Score</p>
            <p className="text-2xl font-bold">{avgAiScore}%</p>
          </div>
        </CardContent>
      </Card>

      {/* Hiring Team */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Hiring Team</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {hiringTeam.map((member) => (
            <div key={member.name} className="flex items-center gap-3">
              <Avatar
                src={member.avatar}
                alt={member.name}
                fallback={member.name.charAt(0)}
              />
              <div>
                <p className="font-medium text-sm">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Link href="/dashboard/upload">
            <Button variant="outline" size="sm" className="w-full gap-2">
              <Upload className="h-4 w-4" />
              Upload CV
            </Button>
          </Link>
          <Link href="/dashboard/candidates">
            <Button variant="outline" size="sm" className="w-full gap-2">
              <Users className="h-4 w-4" />
              View Candidates
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="w-full gap-2">
            <Share2 className="h-4 w-4" />
            Share Job
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
