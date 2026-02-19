import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus } from "lucide-react";

interface EmptyInterviewStateProps {
  onScheduleClick: () => void;
}

export function EmptyInterviewState({
  onScheduleClick,
}: EmptyInterviewStateProps) {
  return (
    <Card className="lg:col-span-2">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <CalendarIcon className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-lg font-medium mb-2">No interviews scheduled</p>
        <p className="text-sm text-muted-foreground mb-6">
          Schedule your first interview to get started
        </p>
        <Button onClick={onScheduleClick}>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Interview
        </Button>
      </CardContent>
    </Card>
  );
}
