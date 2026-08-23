"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { User, Workspace, AuthContextProps } from "../../../types";
import { authService } from "../../../services/api/auth.service";
import { workspaceService } from "../../../services/api/workspace.service";
import { userService } from "../../../services/api/user.service";
import { setActiveWorkspaceId } from "../../../lib/api-client";
import { useRouter, usePathname } from "next/navigation";

type LoginCredentials = {
  email: string;
  password: string;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const hasCheckedAuthRef = useRef(false);

  const loadWorkspaces = useCallback(async () => {
    try {
      const list = await workspaceService.listMyWorkspaces();
      setWorkspaces(list);
      return list;
    } catch {
      setWorkspaces([]);
      return [];
    }
  }, []);

  const syncActiveWorkspace = useCallback(
    async (currentUser: User, workspaceList: Workspace[]) => {
      const targetId = currentUser.activeWorkspaceId;
      if (!targetId) {
        setActiveWorkspace(null);
        setActiveWorkspaceId(null);
        return;
      }

      // Try to find in the already-loaded list first (no extra round-trip)
      let ws = workspaceList.find((w) => w.id === targetId) ?? null;

      if (!ws) {
        try {
          ws = await workspaceService.getWorkspace(targetId);
        } catch {
          ws = null;
        }
      }

      setActiveWorkspace(ws);
      setActiveWorkspaceId(ws?.id ?? null);
    },
    [],
  );

  const fetchUser = useCallback(async () => {
    if (isLoading && hasCheckedAuthRef.current) return;
    setIsLoading(true);
    try {
      const response = await authService.getCurrentUser();
      const currentUser = response.user;
      setUser(currentUser);

      // Load workspaces in parallel with active workspace sync
      const list = await loadWorkspaces();
      await syncActiveWorkspace(currentUser, list);
    } catch {
      setUser(null);
      setActiveWorkspace(null);
      setWorkspaces([]);
      setActiveWorkspaceId(null);
    } finally {
      setIsLoading(false);
      hasCheckedAuthRef.current = true;
    }
  }, [isLoading, loadWorkspaces, syncActiveWorkspace]);

  useEffect(() => {
    // Only fetch on mount or if explicitly requested (like after login)
    if (!hasCheckedAuthRef.current) {
      queueMicrotask(() => {
        void fetchUser();
      });
    }
  }, [fetchUser, isLoading]);

  // Proactive Token Refresh Logic
  useEffect(() => {
    if (!user) return;

    // Refresh every 14 minutes (assuming 15m expiry)
    const REFRESH_INTERVAL = 14 * 60 * 1000;
    const intervalId = setInterval(async () => {
      try {
        console.log("Proactively refreshing session...");
        await authService.refreshToken();
      } catch (error) {
        console.error("Proactive refresh failed:", error);
      }
    }, REFRESH_INTERVAL);

    // Refresh when user returns to the tab
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible") {
        try {
          console.log("Tab focused, refreshing session...");
          await authService.refreshToken();
        } catch (error) {
          console.error("Visibility refresh failed:", error);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user]);

  useEffect(() => {
    if (!hasCheckedAuthRef.current || isLoading) return;

    // Redirect logged-in users away from auth pages
    const isAuthRoute = pathname === "/login" || pathname === "/signup";
    if (isAuthRoute && user) {
      router.replace("/dashboard");
      return;
    }

    // Skip protection logic on public routes
    const isPublicRoute =
      pathname === "/login" ||
      pathname === "/signup" ||
      pathname === "/" ||
      pathname.startsWith("/invite");

    if (isPublicRoute) return;

    if (!user) {
      router.replace("/login");
    }
  }, [isLoading, pathname, router, user]);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      const loggedInUser = response.user;
      setUser(loggedInUser);

      const list = await loadWorkspaces();
      await syncActiveWorkspace(loggedInUser, list);

      // Check for a pending invitation token saved before auth redirect
      const pendingToken = sessionStorage.getItem('pendingInviteToken');
      if (pendingToken) {
        sessionStorage.removeItem('pendingInviteToken');
        router.replace(`/invite/accept?token=${encodeURIComponent(pendingToken)}`);
      } else {
        router.replace('/dashboard');
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      setActiveWorkspace(null);
      setWorkspaces([]);
      setActiveWorkspaceId(null);
      router.replace("/login");
    }
  };

  const switchWorkspace = useCallback(
    async (workspaceId: string) => {
      // Optimistic update for instant UI feedback
      const target = workspaces.find((w) => w.id === workspaceId) ?? null;
      setActiveWorkspace(target);
      setActiveWorkspaceId(workspaceId);

      try {
        // Persist to backend (PATCH /users/active-workspace)
        await userService.switchActiveWorkspace(workspaceId);

        // If we didn't have full workspace detail yet, fetch it now
        if (!target) {
          const ws = await workspaceService.getWorkspace(workspaceId);
          setActiveWorkspace(ws);
          setActiveWorkspaceId(ws.id);
        }

        // Update user state to reflect new activeWorkspaceId
        setUser((prev) =>
          prev ? { ...prev, activeWorkspaceId: workspaceId } : prev,
        );
      } catch (error) {
        console.error("switchWorkspace failed:", error);
        // Revert optimistic update on failure
        await fetchUser();
      }
    },
    [workspaces, fetchUser],
  );

  const refreshWorkspaces = useCallback(async () => {
    if (!user) return;
    const list = await loadWorkspaces();
    await syncActiveWorkspace(user, list);
  }, [user, loadWorkspaces, syncActiveWorkspace]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        activeWorkspace,
        workspaces,
        login,
        logout,
        switchWorkspace,
        refreshWorkspaces,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Convenience hook for workspace-specific data
export const useWorkspace = () => {
  const { activeWorkspace, workspaces, switchWorkspace, refreshWorkspaces } =
    useAuth();
  return { activeWorkspace, workspaces, switchWorkspace, refreshWorkspaces };
};

// Backwards-compat shim — remove once all consumers are updated
export const useWorkspaceRole = () => {
  const { user, isLoading } = useAuth();

  return {
    role: user?.role || "RECRUITER",
    setRole: () => {
      console.warn(
        "setRole is deprecated. Role is now determined by backend authentication.",
      );
    },
    isMounted: !isLoading,
  };
};
