"use client";

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
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const navItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: ROUTES.DASHBOARD,
  },
  {
    icon: Upload,
    label: "Upload CV",
    href: "/dashboard/upload",
  },
  {
    icon: Briefcase,
    label: "Jobs",
    href: ROUTES.JOBS,
  },
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
  {
    icon: BarChart3,
    label: "Analytics",
    href: ROUTES.ANALYTICS,
  },
  {
    icon: Settings,
    label: "Settings",
    href: ROUTES.SETTINGS,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-purple flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            {APP_NAME}
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-smooth",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <Badge variant={isActive ? "secondary" : "outline"}>
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent transition-smooth">
          <Avatar
            src={user?.avatar}
            alt={user?.fullName}
            fallback={user?.fullName?.charAt(0)}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.fullName}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.role}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-smooth"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
