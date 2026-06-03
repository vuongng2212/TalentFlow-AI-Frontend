import { create } from 'zustand';

export interface ApplicationsFilters {
  search: string;
  stage: string;
  minScore: number;
}

export interface ApplicationsPagination {
  page: number;
  limit: number;
}

export interface ApplicationsState {
  filters: ApplicationsFilters;
  pagination: ApplicationsPagination;
  viewMode: 'list' | 'kanban';
  selectedIds: string[];
  setFilters: (filters: Partial<ApplicationsFilters>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setViewMode: (mode: 'list' | 'kanban') => void;
  toggleSelectId: (id: string) => void;
  setSelectedIds: (ids: string[]) => void;
  clearSelection: () => void;
}

const DEFAULT_FILTERS: ApplicationsFilters = {
  search: '',
  stage: 'all',
  minScore: 0,
};

export const useApplicationsStore = create<ApplicationsState>((set) => ({
  filters: DEFAULT_FILTERS,
  pagination: {
    page: 1,
    limit: 10,
  },
  viewMode: 'list',
  selectedIds: [],
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, page: 1 },
    })),
  resetFilters: () =>
    set((state) => ({
      filters: DEFAULT_FILTERS,
      pagination: { ...state.pagination, page: 1 },
    })),
  setPage: (page) =>
    set((state) => ({
      pagination: { ...state.pagination, page },
    })),
  setLimit: (limit) =>
    set((state) => ({
      pagination: { ...state.pagination, limit },
    })),
  setViewMode: (viewMode) =>
    set(() => ({
      viewMode,
      pagination: {
        page: 1,
        limit: viewMode === 'kanban' ? 100 : 10,
      },
    })),
  toggleSelectId: (id) =>
    set((state) => {
      const isSelected = state.selectedIds.includes(id);
      const selectedIds = isSelected
        ? state.selectedIds.filter((item) => item !== id)
        : [...state.selectedIds, id];
      return { selectedIds };
    }),
  setSelectedIds: (selectedIds) => set({ selectedIds }),
  clearSelection: () => set({ selectedIds: [] }),
}));
