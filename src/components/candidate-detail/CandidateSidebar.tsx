import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Linkedin, Github, Globe, MessageSquare } from "lucide-react";
import { Candidate, ApplicationStage } from "@/types";

interface CandidateSidebarProps {
  candidate: Candidate;
}

const stageOptions: ApplicationStage[] = [
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "HIRED",
  "REJECTED",
];

export function CandidateSidebar({ candidate }: CandidateSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Move Candidate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <option value={candidate.stage}>{candidate.stage}</option>
            {stageOptions
              .filter((stage) => stage !== candidate.stage)
              .map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
          </select>
          <Button className="w-full">Update Stage</Button>
        </CardContent>
      </Card>

      {/* Resume */}
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <a
            href={candidate.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-smooth"
          >
            <FileText className="h-8 w-8 text-primary" />
            <div className="flex-1">
              <p className="font-medium text-sm">Resume.pdf</p>
              <p className="text-xs text-muted-foreground">2.4 MB</p>
            </div>
            <Download className="h-4 w-4 text-muted-foreground" />
          </a>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Social Profiles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <a
            href="#"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-smooth"
          >
            <Linkedin className="h-5 w-5 text-blue-600" />
            <span className="text-sm">LinkedIn Profile</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-smooth"
          >
            <Github className="h-5 w-5" />
            <span className="text-sm">GitHub Profile</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-smooth"
          >
            <Globe className="h-5 w-5 text-green-600" />
            <span className="text-sm">Portfolio Website</span>
          </a>
        </CardContent>
      </Card>

      {/* Notes Section */}
      <Card>
        <CardHeader>
          <CardTitle>Interview Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground text-center py-8">
            No notes yet. Add notes after interviewing this candidate.
          </div>
          <Button variant="outline" className="w-full">
            <MessageSquare className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
