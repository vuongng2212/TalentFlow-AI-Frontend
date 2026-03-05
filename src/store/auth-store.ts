import { create } from "zustand";
import type { User } from "@/types";
import { api, endpoints } from "@/lib/api";
import { getMockUser } from "@/lib/mock-data";
import { LoginRequest, SignupRequest, ApiResponse, LoginResponseData, SignupResponseData } from "@/lib/api/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

const ENABLE_MOCK = process.env.NEXT_PUBLIC_ENABLE_MOCK_API === "true";

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  login: async (data: LoginRequest) => {
    set({ isLoading: true, error: null });
    try {
      if (ENABLE_MOCK) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const mockUser = getMockUser(data.email);
        if (!mockUser) throw new Error("Invalid credentials");

        set({
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }

      const response = await api.post<ApiResponse<LoginResponseData>>(endpoints.auth.login, data);
      // Backend returns { status, message, data: { user }, timestamp }
      // api.post returns the full response, so response.data is LoginResponseData
      const userData = response.data.user;

      set({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  signup: async (data: SignupRequest) => {
    set({ isLoading: true, error: null });
    try {
      if (ENABLE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        const newUser: User = {
          id: Math.random().toString(36).substring(2, 11),
          email: data.email,
          fullName: data.fullName,
          role: data.role,
          createdAt: new Date().toISOString(),
        };
        set({
          user: newUser,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }

      const response = await api.post<ApiResponse<SignupResponseData>>(endpoints.auth.signup, data);
      const userData = response.data.user;

      set({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Signup failed";
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      if (!ENABLE_MOCK) {
        await api.post(endpoints.auth.logout);
      }
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
    if (ENABLE_MOCK) return;

    set({ isLoading: true });
    try {
      const response = await api.get<ApiResponse<User>>(endpoints.auth.me);
      set({
        user: response.data,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (_error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      // Don't throw here, just silence if not logged in
    }
  },
}));
