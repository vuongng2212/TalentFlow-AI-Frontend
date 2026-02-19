import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Clock } from "lucide-react";

interface CandidateStatsCardsProps {
  totalCandidates: number;
  inProgressCount: number;
  hiredCount: number;
}

export function CandidateStatsCards({
  totalCandidates,
  inProgressCount,
  hiredCount,
}: CandidateStatsCardsProps) {
  const conversionRate =
    totalCandidates > 0 ? Math.round((hiredCount / totalCandidates) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="shadow-soft-sm hover-lift">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums">{totalCandidates}</p>
              <p className="text-xs text-muted-foreground">Total Candidates</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-soft-sm hover-lift">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums">{inProgressCount}</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-soft-sm hover-lift">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums">{hiredCount}</p>
              <p className="text-xs text-muted-foreground">Hired</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-soft-sm hover-lift">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <Badge
                variant="outline"
                className="h-10 w-10 text-lg font-bold border-purple-500/30 text-purple-500"
              >
                {conversionRate}%
              </Badge>
            </div>
            <div>
              <p className="text-sm font-semibold">Conversion</p>
              <p className="text-xs text-muted-foreground">Hire Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
