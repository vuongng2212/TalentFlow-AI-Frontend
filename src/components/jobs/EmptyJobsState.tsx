import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Plus } from "lucide-react";

interface EmptyJobsStateProps {
  hasSearchQuery: boolean;
  onCreateClick: () => void;
}

export function EmptyJobsState({
  hasSearchQuery,
  onCreateClick,
}: EmptyJobsStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16">
        <Briefcase className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-lg font-medium mb-2">No jobs found</p>
        <p className="text-sm text-muted-foreground mb-6">
          {hasSearchQuery
            ? "Try adjusting your search or filters"
            : "Create your first job posting to get started"}
        </p>
        {!hasSearchQuery ? (
          <Button onClick={onCreateClick}>
            <Plus className="h-4 w-4 mr-2" />
            Create First Job
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
