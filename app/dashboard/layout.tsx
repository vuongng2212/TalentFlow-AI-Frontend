"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ROUTES } from "@/lib/constants";
import { canAccessRoute, getDefaultDashboardRoute } from "@/lib/rbac/permissions";
import { useAuthStore } from "@/store/auth-store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const role = useAuthStore((state) => state.user?.role);
  const isAuthLoading = useAuthStore((state) => state.isLoading);
  const isAuthInitialized = useAuthStore((state) => state.isInitialized);

  const canAccessCurrentRoute = useMemo(
    () => canAccessRoute(role, pathname),
    [role, pathname],
  );

  const redirectPath = useMemo(() => getDefaultDashboardRoute(role), [role]);

  useEffect(() => {
    if (!isAuthInitialized || isAuthLoading) {
      return;
    }

    if (!role) {
      router.replace(ROUTES.LOGIN);
      return;
    }

    if (canAccessCurrentRoute || pathname === redirectPath) {
      return;
    }

    router.replace(redirectPath);
  }, [
    isAuthInitialized,
    isAuthLoading,
    role,
    canAccessCurrentRoute,
    pathname,
    redirectPath,
    router,
  ]);

  if (!isAuthInitialized || isAuthLoading || !role || !canAccessCurrentRoute) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:block">
        <Sidebar />
      </aside>

      {/* Sidebar - Mobile Overlay */}
      {sidebarOpen ? (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 lg:hidden">
            <Sidebar />
          </aside>
        </>
      ) : null}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto bg-muted/30 p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
