import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { NavTooltip } from "./NavTooltip";
import { User } from "@/types";

interface SidebarFooterProps {
  user: User | null;
  collapsed: boolean;
  onLogout: () => void;
}

export function SidebarFooter({
  user,
  collapsed,
  onLogout,
}: SidebarFooterProps) {
  return (
    <div className="border-t border-border/50 p-3 space-y-2">
      {/* User Info */}
      <div
        className={cn(
          "group relative flex items-center rounded-lg",
          "transition-colors duration-200",
          "hover:bg-accent/50",
          collapsed ? "justify-center p-2" : "gap-3 p-2"
        )}
      >
        <Avatar
          src={user?.avatar}
          alt={user?.fullName}
          fallback={user?.fullName?.charAt(0)}
          size="md"
          className="ring-2 ring-background shadow-soft-xs"
        />

        {!collapsed ? (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user?.fullName}</p>
            <p className="truncate text-xs text-muted-foreground capitalize">
              {user?.role?.toLowerCase()}
            </p>
          </div>
        ) : null}

        <NavTooltip visible={collapsed} label={user?.fullName || "User"} />
      </div>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        title={collapsed ? "Logout" : undefined}
        className={cn(
          "group relative flex w-full items-center rounded-lg",
          "text-sm font-medium text-muted-foreground",
          "transition-all duration-200",
          "hover:bg-destructive/10 hover:text-destructive",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive",
          collapsed ? "justify-center h-10 w-10 mx-auto" : "gap-3 px-3 py-2"
        )}
      >
        <LogOut className="h-[18px] w-[18px] transition-transform duration-200 group-hover:-translate-x-0.5" />
        {!collapsed ? <span>Logout</span> : null}
        <NavTooltip visible={collapsed} label="Logout" />
      </button>
    </div>
  );
}
