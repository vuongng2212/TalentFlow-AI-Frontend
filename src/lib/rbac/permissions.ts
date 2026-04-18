import { ROUTES } from "@/lib/constants";
import type { UserRole } from "@/types";

export type AppAction =
  | "jobs:create"
  | "jobs:update"
  | "jobs:delete"
  | "applications:update"
  | "applications:updateStage"
  | "applications:delete"
  | "interviews:create"
  | "interviews:update"
  | "interviews:cancel"
  | "upload:create"
  | "users:manage";

export const ALL_ROLES: UserRole[] = ["ADMIN", "RECRUITER", "INTERVIEWER"];

export const routePermissions: Record<string, UserRole[]> = {
  [ROUTES.DASHBOARD]: ["ADMIN", "RECRUITER"],
  [ROUTES.JOBS]: ALL_ROLES,
  [ROUTES.CANDIDATES]: ALL_ROLES,
  [ROUTES.APPLICATIONS]: ["ADMIN", "RECRUITER"],
  [ROUTES.INTERVIEWS]: ALL_ROLES,
  [ROUTES.ANALYTICS]: ["ADMIN", "RECRUITER"],
  [ROUTES.UPLOAD]: ["ADMIN", "RECRUITER"],
  [ROUTES.SETTINGS]: ALL_ROLES,
  [ROUTES.USERS]: ["ADMIN"],
};

export const actionPermissions: Record<AppAction, UserRole[]> = {
  "jobs:create": ["ADMIN", "RECRUITER"],
  "jobs:update": ["ADMIN", "RECRUITER"],
  "jobs:delete": ["ADMIN", "RECRUITER"],
  "applications:update": ["ADMIN", "RECRUITER"],
  "applications:updateStage": ["ADMIN", "RECRUITER"],
  "applications:delete": ["ADMIN"],
  "interviews:create": ["ADMIN", "RECRUITER"],
  "interviews:update": ["ADMIN", "RECRUITER"],
  "interviews:cancel": ["ADMIN", "RECRUITER"],
  "upload:create": ["ADMIN", "RECRUITER"],
  "users:manage": ["ADMIN"],
};

export function isRoleAllowed(
  role: UserRole | null | undefined,
  allowedRoles: UserRole[],
): boolean {
  return Boolean(role && allowedRoles.includes(role));
}

function getBestMatchedRoute(pathname: string): string | null {
  const candidates = Object.keys(routePermissions)
    .filter((route) => pathname === route || pathname.startsWith(`${route}/`))
    .sort((a, b) => b.length - a.length);

  return candidates[0] ?? null;
}

export function canAccessRoute(
  role: UserRole | null | undefined,
  pathname: string,
): boolean {
  if (!role) return false;

  const matchedRoute = getBestMatchedRoute(pathname);
  const isUnregisteredDashboardSubRoute =
    matchedRoute === ROUTES.DASHBOARD && pathname !== ROUTES.DASHBOARD;

  if (!matchedRoute || isUnregisteredDashboardSubRoute) {
    return !pathname.startsWith(ROUTES.DASHBOARD);
  }

  return isRoleAllowed(role, routePermissions[matchedRoute]);
}

export function canPerformAction(
  role: UserRole | null | undefined,
  action: AppAction,
): boolean {
  return isRoleAllowed(role, actionPermissions[action]);
}

export function getDefaultDashboardRoute(
  role: UserRole | null | undefined,
): string {
  if (!role) return ROUTES.DASHBOARD;

  const preferredRoutes = [
    ROUTES.DASHBOARD,
    ROUTES.JOBS,
    ROUTES.CANDIDATES,
    ROUTES.INTERVIEWS,
    ROUTES.SETTINGS,
  ];

  const firstAllowed = preferredRoutes.find((route) => canAccessRoute(role, route));
  return firstAllowed ?? ROUTES.DASHBOARD;
}
