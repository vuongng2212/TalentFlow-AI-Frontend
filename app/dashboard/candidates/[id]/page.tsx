"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  CandidateNotFound,
  CandidateHeader,
  AIScoreBreakdownCard,
  SkillsCard,
  ApplicationTimeline,
  CandidateSidebar,
} from "@/components/candidate-detail";
import { useApplication } from "@/services/applications";
import { updateApplicationStage } from "@/services/applications";
import { mapApplicationToViewModel } from "@/lib/mappers";
import { APPLICATION_STAGES } from "@/lib/constants";
import type { ApplicationStage } from "@/types";
import { toast } from "sonner";

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;

  const {
    data: application,
    isLoading,
    error,
    mutate,
  } = useApplication(applicationId);

  const candidate = useMemo(
    () => (application ? mapApplicationToViewModel(application) : null),
    [application],
  );

  const handleStageUpdate = useCallback(
    async (newStage: ApplicationStage) => {
      try {
        await updateApplicationStage(applicationId, newStage);
        toast.success(`Stage updated to ${APPLICATION_STAGES[newStage]}`);
        mutate();
      } catch {
        toast.error("Failed to update stage");
      }
    },
    [applicationId, mutate],
  );

  const handleWithdrawn = useCallback(() => {
    router.push("/dashboard/candidates");
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !candidate) {
    return <CandidateNotFound onBack={() => router.back()} />;
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Candidates
      </Button>

      {/* Header */}
      <CandidateHeader candidate={candidate} />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Score Breakdown */}
          {candidate.aiScore ? (
            <AIScoreBreakdownCard aiScore={candidate.aiScore} />
          ) : null}

          {/* Skills */}
          {candidate.skills && candidate.skills.length > 0 ? (
            <SkillsCard skills={candidate.skills} />
          ) : null}

          {/* Application Timeline */}
          <ApplicationTimeline candidate={candidate} />
        </div>

        {/* Sidebar */}
        <CandidateSidebar
          candidate={candidate}
          applicationId={applicationId}
          onStageUpdate={handleStageUpdate}
          onWithdrawn={handleWithdrawn}
        />
      </div>
    </div>
  );
}
