import React from 'react';
import Link from 'next/link';

export default function WorkflowSection() {
  return (
    <section className="py-20 sm:py-28 bg-slate-50/50 dark:bg-zinc-950/20 border-y border-slate-100 dark:border-zinc-900" id="how">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-12 lg:items-start">

          {/* Left Column - Sticky Description */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold tracking-wide text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
              Recruiting Flow
            </span>
            <h2 className="font-jakarta text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50 sm:text-4xl leading-tight">
              From resume intake to decision-ready shortlist
            </h2>
            <p className="text-slate-600 dark:text-zinc-400 text-base leading-relaxed text-pretty">
              Preview the recruiting flow before entering the application. TalentFlow coordinates your entire hiring lifecycle from a single visual dashboard.
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-98"
              >
                Open Dashboard Preview
              </Link>
            </div>
          </div>

          {/* Right Column - Premium Stepper */}
          <div className="lg:col-span-7 space-y-8 relative pl-4 sm:pl-6">
            {/* Connection Line */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-slate-100 dark:bg-zinc-800/50" />

            {/* Step 1 */}
            <div className="relative flex gap-5 group">
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-black text-sm shadow-md shadow-indigo-600/15 group-hover:bg-indigo-500 transition-colors duration-300">
                1
              </div>
              <div className="grow rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/40 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-jakarta text-base font-bold text-slate-900 dark:text-zinc-50">
                    Upload CVs
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Step 01</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                  Bulk upload resume PDFs/Word files, parse candidate LinkedIn profiles, or ingest applications automatically from job board endpoints.
                </p>
                {/* Mini Visual Preview */}
                <div className="border border-dashed border-slate-200 dark:border-zinc-800/60 rounded-lg p-2.5 bg-slate-50/50 dark:bg-zinc-950/20 text-center text-[10px] text-slate-400 flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                  <span>Drag & drop candidate CVs here</span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex gap-5 group">
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-black text-sm shadow-md shadow-indigo-600/15 group-hover:bg-indigo-500 transition-colors duration-300">
                2
              </div>
              <div className="grow rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/40 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-jakarta text-base font-bold text-slate-900 dark:text-zinc-50">
                    AI Triage & Score
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Step 02</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                  The semantic engine computes a match score from 0 to 100, outlines key role requirements met, and lists missing credentials.
                </p>
                {/* Mini Visual Preview */}
                <div className="rounded-lg border border-slate-100 dark:border-zinc-800/60 p-2.5 bg-slate-50/50 dark:bg-zinc-950/20 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-700 dark:text-zinc-300">Semantic Fit Score</span>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-16 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden block">
                      <span className="h-full w-[88%] bg-emerald-500 block" />
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">88%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex gap-5 group">
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-black text-sm shadow-md shadow-indigo-600/15 group-hover:bg-indigo-500 transition-colors duration-300">
                3
              </div>
              <div className="grow rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/40 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-jakarta text-base font-bold text-slate-900 dark:text-zinc-50">
                    Move & Communicate
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Step 03</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                  Advance candidates on the Kanban board. The system logs transitions for security audits and triggers automated template updates to applicants.
                </p>
                {/* Mini Visual Preview */}
                <div className="rounded-lg border border-slate-100 dark:border-zinc-800/60 p-2 bg-slate-50/50 dark:bg-zinc-950/20 flex gap-2 items-center justify-between text-[10px] text-slate-500">
                  <span className="bg-white dark:bg-zinc-900 px-2 py-0.5 rounded border border-slate-200/50">Interview</span>
                  <svg className="h-3 w-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                  <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 px-2 py-0.5 rounded font-bold">Offer</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
