import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ApplicationStage, KanbanColumn } from "@/types";

const colorMap: Record<ApplicationStage, string> = {
  APPLIED: "bg-blue-500",
  SCREENING: "bg-amber-500",
  INTERVIEW: "bg-purple-500",
  OFFER: "bg-teal-500",
  HIRED: "bg-emerald-500",
  REJECTED: "bg-rose-500",
};

interface PipelineOverviewProps {
  columns: KanbanColumn[];
  totalCandidates: number;
}

export function PipelineOverview({
  columns,
  totalCandidates,
}: PipelineOverviewProps) {
  return (
    <Card className="shadow-soft-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          Pipeline Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-1 h-3 rounded-full overflow-hidden bg-muted">
          {columns
            .filter((col) => col.count > 0)
            .map((column) => {
              const percentage = (column.count / totalCandidates) * 100;
              return (
                <div
                  key={column.id}
                  className={`h-full transition-all duration-500 ${colorMap[column.id]}`}
                  style={{ width: `${percentage}%` }}
                  title={`${column.title}: ${column.count}`}
                />
              );
            })}
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          {columns.map((column) => (
            <div key={column.id} className="flex items-center gap-2 text-xs">
              <div className={`h-2.5 w-2.5 rounded-full ${colorMap[column.id]}`} />
              <span className="text-muted-foreground">{column.title}</span>
              <span className="font-semibold tabular-nums">{column.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
