import Link from "next/link";
import { cn } from "@/lib/utils";
import { ROUTES, APP_NAME } from "@/lib/constants";
import { Sparkles, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavTooltip } from "./NavTooltip";

interface SidebarHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function SidebarHeader({ collapsed, onToggle }: SidebarHeaderProps) {
  return (
    <div
      className={cn(
        "flex h-16 items-center justify-between",
        "border-b border-border/50",
        "px-3"
      )}
    >
      <Link
        href={ROUTES.DASHBOARD}
        className={cn(
          "group relative flex items-center rounded-lg",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          collapsed ? "justify-center p-1" : "gap-2.5 px-2 py-1"
        )}
        title={collapsed ? APP_NAME : undefined}
      >
        {/* Logo Icon */}
        <div
          className={cn(
            "relative flex items-center justify-center rounded-xl",
            "bg-gradient-to-br from-primary via-indigo-500 to-purple-500",
            "shadow-soft-sm",
            "transition-transform duration-200 group-hover:scale-105",
            collapsed ? "h-10 w-10" : "h-9 w-9"
          )}
        >
          <Sparkles className="h-5 w-5 text-white" />
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-xl bg-primary/30 blur-md -z-10" />
        </div>

        {/* App Name */}
        {!collapsed ? (
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight bg-gradient-to-r from-primary via-indigo-500 to-purple-500 bg-clip-text text-transparent">
              {APP_NAME}
            </span>
            <span className="text-[9px] text-muted-foreground font-medium -mt-0.5">
              AI-Powered ATS
            </span>
          </div>
        ) : null}

        <NavTooltip visible={collapsed} label={APP_NAME} />
      </Link>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
        className={cn(
          "h-8 w-8 text-muted-foreground hover:text-foreground",
          "transition-transform duration-200",
          collapsed && "rotate-180"
        )}
      >
        {collapsed ? (
          <PanelLeftOpen className="h-4 w-4" />
        ) : (
          <PanelLeftClose className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
