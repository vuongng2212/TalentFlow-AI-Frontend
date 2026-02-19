"use client";

import { useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import {
  SidebarHeader,
  SidebarNavItem,
  SidebarFooter,
  navItems,
} from "./sidebar-components";

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

  const handleToggle = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

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
      {/* Header - Logo & Toggle */}
      <SidebarHeader collapsed={collapsed} onToggle={handleToggle} />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item, index) => (
          <SidebarNavItem
            key={item.href}
            item={item}
            pathname={pathname}
            collapsed={collapsed}
            index={index}
          />
        ))}
      </nav>

      {/* Footer - User Profile & Logout */}
      <SidebarFooter
        user={user}
        collapsed={collapsed}
        onLogout={handleLogout}
      />
    </aside>
  );
}
