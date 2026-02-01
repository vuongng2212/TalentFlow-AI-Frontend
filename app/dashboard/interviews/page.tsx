import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export default function InterviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Interviews</h1>
        <p className="text-muted-foreground mt-1">
          Schedule and manage candidate interviews
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">Interview Scheduling</p>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            This feature will be available in Phase 2. You'll be able to
            schedule interviews, send calendar invites, and track feedback.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
