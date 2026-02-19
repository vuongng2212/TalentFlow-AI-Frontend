import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InterviewFilter } from "./types";

interface InterviewFiltersProps {
  filter: InterviewFilter;
  onFilterChange: (filter: InterviewFilter) => void;
  totalCount: number;
  todayCount: number;
  upcomingCount: number;
}

export function InterviewFilters({
  filter,
  onFilterChange,
  totalCount,
  todayCount,
  upcomingCount,
}: InterviewFiltersProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex gap-2">
          <Button
            variant={filter === "ALL" ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange("ALL")}
          >
            All ({totalCount})
          </Button>
          <Button
            variant={filter === "TODAY" ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange("TODAY")}
          >
            Today ({todayCount})
          </Button>
          <Button
            variant={filter === "UPCOMING" ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange("UPCOMING")}
          >
            Upcoming ({upcomingCount})
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
