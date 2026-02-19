import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Calendar as CalendarIcon, Clock, Video, MapPin } from "lucide-react";
import { Interview } from "./types";

interface InterviewCardProps {
  interview: Interview;
  isToday: boolean;
  isPast: boolean;
}

export const InterviewCard = React.memo(function InterviewCard({
  interview,
  isToday,
  isPast,
}: InterviewCardProps) {
  return (
    <Card className={`hover-lift ${isToday ? "border-primary" : ""}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Avatar
              src={interview.candidate.avatar}
              alt={interview.candidate.fullName}
              fallback={interview.candidate.fullName.charAt(0)}
              size="lg"
            />
            <div>
              <h3 className="font-semibold text-lg">
                {interview.candidate.fullName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {interview.position}
              </p>
            </div>
          </div>
          <Badge
            variant={isPast ? "outline" : isToday ? "default" : "secondary"}
          >
            {interview.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date & Time */}
        <div className="flex items-center gap-2 text-sm">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            {interview.date.toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </span>
          <span className="text-muted-foreground">•</span>
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>
            {interview.date.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
          <span className="text-muted-foreground">
            ({interview.duration} min)
          </span>
        </div>

        {/* Location/Link */}
        <div className="flex items-center gap-2 text-sm">
          {interview.type === "VIDEO" ? (
            <>
              <Video className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Video Call</span>
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {interview.location}
              </span>
            </>
          )}
        </div>

        {/* Interviewer */}
        <div className="text-sm text-muted-foreground">
          Interviewer:{" "}
          <span className="font-medium text-foreground">
            {interview.interviewer}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {interview.type === "VIDEO" && interview.meetingLink ? (
            <Button size="sm" className="flex-1">
              <Video className="h-4 w-4 mr-2" />
              Join Call
            </Button>
          ) : null}
          <Button size="sm" variant="outline" className="flex-1">
            Reschedule
          </Button>
          <Button size="sm" variant="ghost">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});
