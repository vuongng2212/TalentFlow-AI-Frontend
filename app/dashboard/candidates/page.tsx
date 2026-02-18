"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KanbanColumn } from "@/components/candidates/KanbanColumn";
import { CandidateCardOverlay } from "@/components/candidates/CandidateCard";
import { mockKanbanColumns } from "@/lib/mock-data";
import type { Candidate, ApplicationStage, KanbanColumn as KanbanColumnType } from "@/types";
import { Upload, Users, TrendingUp, Clock, Filter, Search } from "lucide-react";
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

export default function CandidatesPage() {
  const [columns, setColumns] = useState<KanbanColumnType[]>(mockKanbanColumns);
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

  const handleDragOver = useCallback((event: DragOverEvent) => {
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
      })
    );

    // Show toast notification
    toast.success(`${candidate.fullName} moved to ${newStage.toLowerCase()}`, {
      description: `Successfully updated candidate pipeline stage.`,
      duration: 3000,
    });
  }, [columns]);

  // Calculate stats
  const totalCandidates = columns.reduce((acc, col) => acc + col.count, 0);
  const inProgressCount = columns
    .filter((col) => !["HIRED", "REJECTED"].includes(col.id))
    .reduce((acc, col) => acc + col.count, 0);
  const hiredCount = columns.find((col) => col.id === "HIRED")?.count || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Candidates Pipeline
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Drag and drop candidates to move them through hiring stages
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Search className="h-3.5 w-3.5" />
            Search
          </Button>
          <Link href="/dashboard/upload">
            <Button size="sm" className="gap-2 shadow-soft-sm hover:shadow-primary transition-shadow">
              <Upload className="h-3.5 w-3.5" />
              Upload CV
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-soft-sm hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums">{totalCandidates}</p>
                <p className="text-xs text-muted-foreground">Total Candidates</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft-sm hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums">{inProgressCount}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft-sm hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums">{hiredCount}</p>
                <p className="text-xs text-muted-foreground">Hired</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft-sm hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                <Badge variant="outline" className="h-10 w-10 text-lg font-bold border-purple-500/30 text-purple-500">
                  {totalCandidates > 0 ? Math.round((hiredCount / totalCandidates) * 100) : 0}%
                </Badge>
              </div>
              <div>
                <p className="text-sm font-semibold">Conversion</p>
                <p className="text-xs text-muted-foreground">Hire Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2">
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
          {activeCandidate && (
            <CandidateCardOverlay candidate={activeCandidate} />
          )}
        </DragOverlay>
      </DndContext>

      {/* Pipeline Summary */}
      <Card className="shadow-soft-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            Pipeline Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-1 h-3 rounded-full overflow-hidden bg-muted">
            {columns
              .filter((col) => col.count > 0)
              .map((column) => {
                const percentage = (column.count / totalCandidates) * 100;
                const colorMap: Record<ApplicationStage, string> = {
                  APPLIED: "bg-blue-500",
                  SCREENING: "bg-amber-500",
                  INTERVIEW: "bg-purple-500",
                  OFFER: "bg-teal-500",
                  HIRED: "bg-emerald-500",
                  REJECTED: "bg-rose-500",
                };
                return (
                  <div
                    key={column.id}
                    className={`h-full transition-all duration-500 ${colorMap[column.id]}`}
                    style={{ width: `${percentage}%` }}
                    title={`${column.title}: ${column.count}`}
                  />
                );
              })}
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            {columns.map((column) => {
              const colorMap: Record<ApplicationStage, string> = {
                APPLIED: "bg-blue-500",
                SCREENING: "bg-amber-500",
                INTERVIEW: "bg-purple-500",
                OFFER: "bg-teal-500",
                HIRED: "bg-emerald-500",
                REJECTED: "bg-rose-500",
              };
              return (
                <div key={column.id} className="flex items-center gap-2 text-xs">
                  <div className={`h-2.5 w-2.5 rounded-full ${colorMap[column.id]}`} />
                  <span className="text-muted-foreground">{column.title}</span>
                  <span className="font-semibold tabular-nums">{column.count}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
