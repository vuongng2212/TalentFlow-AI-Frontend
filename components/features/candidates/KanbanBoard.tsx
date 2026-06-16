import React, { useState } from 'react';
import KanbanCard from './KanbanCard';

interface KanbanBoardProps {
  candidates: any[];
  onSelect: (candidate: any) => void;
  onDropCandidate: (id: string, stage: string) => void;
}

interface Column {
  key: string;
  label: string;
  badgeClass: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
}

interface ColumnTheme {
  dot: string;
  badge: string;
  borderTop: string;
  activeBorder: string;
  activeBg: string;
}

const columnThemes: Record<string, ColumnTheme> = {
  applied: {
    dot: 'bg-blue-500 dark:bg-blue-400',
    badge: 'bg-blue-50 dark:bg-blue-950/35 text-blue-700 dark:text-blue-300 border-blue-100/50 dark:border-blue-900/30',
    borderTop: 'border-t-blue-500/70 dark:border-t-blue-400/70',
    activeBorder: 'border-blue-400/50 dark:border-blue-700/50',
    activeBg: 'bg-blue-50/20 dark:bg-blue-950/10',
  },
  screening: {
    dot: 'bg-indigo-500 dark:bg-indigo-400',
    badge: 'bg-indigo-50 dark:bg-indigo-950/35 text-indigo-700 dark:text-indigo-300 border-indigo-100/50 dark:border-indigo-900/30',
    borderTop: 'border-t-indigo-500/70 dark:border-t-indigo-400/70',
    activeBorder: 'border-indigo-400/50 dark:border-indigo-700/50',
    activeBg: 'bg-indigo-50/20 dark:bg-indigo-950/10',
  },
  interview: {
    dot: 'bg-amber-500 dark:bg-amber-400',
    badge: 'bg-amber-50 dark:bg-amber-950/35 text-amber-700 dark:text-amber-300 border-amber-100/50 dark:border-amber-900/30',
    borderTop: 'border-t-amber-500/70 dark:border-t-amber-400/70',
    activeBorder: 'border-amber-400/50 dark:border-amber-700/50',
    activeBg: 'bg-amber-50/20 dark:bg-amber-950/10',
  },
  offer: {
    dot: 'bg-emerald-500 dark:bg-emerald-400',
    badge: 'bg-emerald-50 dark:bg-emerald-950/35 text-emerald-700 dark:text-emerald-300 border-emerald-100/50 dark:border-emerald-900/30',
    borderTop: 'border-t-emerald-500/70 dark:border-t-emerald-400/70',
    activeBorder: 'border-emerald-400/50 dark:border-emerald-700/50',
    activeBg: 'bg-emerald-50/20 dark:bg-emerald-950/10',
  },
  hired: {
    dot: 'bg-teal-500 dark:bg-teal-400',
    badge: 'bg-teal-50 dark:bg-teal-950/35 text-teal-700 dark:text-teal-300 border-teal-100/50 dark:border-teal-900/30',
    borderTop: 'border-t-teal-500/70 dark:border-t-teal-400/70',
    activeBorder: 'border-teal-400/50 dark:border-teal-700/50',
    activeBg: 'bg-teal-50/20 dark:bg-teal-950/10',
  },
  rejected: {
    dot: 'bg-rose-500 dark:bg-rose-400',
    badge: 'bg-rose-50 dark:bg-rose-950/35 text-rose-700 dark:text-rose-300 border-rose-100/50 dark:border-rose-900/30',
    borderTop: 'border-t-rose-500/70 dark:border-t-rose-400/70',
    activeBorder: 'border-rose-400/50 dark:border-rose-700/50',
    activeBg: 'bg-rose-50/20 dark:bg-rose-950/10',
  },
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  candidates,
  onSelect,
  onDropCandidate,
}) => {
  const columns: Column[] = [
    { key: 'applied', label: 'Applied', badgeClass: 'applied' },
    { key: 'screening', label: 'Screening', badgeClass: 'screening' },
    { key: 'interview', label: 'Interview', badgeClass: 'interview' },
    { key: 'offer', label: 'Offer', badgeClass: 'offer' },
    { key: 'hired', label: 'Hired', badgeClass: 'hired' },
    { key: 'rejected', label: 'Rejected', badgeClass: 'rejected' },
  ];

  const [activeDropCol, setActiveDropCol] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent, colKey: string) => {
    e.preventDefault();
    setActiveDropCol(colKey);
  };

  const handleDragLeave = () => {
    setActiveDropCol(null);
  };

  const handleDrop = (e: React.DragEvent, colKey: string) => {
    e.preventDefault();
    setActiveDropCol(null);
    const id = e.dataTransfer.getData('text/plain');
    if (id) {
      onDropCandidate(id, colKey);
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
      {columns.map((column) => {
        const colCandidates = candidates.filter((c) => c.stage === column.key);
        const isActiveCol = activeDropCol === column.key;
        const theme = columnThemes[column.key];

        return (
          <div
            key={column.key}
            className={`shrink-0 w-72 min-h-137.5 bg-slate-50/40 dark:bg-zinc-900/30 border-x border-b border-t-2 rounded-2xl p-4 flex flex-col gap-4 snap-start transition-all duration-200 ${
              isActiveCol
                ? `${theme.activeBorder} ${theme.activeBg} ${theme.borderTop}`
                : `border-slate-100 dark:border-zinc-800/80 ${theme.borderTop}`
            }`}
            onDragOver={(e) => handleDragOver(e, column.key)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.key)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
                <span className="text-sm font-bold text-slate-800 dark:text-zinc-200">{column.label}</span>
              </div>
              <span className={`inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[10px] font-bold border ${theme.badge} tabular-data`}>
                {colCandidates.length}
              </span>
            </div>
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
              {colCandidates.map((cand) => (
                <KanbanCard
                  key={cand.id}
                  candidate={cand}
                  onSelect={onSelect}
                  onDragStart={handleDragStart}
                />
              ))}
              {colCandidates.length === 0 && (
                <div className="text-center text-xs text-slate-400 dark:text-zinc-500 py-12 border border-dashed border-slate-200 dark:border-zinc-800 rounded-xl flex-1 flex items-center justify-center bg-white/20 dark:bg-zinc-900/10">
                  Drop candidates here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
