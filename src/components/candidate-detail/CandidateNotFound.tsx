import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";

interface CandidateNotFoundProps {
  onBack: () => void;
}

export function CandidateNotFound({ onBack }: CandidateNotFoundProps) {
  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">Candidate not found</p>
          <p className="text-sm text-muted-foreground mb-6">
            The candidate profile you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/dashboard/candidates">
            <Button>Back to Candidates</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
