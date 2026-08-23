import React from 'react';
import Link from 'next/link';

import { UICandidate } from '../../../types';
import { getParsingStatusMeta } from '../../../lib/cv';

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
  const parsing = getParsingStatusMeta(candidate.cvParsingStatus);
  const hasScore = candidate.score !== null && candidate.score !== undefined;

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
        {hasScore ? (
          <span className={`inline-flex items-center justify-center rounded-lg border px-2 py-0.5 text-[11px] font-black tabular-data shrink-0 ${parsing.inProgress ? 'border-amber-200/50 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400' : 'border-emerald-200/50 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'}`}>
            {candidate.score}
          </span>
        ) : (
          <span className="inline-flex items-center justify-center rounded-lg border border-slate-200/50 bg-slate-50 dark:border-zinc-700/50 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 text-[11px] font-black tabular-data shrink-0">
            —
          </span>
        )}
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
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-bold ${parsing.className}`}>
            {parsing.inProgress && (
              <svg className="animate-spin h-2.5 w-2.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {parsing.label}
          </span>
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
