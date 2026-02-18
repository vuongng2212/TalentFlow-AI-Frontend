"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { KanbanColumn } from "@/components/candidates/KanbanColumn";
import { CandidateCardOverlay } from "@/components/candidates/CandidateCard";
import { mockKanbanColumns } from "@/lib/mock-data";
import type { Candidate, ApplicationStage, KanbanColumn as KanbanColumnType } from "@/types";
import {
  Upload,
  Users,
  TrendingUp,
  Clock,
  Search,
  X,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Keyboard,
  UserSearch,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [scoreFilter, setScoreFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Filter columns based on search and score
  const filteredColumns = useMemo(() => {
    return columns.map((col) => ({
      ...col,
      candidates: col.candidates.filter((candidate) => {
        // Search filter
        const matchesSearch =
          searchQuery === "" ||
          candidate.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          candidate.appliedPosition.toLowerCase().includes(searchQuery.toLowerCase()) ||
          candidate.email?.toLowerCase().includes(searchQuery.toLowerCase());

        // Score filter
        let matchesScore = true;
        if (scoreFilter !== "all" && candidate.aiScore) {
          if (scoreFilter === "high") matchesScore = candidate.aiScore >= 85;
          else if (scoreFilter === "medium")
            matchesScore = candidate.aiScore >= 70 && candidate.aiScore < 85;
          else if (scoreFilter === "low") matchesScore = candidate.aiScore < 70;
        }

        return matchesSearch && matchesScore;
      }),
      count: col.candidates.filter((candidate) => {
        const matchesSearch =
          searchQuery === "" ||
          candidate.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          candidate.appliedPosition.toLowerCase().includes(searchQuery.toLowerCase());
        let matchesScore = true;
        if (scoreFilter !== "all" && candidate.aiScore) {
          if (scoreFilter === "high") matchesScore = candidate.aiScore >= 85;
          else if (scoreFilter === "medium")
            matchesScore = candidate.aiScore >= 70 && candidate.aiScore < 85;
          else if (scoreFilter === "low") matchesScore = candidate.aiScore < 70;
        }
        return matchesSearch && matchesScore;
      }).length,
    }));
  }, [columns, searchQuery, scoreFilter]);

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
  const filteredTotal = filteredColumns.reduce((acc, col) => acc + col.count, 0);
  const inProgressCount = columns
    .filter((col) => !["HIRED", "REJECTED"].includes(col.id))
    .reduce((acc, col) => acc + col.count, 0);
  const hiredCount = columns.find((col) => col.id === "HIRED")?.count || 0;

  const clearFilters = () => {
    setSearchQuery("");
    setScoreFilter("all");
    setShowFilters(false);
  };

  const hasActiveFilters = searchQuery !== "" || scoreFilter !== "all";

  // Get all candidates for list view
  const allFilteredCandidates = useMemo(() => {
    return filteredColumns.flatMap((col) => col.candidates);
  }, [filteredColumns]);

  return (
    <TooltipProvider delayDuration={300}>
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
          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg border border-border/60 p-0.5 bg-muted/30">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setViewMode("kanban")}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === "kanban"
                      ? "bg-background shadow-soft-sm text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Kanban View</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === "list"
                      ? "bg-background shadow-soft-sm text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>List View</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Keyboard Shortcuts Hint */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                <Keyboard className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-50">
              <div className="space-y-1 text-xs">
                <p className="font-medium mb-2">Keyboard Shortcuts</p>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Search</span>
                  <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">⌘K</kbd>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Toggle View</span>
                  <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">⌘V</kbd>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Clear Filters</span>
                  <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Esc</kbd>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>

          <Link href="/dashboard/upload">
            <Button size="sm" className="gap-2 shadow-soft-sm hover:shadow-primary transition-shadow">
              <Upload className="h-3.5 w-3.5" />
              Upload CV
            </Button>
          </Link>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <Card className="shadow-soft-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search candidates by name, position, or email..."
                className="pl-10 pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter Toggle & Quick Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                className="gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                    Active
                  </Badge>
                )}
              </Button>

              {/* Score Quick Filters */}
              <div className="flex items-center gap-1 border-l pl-2 ml-1">
                <span className="text-xs text-muted-foreground mr-1">AI Score:</span>
                {(["all", "high", "medium", "low"] as const).map((filter) => (
                  <Button
                    key={filter}
                    variant={scoreFilter === filter ? "default" : "ghost"}
                    size="sm"
                    className="h-7 px-2 text-xs capitalize"
                    onClick={() => setScoreFilter(filter)}
                  >
                    {filter === "all" ? "All" : filter === "high" ? "85%+" : filter === "medium" ? "70-84%" : "<70%"}
                  </Button>
                ))}
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                  onClick={clearFilters}
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Filter Results Info */}
          {hasActiveFilters && (
            <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Showing <strong className="text-foreground">{filteredTotal}</strong> of{" "}
                <strong className="text-foreground">{totalCandidates}</strong> candidates
              </span>
              {searchQuery && (
                <span>
                  Search: "<strong className="text-foreground">{searchQuery}</strong>"
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

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
      {viewMode === "kanban" ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 min-h-125">
            {filteredColumns.map((column, index) => (
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
      ) : (
        /* List View */
        <Card className="shadow-soft-sm">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                All Candidates ({filteredTotal})
              </CardTitle>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Sort by:</span>
                <select className="bg-transparent border-none text-xs font-medium text-foreground focus:outline-none cursor-pointer">
                  <option>AI Score</option>
                  <option>Name</option>
                  <option>Applied Date</option>
                  <option>Stage</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {allFilteredCandidates.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <UserSearch className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-semibold mb-1">No candidates found</h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-4">
                  {hasActiveFilters
                    ? "Try adjusting your search or filter criteria to find candidates."
                    : "Start by uploading CVs to build your candidate pipeline."}
                </p>
                {hasActiveFilters ? (
                  <Button variant="outline" size="sm" onClick={clearFilters} className="gap-2">
                    <X className="h-3.5 w-3.5" />
                    Clear Filters
                  </Button>
                ) : (
                  <Link href="/dashboard/upload">
                    <Button size="sm" className="gap-2">
                      <Upload className="h-3.5 w-3.5" />
                      Upload CV
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {allFilteredCandidates.map((candidate, index) => {
                  const stageColorMap: Record<ApplicationStage, string> = {
                    APPLIED: "bg-blue-500/10 text-blue-600 border-blue-200",
                    SCREENING: "bg-amber-500/10 text-amber-600 border-amber-200",
                    INTERVIEW: "bg-purple-500/10 text-purple-600 border-purple-200",
                    OFFER: "bg-teal-500/10 text-teal-600 border-teal-200",
                    HIRED: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
                    REJECTED: "bg-rose-500/10 text-rose-600 border-rose-200",
                  };
                  return (
                    <Link
                      key={candidate.id}
                      href={`/dashboard/candidates/${candidate.id}`}
                      className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors group animate-fade-in"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
                        {candidate.fullName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                          {candidate.fullName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {candidate.appliedPosition}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-2 py-0.5 ${stageColorMap[candidate.stage]}`}
                      >
                        {candidate.stage}
                      </Badge>
                      {candidate.aiScore && (
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              candidate.aiScore >= 85
                                ? "bg-emerald-500"
                                : candidate.aiScore >= 70
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                          />
                          <span className="text-xs font-medium tabular-nums">
                            {candidate.aiScore}%
                          </span>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
    </TooltipProvider>
  );
}
