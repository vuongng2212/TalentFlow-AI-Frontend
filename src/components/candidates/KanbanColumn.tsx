"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CandidateCard } from "@/components/candidates/CandidateCard";
import type { Candidate, ApplicationStage, KanbanColumn as KanbanColumnType } from "@/types";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Inbox,
  Search,
  MessageSquare,
  Gift,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface KanbanColumnProps {
  column: KanbanColumnType;
  className?: string;
}

const stageConfig: Record<
  ApplicationStage,
  { icon: React.ElementType; bgClass: string; accentColor: string }
> = {
  APPLIED: {
    icon: Inbox,
    bgClass: "kanban-applied",
    accentColor: "bg-blue-500",
  },
  SCREENING: {
    icon: Search,
    bgClass: "kanban-screening",
    accentColor: "bg-amber-500",
  },
  INTERVIEW: {
    icon: MessageSquare,
    bgClass: "kanban-interview",
    accentColor: "bg-purple-500",
  },
  OFFER: {
    icon: Gift,
    bgClass: "kanban-offer",
    accentColor: "bg-teal-500",
  },
  HIRED: {
    icon: CheckCircle2,
    bgClass: "kanban-hired",
    accentColor: "bg-emerald-500",
  },
  REJECTED: {
    icon: XCircle,
    bgClass: "kanban-rejected",
    accentColor: "bg-rose-500",
  },
};

// Sortable Candidate Item
function SortableCandidateItem({ candidate }: { candidate: Candidate }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: candidate.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "mb-2 last:mb-0",
        isDragging && "opacity-50"
      )}
    >
      <CandidateCard candidate={candidate} isDragging={isDragging} />
    </div>
  );
}

export function KanbanColumn({ column, className }: KanbanColumnProps) {
  const config = stageConfig[column.id];
  const Icon = config.icon;

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div
      className={cn(
        "flex h-full w-80 shrink-0 flex-col rounded-xl overflow-hidden",
        "border border-border/50 shadow-soft-sm",
        "transition-all duration-200",
        isOver && "ring-2 ring-primary/30 border-primary/40",
        className
      )}
    >
      {/* Sticky Header */}
      <div
        className={cn(
          "sticky top-0 z-10 px-4 py-3",
          "border-b border-border/40",
          "backdrop-blur-sm",
          config.bgClass
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Accent dot */}
            <div className={cn("h-2.5 w-2.5 rounded-full", config.accentColor)} />
            <div className="flex items-center gap-1.5">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold tracking-tight">
                {column.title}
              </h3>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="h-5 min-w-5 px-1.5 text-[10px] font-semibold tabular-nums"
          >
            {column.count}
          </Badge>
        </div>
      </div>

      {/* Scrollable Body */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 overflow-y-auto p-3",
          "min-h-[200px]",
          config.bgClass
        )}
      >
        <SortableContext
          items={column.candidates.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.candidates.length === 0 ? (
            <div
              className={cn(
                "flex h-32 flex-col items-center justify-center rounded-lg",
                "border-2 border-dashed border-border/60",
                "text-center text-sm text-muted-foreground/70",
                isOver && "border-primary/40 bg-primary/5"
              )}
            >
              <Icon className="h-6 w-6 mb-2 opacity-40" />
              <p className="text-xs">Drop candidates here</p>
            </div>
          ) : (
            column.candidates.map((candidate) => (
              <SortableCandidateItem key={candidate.id} candidate={candidate} />
            ))
          )}
        </SortableContext>
      </div>

      {/* Footer Stats (optional subtle info) */}
      <div
        className={cn(
          "px-4 py-2 border-t border-border/30",
          "text-[10px] text-muted-foreground/60",
          config.bgClass
        )}
      >
        {column.count} candidate{column.count !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
