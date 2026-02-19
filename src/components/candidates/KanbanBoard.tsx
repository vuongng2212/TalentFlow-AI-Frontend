"use client";

import { useCallback, useState } from "react";
import { KanbanColumn } from "@/components/candidates/KanbanColumn";
import { CandidateCardOverlay } from "@/components/candidates/CandidateCard";
import type { Candidate, ApplicationStage, KanbanColumn as KanbanColumnType } from "@/types";
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
  DragOverEvent,
} from "@dnd-kit/core";

interface KanbanBoardProps {
  columns: KanbanColumnType[];
  onColumnsChange: (columns: KanbanColumnType[]) => void;
  className?: string;
}

export function KanbanBoard({
  columns,
  onColumnsChange,
  className,
}: KanbanBoardProps) {
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const candidate = columns
      .flatMap((col) => col.candidates)
      .find((c) => c.id === active.id);
    setActiveCandidate(candidate || null);
  }, [columns]);

  const handleDragOver = useCallback(() => {
    // Optional: Add visual feedback during drag
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCandidate(null);

    if (!over) return;

    const candidateId = active.id as string;
    const newStage = over.id as ApplicationStage;

    // Find current column
    const sourceColumn = columns.find((col) =>
      col.candidates.some((c) => c.id === candidateId)
    );

    if (!sourceColumn || sourceColumn.id === newStage) return;

    // Move candidate
    const candidate = sourceColumn.candidates.find((c) => c.id === candidateId);
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

    // Show toast notification
    toast.success(`${candidate.fullName} moved to ${newStage.toLowerCase()}`, {
      description: `Successfully updated candidate pipeline stage.`,
      duration: 3000,
    });
  }, [columns, onColumnsChange]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className={`flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 min-h-125 ${className ?? ""}`}>
        {columns.map((column, index) => (
          <div
            key={column.id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <KanbanColumn column={column} />
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
