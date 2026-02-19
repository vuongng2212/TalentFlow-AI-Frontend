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

export interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: number;
}

export const navItems: NavItem[] = [
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

export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === ROUTES.DASHBOARD) {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
