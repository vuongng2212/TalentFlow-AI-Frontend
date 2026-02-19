"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getMockCandidate } from "@/lib/mock-data";
import { ArrowLeft } from "lucide-react";
import {
  CandidateNotFound,
  CandidateHeader,
  AIScoreBreakdownCard,
  SkillsCard,
  ApplicationTimeline,
  CandidateSidebar,
} from "@/components/candidate-detail";

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const candidateId = params.id as string;

  const candidate = getMockCandidate(candidateId);

  if (!candidate) {
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
        <CandidateSidebar candidate={candidate} />
      </div>
    </div>
  );
}
