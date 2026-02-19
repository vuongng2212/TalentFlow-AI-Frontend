"use client";

import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  KanbanSkeleton,
  CandidateStatsCards,
  CandidateSearchBar,
  CandidateListView,
  PipelineOverview,
  ViewModeToggle,
  type ScoreFilter,
  type ViewMode,
} from "@/components/candidates";
import { mockKanbanColumns } from "@/lib/mock-data";
import type { KanbanColumn as KanbanColumnType } from "@/types";

// Dynamic import for KanbanBoard - code-splits @dnd-kit from initial bundle
const KanbanBoard = dynamic(
  () => import("@/components/candidates/KanbanBoard"),
  {
    ssr: false,
    loading: () => <KanbanSkeleton />,
  }
);

// Preload function for hover optimization
const preloadKanbanBoard = () => {
  void import("@/components/candidates/KanbanBoard");
};

export default function CandidatesPage() {
  const [columns, setColumns] = useState<KanbanColumnType[]>(mockKanbanColumns);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");

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

  // Calculate stats
  const totalCandidates = columns.reduce((acc, col) => acc + col.count, 0);
  const filteredTotal = filteredColumns.reduce((acc, col) => acc + col.count, 0);
  const inProgressCount = columns
    .filter((col) => !["HIRED", "REJECTED"].includes(col.id))
    .reduce((acc, col) => acc + col.count, 0);
  const hiredCount = columns.find((col) => col.id === "HIRED")?.count || 0;

  const hasActiveFilters = searchQuery !== "" || scoreFilter !== "all";

  // Stable callbacks
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleShowFiltersChange = useCallback((show: boolean) => {
    setShowFilters(show);
  }, []);

  const handleScoreFilterChange = useCallback((filter: ScoreFilter) => {
    setScoreFilter(filter);
  }, []);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setScoreFilter("all");
    setShowFilters(false);
  }, []);

  // Get all candidates for list view
  const allFilteredCandidates = useMemo(() => {
    return filteredColumns.flatMap((col) => col.candidates);
  }, [filteredColumns]);

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
          <ViewModeToggle
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            onPreloadKanban={preloadKanbanBoard}
          />
        </div>

        {/* Search & Filters Bar */}
        <CandidateSearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          showFilters={showFilters}
          onShowFiltersChange={handleShowFiltersChange}
          scoreFilter={scoreFilter}
          onScoreFilterChange={handleScoreFilterChange}
          filteredTotal={filteredTotal}
          totalCandidates={totalCandidates}
        />

        {/* Quick Stats */}
        <CandidateStatsCards
          totalCandidates={totalCandidates}
          inProgressCount={inProgressCount}
          hiredCount={hiredCount}
        />

        {/* Kanban Board or List View */}
        {viewMode === "kanban" ? (
          <KanbanBoard columns={filteredColumns} onColumnsChange={setColumns} />
        ) : (
          <CandidateListView
            candidates={allFilteredCandidates}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={handleClearFilters}
          />
        )}

        {/* Pipeline Summary */}
        <PipelineOverview columns={columns} totalCandidates={totalCandidates} />
      </div>
    </TooltipProvider>
  );
}
