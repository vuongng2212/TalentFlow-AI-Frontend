import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Star, TrendingUp, LucideIcon } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { Candidate, ApplicationStage } from "@/types";

interface TimelineItem {
  date: Date;
  title: string;
  description: string;
  icon: LucideIcon;
}

interface ApplicationTimelineProps {
  candidate: Candidate;
}

export function ApplicationTimeline({ candidate }: ApplicationTimelineProps) {
  const timeline = useMemo<TimelineItem[]>(() => {
    const items: TimelineItem[] = [
      {
        date: candidate.appliedDate,
        title: "Application Submitted",
        description: `Applied for ${candidate.appliedPosition}`,
        icon: CheckCircle2,
      },
      {
        date: new Date(candidate.appliedDate.getTime() + 1 * 24 * 60 * 60 * 1000),
        title: "Resume Reviewed",
        description: "AI screening completed - High match score",
        icon: Star,
      },
    ];

    if (candidate.stage !== "APPLIED") {
      items.push({
        date: new Date(candidate.appliedDate.getTime() + 2 * 24 * 60 * 60 * 1000),
        title: "Moved to Screening",
        description: "Recruiter initiated screening process",
        icon: TrendingUp,
      });
    }

    return items;
  }, [candidate.appliedDate, candidate.appliedPosition, candidate.stage]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timeline.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  {index < timeline.length - 1 ? (
                    <div className="w-0.5 flex-1 bg-border mt-2" />
                  ) : null}
                </div>
                <div className="flex-1 pb-6">
                  <p className="font-semibold mb-1">{item.title}</p>
                  <p className="text-sm text-muted-foreground mb-1">
                    {item.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatRelativeTime(item.date)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
