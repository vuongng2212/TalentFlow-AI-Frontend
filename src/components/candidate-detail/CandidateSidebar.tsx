"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Linkedin,
  Github,
  Globe,
  MessageSquare,
  UserX,
} from "lucide-react";
import { CandidateViewModel, ApplicationStage } from "@/types";
import dynamic from "next/dynamic";

const WithdrawDialog = dynamic(
  () =>
    import("@/components/candidates/WithdrawDialog").then(
      (mod) => mod.WithdrawDialog,
    ),
  { ssr: false },
);

interface CandidateSidebarProps {
  candidate: CandidateViewModel;
  applicationId?: string;
  onStageUpdate?: (stage: ApplicationStage) => void;
  onWithdrawn?: () => void;
}

const stageOptions: ApplicationStage[] = [
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "HIRED",
  "REJECTED",
];

export function CandidateSidebar({
  candidate,
  applicationId,
  onStageUpdate,
  onWithdrawn,
}: CandidateSidebarProps) {
  const [selectedStage, setSelectedStage] = useState<ApplicationStage>(
    candidate.stage ?? "APPLIED",
  );
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Move Candidate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <select
            aria-label="Select application stage"
            value={selectedStage}
            onChange={(e) =>
              setSelectedStage(e.target.value as ApplicationStage)
            }
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            {stageOptions.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
          <Button
            className="w-full"
            onClick={() => onStageUpdate?.(selectedStage)}
          >
            Update Stage
          </Button>
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

      {/* Withdraw Application */}
      {applicationId && (
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full text-destructive border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setWithdrawOpen(true)}
            >
              <UserX className="h-4 w-4 mr-2" />
              Withdraw Application
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Withdraw Dialog */}
      {applicationId && (
        <WithdrawDialog
          applicationId={applicationId}
          candidateName={candidate.fullName}
          jobTitle={candidate.appliedPosition}
          open={withdrawOpen}
          onOpenChange={setWithdrawOpen}
          onWithdrawn={() => onWithdrawn?.()}
        />
      )}
    </div>
  );
}
