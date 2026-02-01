"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { mockKanbanColumns } from "@/lib/mock-data";
import type { Candidate, ApplicationStage, KanbanColumn } from "@/types";
import {
  Mail,
  Phone,
  FileText,
  Star,
  Upload,
  GripVertical,
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
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

export default function CandidatesPage() {
  const [columns, setColumns] = useState<KanbanColumn[]>(mockKanbanColumns);
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(
    null,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const candidate = columns
      .flatMap((col) => col.candidates)
      .find((c) => c.id === active.id);
    setActiveCandidate(candidate || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
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
    const candidate = sourceColumn.candidates.find((c) => c.id === candidateId);
    if (!candidate) return;

    setColumns((prev) =>
      prev.map((col) => {
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
      }),
    );
  };

  const getStageColor = (stage: ApplicationStage): string => {
    const colors = {
      APPLIED: "bg-blue-500/10 border-blue-500/20",
      SCREENING: "bg-yellow-500/10 border-yellow-500/20",
      INTERVIEW: "bg-purple-500/10 border-purple-500/20",
      OFFER: "bg-green-500/10 border-green-500/20",
      HIRED: "bg-emerald-500/10 border-emerald-500/20",
      REJECTED: "bg-red-500/10 border-red-500/20",
    };
    return colors[stage];
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Candidates Pipeline</h1>
          <p className="text-muted-foreground mt-1">
            Drag and drop candidates to move them through stages
          </p>
        </div>
        <Link href="/dashboard/upload">
          <Button className="gap-2">
            <Upload className="h-4 w-4" />
            Upload CV
          </Button>
        </Link>
      </div>

      {/* Kanban Board with DnD */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <div key={column.id} className="shrink-0 w-80">
              <Card className={`h-full ${getStageColor(column.id)}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">
                      {column.title}
                    </CardTitle>
                    <Badge variant="secondary">{column.count}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Drop Zone */}
                  <div
                    id={column.id}
                    className="min-h-[200px]"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {}}
                  >
                    {column.candidates.length === 0 ? (
                      <div className="text-center py-8 text-sm text-muted-foreground">
                        Drop candidates here
                      </div>
                    ) : (
                      column.candidates.map((candidate) => (
                        <div
                          key={candidate.id}
                          id={candidate.id}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.effectAllowed = "move";
                            e.dataTransfer.setData("text/plain", candidate.id);
                          }}
                          className="mb-3 last:mb-0"
                        >
                          <Card className="p-4 hover:shadow-md transition-smooth cursor-grab active:cursor-grabbing group border-2 border-transparent hover:border-primary/20">
                            {/* Drag Handle */}
                            <div className="flex items-start gap-2 mb-3">
                              <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <Avatar
                                  src={candidate.avatar}
                                  alt={candidate.fullName}
                                  fallback={candidate.fullName.charAt(0)}
                                  size="md"
                                />
                                <div className="flex-1 min-w-0">
                                  <Link
                                    href={`/dashboard/candidates/${candidate.id}`}
                                    className="font-semibold truncate group-hover:text-primary transition-smooth block"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {candidate.fullName}
                                  </Link>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {candidate.appliedPosition}
                                  </p>
                                </div>
                                {candidate.aiScore && (
                                  <div className="flex items-center gap-1 text-xs font-medium flex-shrink-0">
                                    <Star className="h-3 w-3 text-yellow-500" />
                                    <span>{candidate.aiScore}%</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Candidate Info */}
                            <div className="space-y-1.5 text-xs text-muted-foreground mb-3">
                              {candidate.email && (
                                <div className="flex items-center gap-2 truncate">
                                  <Mail className="h-3 w-3 shrink-0" />
                                  <span className="truncate">
                                    {candidate.email}
                                  </span>
                                </div>
                              )}
                              {candidate.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-3 w-3 shrink-0" />
                                  <span>{candidate.phone}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <FileText className="h-3 w-3 shrink-0" />
                                <span>
                                  Applied{" "}
                                  {formatRelativeTime(candidate.appliedDate)}
                                </span>
                              </div>
                            </div>

                            {/* Skills */}
                            {candidate.skills &&
                              candidate.skills.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {candidate.skills.slice(0, 2).map((skill) => (
                                    <Badge
                                      key={skill}
                                      variant="outline"
                                      className="text-xs px-2 py-0"
                                    >
                                      {skill}
                                    </Badge>
                                  ))}
                                  {candidate.skills.length > 2 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs px-2 py-0"
                                    >
                                      +{candidate.skills.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              )}
                          </Card>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeCandidate && (
            <Card className="p-4 w-80 opacity-80 rotate-3 shadow-lg">
              <div className="flex items-start gap-3">
                <Avatar
                  src={activeCandidate.avatar}
                  alt={activeCandidate.fullName}
                  fallback={activeCandidate.fullName.charAt(0)}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold truncate">
                    {activeCandidate.fullName}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate">
                    {activeCandidate.appliedPosition}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </DragOverlay>
      </DndContext>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {columns.map((column) => (
              <div key={column.id} className="text-center">
                <div className="text-2xl font-bold">{column.count}</div>
                <div className="text-xs text-muted-foreground">
                  {column.title}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
