import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { getMockUser } from "@/lib/mock-data";
import { sleep } from "@/lib/utils";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
}

interface SignupData {
  email: string;
  password: string;
  fullName: string;
  role?: "RECRUITER" | "INTERVIEWER";
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, _password: string) => { // eslint-disable-line @typescript-eslint/no-unused-vars
        set({ isLoading: true });

        // Simulate API call
        await sleep(1000);

        // Mock authentication - accept any password for demo
        const mockUser = getMockUser(email);

        if (!mockUser) {
          set({ isLoading: false });
          throw new Error("Invalid credentials");
        }

        set({
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      signup: async (data: SignupData) => {
        set({ isLoading: true });

        // Simulate API call
        await sleep(1200);

        // Create mock user
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          email: data.email,
          fullName: data.fullName,
          role: data.role || "RECRUITER",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.fullName}`,
          createdAt: new Date(),
        };

        set({
          user: newUser,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
