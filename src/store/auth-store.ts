import { create } from "zustand";
import { api, endpoints } from "@/lib/api";
import { getErrorMessage } from "@/lib/api/errors";
import type {
  AuthUser,
  LoginRequest,
  SignupRequest,
  ApiResponse,
  LoginResponseData,
} from "@/lib/api/types";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  login: (data: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,

  clearError: () => set({ error: null }),

  login: async (data: LoginRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<ApiResponse<LoginResponseData>>(
        endpoints.auth.login,
        data,
      );
      const userData = response.data.user;

      set({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error, "auth-login");
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  signup: async (data: SignupRequest) => {
    set({ isLoading: true, error: null });
    try {
      // Step 1: Create account
      await api.post<ApiResponse<{ user: AuthUser }>>(
        endpoints.auth.signup,
        data,
      );

      // Step 2: Auto-login to set HttpOnly cookies
      const { login } = get();
      await login({ email: data.email, password: data.password });
    } catch (error) {
      const errorMessage = getErrorMessage(error, "auth-signup");
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await api.post(endpoints.auth.logout);
    } catch {
      // Logout API failure is non-critical - still clear local state
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get<ApiResponse<{ user: AuthUser }>>(
        endpoints.auth.me,
      );
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
    }
  },
}));
