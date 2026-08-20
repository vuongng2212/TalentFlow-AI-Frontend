import { CvParsingStatus } from '@/types';

/** Maps an AI score (0-100) to a high/mid/low category used across the UI. */
export function getScoreCategory(
  score: number | null | undefined,
): 'high' | 'mid' | 'low' | 'none' {
  if (score === null || score === undefined) return 'none';
  if (score >= 80) return 'high';
  if (score >= 60) return 'mid';
  return 'low';
}

export interface ParsingStatusMeta {
  label: string;
  /** Tailwind classes for the status pill */
  className: string;
  /** Whether the parser is still working (show spinner) */
  inProgress: boolean;
}

/**
 * Visual metadata for the backend CvParsingStatus enum so the UI can render
 * PENDING/PROCESSING/COMPLETED/FAILED consistently.
 */
export function getParsingStatusMeta(
  status: CvParsingStatus | null | undefined,
): ParsingStatusMeta {
  switch (status) {
    case 'PROCESSING':
      return {
        label: 'Parsing…',
        className:
          'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-500/20',
        inProgress: true,
      };
    case 'COMPLETED':
      return {
        label: 'Parsed',
        className:
          'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-500/20',
        inProgress: false,
      };
    case 'FAILED':
      return {
        label: 'Parse failed',
        className:
          'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200/50 dark:border-rose-500/20',
        inProgress: false,
      };
    case 'PENDING':
    default:
      return {
        label: 'Pending',
        className:
          'bg-slate-50 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border-slate-200/50 dark:border-zinc-700/50',
        inProgress: false,
      };
  }
}
