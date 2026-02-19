import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";
import { Job } from "@/types";

interface JobSelectorProps {
  selectedJob: string;
  onJobChange: (jobId: string) => void;
  jobs: Job[];
}

export function JobSelector({
  selectedJob,
  onJobChange,
  jobs,
}: JobSelectorProps) {
  const openJobs = jobs.filter((job) => job.status === "OPEN");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Job Position</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="job">
            Which position are these candidates applying for?
          </Label>
          <select
            id="job"
            value={selectedJob}
            onChange={(e) => onJobChange(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Select a job...</option>
            {openJobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} - {job.location}
              </option>
            ))}
          </select>
          {selectedJob ? (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-green-500" />
              Job selected
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
