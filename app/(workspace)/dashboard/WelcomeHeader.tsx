'use client';

import React, { useState } from 'react';

export default function WelcomeHeader() {
  const [showWelcome, setShowWelcome] = useState(true);

  if (!showWelcome) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900/90 p-6 sm:p-8 shadow-2xl shadow-indigo-950/5 backdrop-blur-md mb-8">
      {/* Subtle background glow replacing the generic blob */}
      <div className="absolute inset-0 bg-linear-to-tr from-indigo-500/5 to-emerald-500/5 dark:from-indigo-500/10 dark:to-emerald-500/10 opacity-50 -z-10" />

      <div className="relative z-10 flex items-start justify-between gap-6 flex-col sm:flex-row">
        <div className="flex flex-col gap-2">
          <h1 className="font-jakarta text-3xl font-black text-slate-900 dark:text-zinc-50 tracking-tight text-balance">
            Good morning, Avery.
          </h1>
          <p className="text-base font-medium text-slate-600 dark:text-zinc-400 max-w-2xl text-pretty">
            Seven high-fit candidates need review before the Platform hiring sync.
          </p>
        </div>
        <button
          className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-500 dark:text-zinc-400 transition-all border border-slate-200 dark:border-zinc-700 shadow-sm cursor-pointer active:scale-95 hover:-translate-y-0.5"
          onClick={() => setShowWelcome(false)}
          aria-label="Dismiss welcome message"
          title="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
