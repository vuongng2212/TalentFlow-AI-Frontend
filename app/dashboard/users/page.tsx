"use client";

import { AccessDeniedState } from "@/components/auth/RoleGate";
import { TeamTab } from "@/components/settings";
import { canPerformAction } from "@/lib/rbac/permissions";
import { useAuthStore } from "@/store/auth-store";

export default function UsersPage() {
  const role = useAuthStore((state) => state.user?.role);
  const canManageUsers = canPerformAction(role, "users:manage");

  if (!canManageUsers) {
    return <AccessDeniedState />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage team member access and roles.
        </p>
      </div>

      <TeamTab />
    </div>
  );
}
