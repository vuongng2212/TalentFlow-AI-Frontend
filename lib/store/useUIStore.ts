import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createMinDuration } from '../minDuration';

export interface UIState {
  theme: 'light' | 'dark';
  sidebarExpanded: boolean;
  globalLoading: boolean;
  loadingMessage: string;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setSidebarExpanded: (expanded: boolean) => void;
  toggleSidebar: () => void;
  showLoading: (message?: string) => void;
  hideLoading: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => {
      const minDur = createMinDuration();

      return {
        theme: 'light',
        sidebarExpanded: true,
        globalLoading: false,
        loadingMessage: '',
        setTheme: (theme) => set({ theme }),
        toggleTheme: () => set((state: UIState) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
        setSidebarExpanded: (sidebarExpanded: boolean) => set({ sidebarExpanded }),
        toggleSidebar: () => set((state: UIState) => ({ sidebarExpanded: !state.sidebarExpanded })),
        showLoading: (message = '') => {
          minDur.cancel();
          minDur.start();
          set({ globalLoading: true, loadingMessage: message });
        },
        hideLoading: () => {
          minDur.end(() => set({ globalLoading: false, loadingMessage: '' }));
        },
      };
    },
    {
      name: 'talentflow-ui-store',
      partialize: (state) => ({
        theme: state.theme,
        sidebarExpanded: state.sidebarExpanded,
      }),
    }
  )
);