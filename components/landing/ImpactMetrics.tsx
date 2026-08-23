import React from 'react';

export const ImpactMetrics: React.FC = () => {
  return (
    <section className="py-10 sm:py-16">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Stat 1 */}
          <div className="group relative rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-zinc-800/80 dark:bg-zinc-900/40 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-indigo-500/5 blur-xl group-hover:bg-indigo-500/10 transition-colors duration-300" />
            <div className="absolute top-4 right-4 text-slate-200 dark:text-zinc-800 opacity-50 group-hover:text-indigo-500/20 transition-colors duration-300">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div className="font-jakarta text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">
              50%
            </div>
            <p className="mt-3 text-sm leading-relaxed font-bold text-slate-700 dark:text-zinc-300">
              Faster first-pass triage
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
              For high-volume applicant pipelines.
            </p>
          </div>

          {/* Stat 2 */}
          <div className="group relative rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-zinc-800/80 dark:bg-zinc-900/40 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-500/5 blur-xl group-hover:bg-emerald-500/10 transition-colors duration-300" />
            <div className="absolute top-4 right-4 text-slate-200 dark:text-zinc-800 opacity-50 group-hover:text-emerald-500/20 transition-colors duration-300">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="font-jakarta text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">
              85%
            </div>
            <p className="mt-3 text-sm leading-relaxed font-bold text-slate-700 dark:text-zinc-300">
              Extraction accuracy
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
              For structured candidate profile facts.
            </p>
          </div>

          {/* Stat 3 */}
          <div className="group relative rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-zinc-800/80 dark:bg-zinc-900/40 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-indigo-500/5 blur-xl group-hover:bg-indigo-500/10 transition-colors duration-300" />
            <div className="absolute top-4 right-4 text-slate-200 dark:text-zinc-800 opacity-50 group-hover:text-indigo-500/20 transition-colors duration-300">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className="font-jakarta text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">
              4.7h
            </div>
            <p className="mt-3 text-sm leading-relaxed font-bold text-slate-700 dark:text-zinc-300">
              Recruiter admin saved
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
              Average saved weekly per open role.
            </p>
          </div>

          {/* Stat 4 */}
          <div className="group relative rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-zinc-800/80 dark:bg-zinc-900/40 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-500/5 blur-xl group-hover:bg-emerald-500/10 transition-colors duration-300" />
            <div className="absolute top-4 right-4 text-slate-200 dark:text-zinc-800 opacity-50 group-hover:text-emerald-500/20 transition-colors duration-300">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="font-jakarta text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">
              3
            </div>
            <p className="mt-3 text-sm leading-relaxed font-bold text-slate-700 dark:text-zinc-300">
              Dedicated workspaces
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
              For recruiters, interviewers, and admins.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ImpactMetrics;
