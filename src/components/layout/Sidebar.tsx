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
