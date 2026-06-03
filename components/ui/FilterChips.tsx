'use client';

import React from 'react';
import { useApplicationsStore } from '../../lib/store/useApplicationsStore';

interface Filter {
  id: string;
  label: string;
  value: string;
}

interface FilterChipsProps {
  filters?: Filter[];
  onRemove?: (id: string) => void;
  onClearAll?: () => void;
}

export default function FilterChips({ filters, onRemove, onClearAll }: FilterChipsProps) {
  const storeFilters = useApplicationsStore((state) => state.filters);
  const setFilters = useApplicationsStore((state) => state.setFilters);
  const resetFilters = useApplicationsStore((state) => state.resetFilters);

  const activeFilters = React.useMemo(() => {
    if (filters !== undefined) return filters;
    const list = [];
    if (storeFilters.search) list.push({ id: 'search', label: 'Search', value: storeFilters.search });
    if (storeFilters.stage !== 'all') list.push({ id: 'stage', label: 'Stage', value: storeFilters.stage.toUpperCase() });
    if (storeFilters.minScore > 0) list.push({ id: 'score', label: 'Min Score', value: storeFilters.minScore.toString() });
    return list;
  }, [filters, storeFilters]);

  const handleRemove = (id: string) => {
    if (onRemove) {
      onRemove(id);
      return;
    }
    if (id === 'search') setFilters({ search: '' });
    if (id === 'stage') setFilters({ stage: 'all' });
    if (id === 'score') setFilters({ minScore: 0 });
  };

  const handleClearAll = onClearAll || resetFilters;

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-[10px] font-bold text-text-4 uppercase tracking-wider mr-1">Active Filters:</span>
      {activeFilters.map((filter) => (
        <div
          key={filter.id}
          className="flex items-center gap-1.5 px-2 py-1 bg-primary-soft border border-primary/20 rounded-md text-xs text-primary font-bold shadow-sm group hover:border-primary/40 transition-colors"
        >
          <span>{filter.label}:</span>
          <span className="text-text-1">{filter.value}</span>
          <button
            onClick={() => handleRemove(filter.id)}
            className="hover:bg-primary/10 rounded p-0.5 transition-colors"
            aria-label={`Remove ${filter.label} filter`}
          >
            <svg viewBox="0 0 24 24" className="w-3 h-3 stroke-current fill-none stroke-[3]"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
      ))}
      <button
        onClick={handleClearAll}
        className="text-[10px] font-bold text-text-3 hover:text-danger uppercase tracking-wider ml-2 transition-colors"
      >
        Clear All
      </button>
    </div>
  );
}
