import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, Video } from "lucide-react";

interface InterviewStatsCardsProps {
  todayCount: number;
  upcomingCount: number;
  completionRate?: number;
}

export function InterviewStatsCards({
  todayCount,
  upcomingCount,
  completionRate = 94,
}: InterviewStatsCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Today
          </CardTitle>
          <CalendarIcon className="h-5 w-5 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{todayCount}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Interviews scheduled
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            This Week
          </CardTitle>
          <Clock className="h-5 w-5 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{upcomingCount}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Upcoming this week
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Completion Rate
          </CardTitle>
          <Video className="h-5 w-5 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{completionRate}%</div>
          <p className="text-xs text-muted-foreground mt-1">This month</p>
        </CardContent>
      </Card>
    </div>
  );
}
