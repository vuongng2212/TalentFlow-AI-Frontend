'use client';

import React from 'react';
import { useApplicationsStore } from '../../lib/store/useApplicationsStore';

interface BulkActionBarProps {
  selectedCount?: number;
  onClear?: () => void;
  actions: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
  }[];
}

export default function BulkActionBar({ selectedCount, onClear, actions }: BulkActionBarProps) {
  const selectedIds = useApplicationsStore((state) => state.selectedIds);
  const clearSelection = useApplicationsStore((state) => state.clearSelection);

  const count = selectedCount !== undefined ? selectedCount : selectedIds.length;
  const handleClear = onClear || clearSelection;

  if (count === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-text-1 text-white px-6 py-4 rounded-2xl shadow-modal border border-white/10 flex items-center gap-8 backdrop-filter backdrop-blur-md">
        <div className="flex items-center gap-3 pr-8 border-r border-white/10">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-sm shadow-ai">
            {count}
          </div>
          <span className="text-sm font-bold tracking-tight">Candidates selected</span>
          <button
            onClick={handleClear}
            className="text-white/50 hover:text-white transition-colors ml-2"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none stroke-2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              className={`btn px-4 h-9 text-xs font-bold ${
                action.variant === 'primary' ? 'primary bg-primary border-none' :
                action.variant === 'danger' ? 'bg-danger/80 hover:bg-danger text-white border-none' :
                'bg-white/10 hover:bg-white/20 text-white border-none'
              }`}
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
