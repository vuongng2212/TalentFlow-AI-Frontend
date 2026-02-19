"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KanbanSkeletonProps {
  columns?: number;
  cardsPerColumn?: number;
  className?: string;
}

export function KanbanSkeleton({
  columns = 6,
  cardsPerColumn = 3,
  className,
}: KanbanSkeletonProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Kanban board"
      className={cn("flex gap-4 overflow-x-auto pb-4 min-h-125", className)}
    >
      <span className="sr-only">Loading candidates board...</span>
      {Array.from({ length: columns }).map((_, i) => (
        <div
          key={i}
          className="shrink-0 w-80 animate-pulse"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <Card className="h-full border-border/50 shadow-soft-sm">
            {/* Column Header */}
            <CardHeader className="pb-3 border-b border-border/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-muted" />
                  <div className="h-4 w-20 bg-muted rounded" />
                </div>
                <div className="h-5 w-8 bg-muted rounded-full" />
              </div>
            </CardHeader>

            {/* Column Body */}
            <CardContent className="p-3 space-y-2">
              {Array.from({ length: cardsPerColumn }).map((_, j) => (
                <Card
                  key={j}
                  className="p-3.5 border-border/60"
                  style={{ animationDelay: `${(i * columns + j) * 50}ms` }}
                >
                  <div className="flex items-start gap-3">
                    {/* Drag handle placeholder */}
                    <div className="h-4 w-4 mt-1 rounded bg-muted/30" />

                    {/* Avatar */}
                    <div className="h-10 w-10 rounded-full bg-muted shrink-0" />

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1.5 flex-1">
                          <div className="h-4 w-28 bg-muted rounded" />
                          <div className="h-3 w-36 bg-muted rounded" />
                        </div>
                        {/* AI Score placeholder */}
                        <div className="h-5 w-12 bg-muted rounded-full" />
                      </div>

                      {/* Time */}
                      <div className="h-2.5 w-16 bg-muted/50 rounded" />
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="flex gap-1 mt-3 pl-7">
                    <div className="h-4 w-14 bg-muted/50 rounded" />
                    <div className="h-4 w-12 bg-muted/50 rounded" />
                    <div className="h-4 w-10 bg-muted/50 rounded" />
                  </div>
                </Card>
              ))}
            </CardContent>

            {/* Column Footer */}
            <div className="px-4 py-2 border-t border-border/30">
              <div className="h-3 w-20 bg-muted/50 rounded" />
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}
