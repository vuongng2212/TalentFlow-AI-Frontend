"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { User, AuthContextProps } from "../../../types";
import { authService } from "../../../services/api/auth.service";
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
  const router = useRouter();
  const pathname = usePathname();
  const hasCheckedAuthRef = useRef(false);

  const fetchUser = useCallback(async () => {
    try {
      const response = await authService.getCurrentUser();
      setUser(response.user);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
      hasCheckedAuthRef.current = true;
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchUser();
    });
  }, [fetchUser]);

  useEffect(() => {
    if (!hasCheckedAuthRef.current || isLoading) return;

    const isPublicRoute =
      pathname === "/login" || pathname === "/signup" || pathname === "/";
    if (!user && !isPublicRoute) {
      router.replace("/login");
    }
  }, [isLoading, pathname, router, user]);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      router.replace("/dashboard");
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
      router.replace("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, logout }}
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

// Vẫn giữ lại export useWorkspaceRole để không làm break code hiện tại ngay lập tức,
// nhưng map nó qua useAuth thay vì RoleContext cũ.
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
