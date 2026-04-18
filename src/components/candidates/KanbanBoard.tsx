"use client";

import { useCallback, useState } from "react";
import { KanbanColumn } from "@/components/candidates/KanbanColumn";
import { CandidateCardOverlay } from "@/components/candidates/CandidateCard";
import type {
  CandidateViewModel,
  ApplicationStage,
  KanbanColumn as KanbanColumnType,
} from "@/types";
import { toast } from "sonner";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";

interface KanbanBoardProps {
  columns: KanbanColumnType[];
  onColumnsChange: (columns: KanbanColumnType[]) => void;
  onStageDrop?: (candidateId: string, newStage: ApplicationStage) => void;
  className?: string;
  canDrag?: boolean;
}

export function KanbanBoard({
  columns,
  onColumnsChange,
  onStageDrop,
  className,
  canDrag = true,
}: KanbanBoardProps) {
  const [activeCandidate, setActiveCandidate] =
    useState<CandidateViewModel | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      if (!canDrag) return;

      const { active } = event;
      const candidate = columns
        .flatMap((col) => col.candidates)
        .find((c) => c.id === active.id);
      setActiveCandidate(candidate || null);
    },
    [canDrag, columns],
  );

  const handleDragOver = useCallback(() => {
    // Optional: Add visual feedback during drag
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (!canDrag) return;

      const { active, over } = event;
      setActiveCandidate(null);

      if (!over) return;

      const candidateId = active.id as string;
      const newStage = over.id as ApplicationStage;

      // Find current column
      const sourceColumn = columns.find((col) =>
        col.candidates.some((c) => c.id === candidateId),
      );

      if (!sourceColumn || sourceColumn.id === newStage) return;

      // Move candidate
      const candidate = sourceColumn.candidates.find(
        (c) => c.id === candidateId,
      );
      if (!candidate) return;

      const newColumns = columns.map((col) => {
        if (col.id === sourceColumn.id) {
          return {
            ...col,
            candidates: col.candidates.filter((c) => c.id !== candidateId),
            count: col.count - 1,
          };
        }
        if (col.id === newStage) {
          return {
            ...col,
            candidates: [...col.candidates, { ...candidate, stage: newStage }],
            count: col.count + 1,
          };
        }
        return col;
      });

      onColumnsChange(newColumns);
      onStageDrop?.(candidateId, newStage);

      // Show toast notification
      toast.success(
        `${candidate.fullName} moved to ${newStage.toLowerCase()}`,
        {
          description: `Successfully updated candidate pipeline stage.`,
          duration: 3000,
        },
      );
    },
    [canDrag, columns, onColumnsChange, onStageDrop],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={canDrag ? handleDragStart : undefined}
      onDragOver={canDrag ? handleDragOver : undefined}
      onDragEnd={canDrag ? handleDragEnd : undefined}
    >
      <div
        className={`flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 min-h-125 ${className ?? ""}`}
      >
        {columns.map((column, index) => (
          <div
            key={column.id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <KanbanColumn column={column} canDrag={canDrag} />
          </div>
        ))}
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeCandidate ? (
          <CandidateCardOverlay candidate={activeCandidate} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default KanbanBoard;
