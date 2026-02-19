import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, X, SlidersHorizontal } from "lucide-react";

export type ScoreFilter = "all" | "high" | "medium" | "low";

interface CandidateSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showFilters: boolean;
  onShowFiltersChange: (show: boolean) => void;
  scoreFilter: ScoreFilter;
  onScoreFilterChange: (filter: ScoreFilter) => void;
  filteredTotal: number;
  totalCandidates: number;
}

export function CandidateSearchBar({
  searchQuery,
  onSearchChange,
  showFilters,
  onShowFiltersChange,
  scoreFilter,
  onScoreFilterChange,
  filteredTotal,
  totalCandidates,
}: CandidateSearchBarProps) {
  const hasActiveFilters = searchQuery !== "" || scoreFilter !== "all";

  const clearFilters = () => {
    onSearchChange("");
    onScoreFilterChange("all");
    onShowFiltersChange(false);
  };

  return (
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
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchQuery ? (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          {/* Filter Toggle & Quick Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              className="gap-2"
              onClick={() => onShowFiltersChange(!showFilters)}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters
              {hasActiveFilters ? (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                  Active
                </Badge>
              ) : null}
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
                  onClick={() => onScoreFilterChange(filter)}
                >
                  {filter === "all"
                    ? "All"
                    : filter === "high"
                    ? "85%+"
                    : filter === "medium"
                    ? "70-84%"
                    : "<70%"}
                </Button>
              ))}
            </div>

            {/* Clear Filters */}
            {hasActiveFilters ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                onClick={clearFilters}
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            ) : null}
          </div>
        </div>

        {/* Filter Results Info */}
        {hasActiveFilters ? (
          <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Showing <strong className="text-foreground">{filteredTotal}</strong> of{" "}
              <strong className="text-foreground">{totalCandidates}</strong> candidates
            </span>
            {searchQuery ? (
              <span>
                Search: &quot;<strong className="text-foreground">{searchQuery}</strong>&quot;
              </span>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
