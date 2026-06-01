'use client';

import React from 'react';

interface Filter {
  id: string;
  label: string;
  value: string;
}

interface FilterChipsProps {
  filters: Filter[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

export default function FilterChips({ filters, onRemove, onClearAll }: FilterChipsProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-[10px] font-bold text-text-4 uppercase tracking-wider mr-1">Active Filters:</span>
      {filters.map((filter) => (
        <div
          key={filter.id}
          className="flex items-center gap-1.5 px-2 py-1 bg-primary-soft border border-primary/20 rounded-md text-xs text-primary font-bold shadow-sm group hover:border-primary/40 transition-colors"
        >
          <span>{filter.label}:</span>
          <span className="text-text-1">{filter.value}</span>
          <button
            onClick={() => onRemove(filter.id)}
            className="hover:bg-primary/10 rounded p-0.5 transition-colors"
            aria-label={`Remove ${filter.label} filter`}
          >
            <svg viewBox="0 0 24 24" className="w-3 h-3 stroke-current fill-none stroke-[3]"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
      ))}
      <button
        onClick={onClearAll}
        className="text-[10px] font-bold text-text-3 hover:text-danger uppercase tracking-wider ml-2 transition-colors"
      >
        Clear All
      </button>
    </div>
  );
}
