import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Upload, LayoutGrid, List, Keyboard } from "lucide-react";

export type ViewMode = "kanban" | "list";

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onPreloadKanban: () => void;
}

export function ViewModeToggle({
  viewMode,
  onViewModeChange,
  onPreloadKanban,
}: ViewModeToggleProps) {
  return (
    <div className="flex items-center gap-2">
      {/* View Mode Toggle */}
      <div className="flex items-center rounded-lg border border-border/60 p-0.5 bg-muted/30">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => onViewModeChange("kanban")}
              onMouseEnter={onPreloadKanban}
              onFocus={onPreloadKanban}
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
              onClick={() => onViewModeChange("list")}
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
        <Button
          size="sm"
          className="gap-2 shadow-soft-sm hover:shadow-primary transition-shadow"
        >
          <Upload className="h-3.5 w-3.5" />
          Upload CV
        </Button>
      </Link>
    </div>
  );
}
