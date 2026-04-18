"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";
import { isRoleAllowed } from "@/lib/rbac/permissions";
import { useAuthStore } from "@/store/auth-store";
import type { UserRole } from "@/types";

interface RoleGateProps {
  allowedRoles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function AccessDeniedState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <ShieldAlert className="h-10 w-10 text-destructive" />
        <h2 className="text-xl font-semibold">Access denied</h2>
        <p className="max-w-md text-muted-foreground">
          You don&apos;t have permission to view this page.
        </p>
        <Link href={ROUTES.DASHBOARD}>
          <Button>Go to dashboard</Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export function RoleGate({ allowedRoles, children, fallback }: RoleGateProps) {
  const role = useAuthStore((state) => state.user?.role);

  if (isRoleAllowed(role, allowedRoles)) {
    return <>{children}</>;
  }

  return <>{fallback ?? <AccessDeniedState />}</>;
}
