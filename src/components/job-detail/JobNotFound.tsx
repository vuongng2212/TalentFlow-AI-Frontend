import { Button } from "@/components/ui/button";
import { ArrowLeft, Briefcase } from "lucide-react";

interface JobNotFoundProps {
  onBack: () => void;
}

export function JobNotFound({ onBack }: JobNotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Briefcase className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
      <p className="text-muted-foreground mb-6">
        The job you&apos;re looking for doesn&apos;t exist
      </p>
      <Button onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Go Back
      </Button>
    </div>
  );
}
