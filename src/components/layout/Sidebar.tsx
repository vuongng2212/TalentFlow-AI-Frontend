"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ROUTES, APP_NAME } from "@/lib/constants";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Upload,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: ROUTES.DASHBOARD },
  { icon: Upload, label: "Upload CV", href: "/dashboard/upload" },
  { icon: Briefcase, label: "Jobs", href: ROUTES.JOBS },
  {
    icon: Users,
    label: "Candidates",
    href: ROUTES.CANDIDATES,
    badge: 8,
  },
  {
    icon: Calendar,
    label: "Interviews",
    href: ROUTES.INTERVIEWS,
    badge: 3,
  },
  { icon: BarChart3, label: "Analytics", href: ROUTES.ANALYTICS },
  { icon: Settings, label: "Settings", href: ROUTES.SETTINGS },
];

function isNavItemActive(pathname: string, href: string): boolean {
  if (href === ROUTES.DASHBOARD) {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Tooltip component for collapsed state
function NavTooltip({
  visible,
  label,
  badge,
}: {
  visible: boolean;
  label: string;
  badge?: number;
}) {
  if (!visible) return null;

  return (
    <div
      role="tooltip"
      className={cn(
        "pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2",
        "flex items-center gap-2",
        "rounded-lg border border-border bg-popover px-3 py-1.5",
        "text-sm font-medium text-popover-foreground",
        "shadow-soft-md",
        "opacity-0 scale-95 transition-all duration-150",
        "group-hover:opacity-100 group-hover:scale-100",
        "group-focus-within:opacity-100 group-focus-within:scale-100"
      )}
    >
      {label}
      {badge && (
        <Badge variant="default" className="h-4 min-w-4 px-1 text-[9px]">
          {badge}
        </Badge>
      )}
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname() ?? "";
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = useCallback(() => {
    toast.info("Logging out...", { duration: 1500 });
    setTimeout(() => {
      logout();
    }, 500);
  }, [logout]);

  return (
    <aside
      className={cn(
        "flex h-full flex-col",
        "border-r border-border/60 bg-card/98",
        "shadow-soft-sm",
        "transition-[width] duration-300 ease-out",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* ============================================ */}
      {/* HEADER - Logo & Toggle                      */}
      {/* ============================================ */}
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
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight bg-gradient-to-r from-primary via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                {APP_NAME}
              </span>
              <span className="text-[9px] text-muted-foreground font-medium -mt-0.5">
                AI-Powered ATS
              </span>
            </div>
          )}

          <NavTooltip visible={collapsed} label={APP_NAME} />
        </Link>

        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed((prev) => !prev)}
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

      {/* ============================================ */}
      {/* NAVIGATION                                  */}
      {/* ============================================ */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item, index) => {
          const isActive = isNavItemActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "group relative flex items-center rounded-lg",
                "text-sm font-medium",
                "transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                collapsed ? "justify-center h-11 w-11 mx-auto" : "gap-3 px-3 py-2.5",
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
                  collapsed ? "h-5 w-5" : "h-5 w-5"
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
              </div>

              {/* Label */}
              {!collapsed && (
                <span className="flex-1 truncate">{item.label}</span>
              )}

              {/* Badge */}
              {!collapsed && item.badge && (
                <Badge
                  variant={isActive ? "default" : "secondary"}
                  className="h-5 min-w-5 px-1.5 text-[10px] font-semibold"
                >
                  {item.badge}
                </Badge>
              )}

              {/* Collapsed Tooltip */}
              <NavTooltip
                visible={collapsed}
                label={item.label}
                badge={item.badge}
              />
            </Link>
          );
        })}
      </nav>

      {/* ============================================ */}
      {/* FOOTER - User Profile & Logout              */}
      {/* ============================================ */}
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

          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user?.fullName}</p>
              <p className="truncate text-xs text-muted-foreground capitalize">
                {user?.role?.toLowerCase()}
              </p>
            </div>
          )}

          <NavTooltip visible={collapsed} label={user?.fullName || "User"} />
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
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
          {!collapsed && <span>Logout</span>}
          <NavTooltip visible={collapsed} label="Logout" />
        </button>
      </div>
    </aside>
  );
}
