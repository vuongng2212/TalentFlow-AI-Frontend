"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AIScoreBadge } from "@/components/candidates/AIScoreBadge";
import type { Candidate } from "@/types";
import { GripVertical, Mail, Phone, Clock, ChevronRight } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

interface CandidateCardProps {
  candidate: Candidate;
  isDragging?: boolean;
  isOverlay?: boolean;
  className?: string;
}

export function CandidateCard({
  candidate,
  isDragging = false,
  isOverlay = false,
  className,
}: CandidateCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border border-border/60",
        "transition-all duration-200 ease-out",
        "hover:border-primary/30 hover:shadow-soft-md",
        isDragging && "rotate-2 scale-105 shadow-soft-lg border-primary/40",
        isOverlay && "rotate-3 opacity-90 shadow-soft-xl",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Drag Handle - appears on hover */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1 rounded-l-lg",
          "bg-gradient-to-b from-primary/60 to-primary/30",
          "opacity-0 transition-opacity duration-200",
          (isHovered || isDragging) && "opacity-100"
        )}
      />

      <div className="p-3.5">
        {/* Main Content Row */}
        <div className="flex items-start gap-3">
          {/* Drag Icon */}
          <GripVertical
            className={cn(
              "h-4 w-4 mt-1 text-muted-foreground/40 shrink-0",
              "transition-opacity duration-200 cursor-grab active:cursor-grabbing",
              isHovered ? "opacity-100" : "opacity-0"
            )}
          />

          {/* Avatar */}
          <Avatar
            src={candidate.avatar}
            alt={candidate.fullName}
            fallback={candidate.fullName.charAt(0)}
            size="md"
            className="shrink-0 ring-2 ring-background shadow-soft-sm"
          />

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link
                  href={`/dashboard/candidates/${candidate.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className={cn(
                    "font-semibold text-sm leading-tight block truncate",
                    "hover:text-primary transition-colors duration-150"
                  )}
                >
                  {candidate.fullName}
                </Link>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {candidate.appliedPosition}
                </p>
              </div>

              {/* AI Score */}
              {candidate.aiScore && (
                <AIScoreBadge score={candidate.aiScore} size="sm" />
              )}
            </div>

            {/* Applied time - subtle */}
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
              <Clock className="h-2.5 w-2.5" />
              <span>{formatRelativeTime(candidate.appliedDate)}</span>
            </div>
          </div>
        </div>

        {/* Skills Tags - Compact */}
        {candidate.skills && candidate.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3 pl-7">
            {candidate.skills.slice(0, 3).map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="text-[10px] px-1.5 py-0 h-4 font-normal bg-muted/40"
              >
                {skill}
              </Badge>
            ))}
            {candidate.skills.length > 3 && (
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 h-4 font-medium text-primary bg-primary/5 border-primary/20"
              >
                +{candidate.skills.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Hover Actions - Contact Info */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-200",
            isHovered ? "max-h-16 opacity-100 mt-3" : "max-h-0 opacity-0 mt-0"
          )}
        >
          <div className="flex items-center gap-3 pl-7 text-[10px] text-muted-foreground">
            {candidate.email && (
              <a
                href={`mailto:${candidate.email}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Mail className="h-2.5 w-2.5" />
                <span className="truncate max-w-[100px]">{candidate.email}</span>
              </a>
            )}
            {candidate.phone && (
              <a
                href={`tel:${candidate.phone}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Phone className="h-2.5 w-2.5" />
                <span>{candidate.phone}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* View Profile Indicator */}
      <Link
        href={`/dashboard/candidates/${candidate.id}`}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2",
          "h-6 w-6 flex items-center justify-center rounded-full",
          "bg-primary/10 text-primary",
          "opacity-0 transition-all duration-200",
          isHovered && "opacity-100 translate-x-0",
          !isHovered && "translate-x-2"
        )}
      >
        <ChevronRight className="h-3.5 w-3.5" />
      </Link>
    </Card>
  );
}

// Simplified overlay version for drag preview
export function CandidateCardOverlay({ candidate }: { candidate: Candidate }) {
  return (
    <Card className="w-72 p-3 shadow-soft-xl rotate-3 opacity-95 border-primary/30">
      <div className="flex items-center gap-3">
        <Avatar
          src={candidate.avatar}
          alt={candidate.fullName}
          fallback={candidate.fullName.charAt(0)}
          size="md"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm truncate">{candidate.fullName}</h4>
          <p className="text-xs text-muted-foreground truncate">
            {candidate.appliedPosition}
          </p>
        </div>
        {candidate.aiScore && (
          <AIScoreBadge score={candidate.aiScore} size="sm" showBreakdown={false} />
        )}
      </div>
    </Card>
  );
}
