import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Users, Upload } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { AIScoreBadge } from "@/components/candidates";
import { Candidate } from "@/types";

interface ApplicantsListProps {
  applicants: Candidate[];
}

export function ApplicantsList({ applicants }: ApplicantsListProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Applicants ({applicants.length})</CardTitle>
          <Link href="/dashboard/candidates">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {applicants.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No applicants yet</p>
            <Link href="/dashboard/upload">
              <Button variant="outline" size="sm" className="mt-4 gap-2">
                <Upload className="h-4 w-4" />
                Upload First CV
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {applicants.slice(0, 5).map((candidate) => (
              <Link
                key={candidate.id}
                href={`/dashboard/candidates/${candidate.id}`}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-smooth"
              >
                <Avatar
                  src={candidate.avatar}
                  alt={candidate.fullName}
                  fallback={candidate.fullName.charAt(0)}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{candidate.fullName}</p>
                  <p className="text-sm text-muted-foreground">
                    Applied {formatDate(candidate.appliedDate)}
                  </p>
                </div>
                {candidate.aiScore ? (
                  <AIScoreBadge score={candidate.aiScore} size="sm" />
                ) : null}
                <Badge variant="outline">{candidate.stage}</Badge>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
