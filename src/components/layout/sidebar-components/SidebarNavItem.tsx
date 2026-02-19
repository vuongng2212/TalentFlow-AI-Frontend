import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { NavTooltip } from "./NavTooltip";
import { NavItem, isNavItemActive } from "./nav-config";

interface SidebarNavItemProps {
  item: NavItem;
  pathname: string;
  collapsed: boolean;
  index: number;
}

export const SidebarNavItem = React.memo(function SidebarNavItem({
  item,
  pathname,
  collapsed,
  index,
}: SidebarNavItemProps) {
  const isActive = isNavItemActive(pathname, item.href);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={cn(
        "group relative flex items-center rounded-lg",
        "text-sm font-medium",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        collapsed
          ? "justify-center h-11 w-11 mx-auto"
          : "gap-3 px-3 py-2.5",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {/* Active indicator bar */}
      <span
        aria-hidden
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2",
          "h-6 w-1 rounded-r-full",
          "bg-gradient-to-b from-primary to-indigo-500",
          "transition-all duration-200",
          isActive
            ? "opacity-100 scale-y-100"
            : "opacity-0 scale-y-50 group-hover:opacity-40 group-hover:scale-y-75"
        )}
      />

      {/* Icon */}
      <div
        className={cn(
          "flex items-center justify-center",
          "transition-transform duration-200",
          "group-hover:scale-110",
          "h-5 w-5"
        )}
      >
        <Icon className="h-[18px] w-[18px]" />
      </div>

      {/* Label */}
      {!collapsed ? <span className="flex-1 truncate">{item.label}</span> : null}

      {/* Badge */}
      {!collapsed && item.badge ? (
        <Badge
          variant={isActive ? "default" : "secondary"}
          className="h-5 min-w-5 px-1.5 text-[10px] font-semibold"
        >
          {item.badge}
        </Badge>
      ) : null}

      {/* Collapsed Tooltip */}
      <NavTooltip visible={collapsed} label={item.label} badge={item.badge} />
    </Link>
  );
});
