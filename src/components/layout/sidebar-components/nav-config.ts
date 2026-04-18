import { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Upload,
} from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { canAccessRoute } from "@/lib/rbac/permissions";
import type { UserRole } from "@/types";

export interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: number;
  allowedRoles?: UserRole[];
}

export const navItems: NavItem[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: ROUTES.DASHBOARD,
    allowedRoles: ["ADMIN", "RECRUITER"],
  },
  {
    icon: Upload,
    label: "Upload CV",
    href: ROUTES.UPLOAD,
    allowedRoles: ["ADMIN", "RECRUITER"],
  },
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
  {
    icon: BarChart3,
    label: "Analytics",
    href: ROUTES.ANALYTICS,
    allowedRoles: ["ADMIN", "RECRUITER"],
  },
  {
    icon: Users,
    label: "Users",
    href: ROUTES.USERS,
    allowedRoles: ["ADMIN"],
  },
  { icon: Settings, label: "Settings", href: ROUTES.SETTINGS },
];

export function getNavItemsForRole(role: UserRole | null | undefined): NavItem[] {
  if (!role) return [];

  return navItems.filter((item) => {
    if (item.allowedRoles) {
      return item.allowedRoles.includes(role);
    }

    return canAccessRoute(role, item.href);
  });
}

export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === ROUTES.DASHBOARD) {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
