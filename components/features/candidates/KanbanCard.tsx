import React from 'react';
import Link from 'next/link';

import { UICandidate } from '../../../types';

interface KanbanCardProps {
  candidate: UICandidate & {
    name: string;
    title: string;
    appliedDate: string;
    stage: string;
  };
  onSelect: (candidate: UICandidate) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  candidate,
  onSelect,
  onDragStart,
}) => {
  return (
    <article
      className="card interactive p-4 bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-none cursor-grab active:cursor-grabbing hover:-translate-y-0.5 transition-all duration-200 select-none flex flex-col gap-3"
      draggable
      onDragStart={(e) => onDragStart(e, candidate.id)}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 font-bold flex items-center justify-center text-xs shrink-0 cursor-pointer"
            onClick={() => onSelect(candidate)}
          >
            {candidate.avatar}
          </div>
          <div className="min-w-0 cursor-pointer" onClick={() => onSelect(candidate)}>
            <strong className="block text-sm font-bold text-slate-900 dark:text-zinc-100 truncate">
              {candidate.name}
            </strong>
            <span className="text-[11px] text-slate-500 dark:text-zinc-400 truncate block mt-0.5">
              {candidate.title.split(' · ')[0]}
            </span>
          </div>
        </div>
        <span className="inline-flex items-center justify-center rounded-lg border border-emerald-200/50 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10 px-2 py-0.5 text-[11px] font-black text-emerald-700 dark:text-emerald-400 tabular-data shrink-0">
          {candidate.score}
        </span>
      </div>

      {candidate.skills && candidate.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {candidate.skills.slice(0, 3).map((skill: string) => (
            <span key={skill} className="chip text-[10px] py-0.5 px-2 bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100 dark:border-zinc-800 text-[10px]">
        <span className="text-slate-400 dark:text-zinc-500 tabular-data">
          Applied {candidate.appliedDate}
        </span>
        <div className="flex gap-2">
          <Link
            href={`/candidates/${candidate.id}`}
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
          >
            Folder
          </Link>
          <button
            onClick={() => onSelect(candidate)}
            className="text-slate-500 hover:text-slate-900 dark:hover:text-zinc-100 font-semibold cursor-pointer"
          >
            Details
          </button>
        </div>
      </div>
    </article>
  );
};

export default KanbanCard;
