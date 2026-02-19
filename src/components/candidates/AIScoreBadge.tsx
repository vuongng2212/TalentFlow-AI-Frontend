"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Sparkles, Target, Briefcase, GraduationCap, TrendingUp } from "lucide-react";

interface AIScoreBreakdown {
  skillsMatch: number;
  experienceMatch: number;
  educationMatch?: number;
  cultureFit?: number;
}

interface AIScoreBadgeProps {
  score: number;
  breakdown?: AIScoreBreakdown;
  showBreakdown?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Seeded random function for deterministic breakdown generation
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate deterministic breakdown based on score
function generateBreakdown(score: number): AIScoreBreakdown {
  return {
    skillsMatch: Math.min(100, Math.max(0, score + Math.floor(seededRandom(score * 1) * 10) - 5)),
    experienceMatch: Math.min(100, Math.max(0, score + Math.floor(seededRandom(score * 2) * 15) - 7)),
    educationMatch: Math.min(100, Math.max(0, score + Math.floor(seededRandom(score * 3) * 12) - 6)),
    cultureFit: Math.min(100, Math.max(0, score + Math.floor(seededRandom(score * 4) * 8) - 4)),
  };
}

function getScoreLevel(score: number): {
  label: string;
  colorClass: string;
  bgClass: string;
} {
  if (score >= 85) {
    return {
      label: "Excellent",
      colorClass: "text-white",
      bgClass: "ai-score-excellent",
    };
  }
  if (score >= 70) {
    return {
      label: "Good",
      colorClass: "text-white",
      bgClass: "ai-score-good",
    };
  }
  if (score >= 50) {
    return {
      label: "Average",
      colorClass: "text-white",
      bgClass: "ai-score-average",
    };
  }
  return {
    label: "Low",
    colorClass: "text-white",
    bgClass: "ai-score-low",
  };
}

function ScoreBar({ value, label, icon: Icon }: { value: number; label: string; icon: React.ElementType }) {
  const { bgClass } = getScoreLevel(value);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Icon className="h-3 w-3" />
          {label}
        </span>
        <span className="font-medium tabular-nums">{value}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", bgClass)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export const AIScoreBadge = React.memo(function AIScoreBadge({
  score,
  breakdown,
  showBreakdown = true,
  size = "md",
  className,
}: AIScoreBadgeProps) {
  const { label, colorClass, bgClass } = getScoreLevel(score);

  // Memoize breakdown to prevent recalculation on each render
  const stableBreakdown = React.useMemo(() => {
    if (breakdown) return breakdown;
    return generateBreakdown(score);
  }, [score, breakdown]);

  const sizeClasses = {
    sm: "h-5 min-w-5 px-1.5 text-[10px]",
    md: "h-6 min-w-6 px-2 text-xs",
    lg: "h-7 min-w-7 px-2.5 text-sm",
  };

  const iconSizes = {
    sm: "h-2.5 w-2.5",
    md: "h-3 w-3",
    lg: "h-3.5 w-3.5",
  };

  const badge = (
    <div
      className={cn(
        "inline-flex items-center justify-center gap-1 rounded-full font-semibold tabular-nums",
        "shadow-sm transition-all duration-200",
        "hover:scale-105 hover:shadow-md cursor-default",
        bgClass,
        colorClass,
        sizeClasses[size],
        className
      )}
    >
      <Sparkles className={iconSizes[size]} />
      <span>{score}%</span>
    </div>
  );

  if (!showBreakdown) {
    return badge;
  }

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>{badge}</HoverCardTrigger>
      <HoverCardContent
        side="top"
        align="end"
        className="w-64 p-0 overflow-hidden"
      >
        {/* Header */}
        <div className={cn("px-4 py-3", bgClass)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-white/80">AI Score</p>
                <p className="text-lg font-bold text-white">{score}%</p>
              </div>
            </div>
            <div className="rounded-full bg-white/20 px-2 py-0.5">
              <span className="text-xs font-semibold text-white">{label}</span>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="p-4 space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Score Breakdown
          </p>

          <div className="space-y-3">
            <ScoreBar
              value={stableBreakdown.skillsMatch}
              label="Skills Match"
              icon={Target}
            />
            <ScoreBar
              value={stableBreakdown.experienceMatch}
              label="Experience"
              icon={Briefcase}
            />
            {stableBreakdown.educationMatch ? (
              <ScoreBar
                value={stableBreakdown.educationMatch}
                label="Education"
                icon={GraduationCap}
              />
            ) : null}
            {stableBreakdown.cultureFit ? (
              <ScoreBar
                value={stableBreakdown.cultureFit}
                label="Culture Fit"
                icon={TrendingUp}
              />
            ) : null}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-border bg-muted/30">
          <p className="text-[10px] text-muted-foreground text-center">
            Powered by TalentFlow AI
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
});
