import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Mail, Phone, Calendar, MessageSquare, Video, Download } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { Candidate } from "@/types";

interface CandidateHeaderProps {
  candidate: Candidate;
}

export function CandidateHeader({ candidate }: CandidateHeaderProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-6">
          <Avatar
            src={candidate.avatar}
            alt={candidate.fullName}
            fallback={candidate.fullName.charAt(0)}
            size="lg"
            className="h-24 w-24 text-2xl"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h1 className="text-3xl font-bold mb-1">{candidate.fullName}</h1>
                <p className="text-lg text-muted-foreground">
                  {candidate.appliedPosition}
                </p>
              </div>
              <Badge variant="outline" className="text-base px-3 py-1">
                {candidate.stage}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
              {candidate.email ? (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a
                    href={`mailto:${candidate.email}`}
                    className="hover:text-primary"
                  >
                    {candidate.email}
                  </a>
                </div>
              ) : null}
              {candidate.phone ? (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <a
                    href={`tel:${candidate.phone}`}
                    className="hover:text-primary"
                  >
                    {candidate.phone}
                  </a>
                </div>
              ) : null}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Applied {formatRelativeTime(candidate.appliedDate)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="default">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </Button>
              <Button variant="outline">
                <Video className="h-4 w-4 mr-2" />
                Schedule Interview
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Resume
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
