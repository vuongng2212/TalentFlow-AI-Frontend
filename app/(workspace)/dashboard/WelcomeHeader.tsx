'use client';

import React, { useState } from 'react';

export default function WelcomeHeader() {
  const [showWelcome, setShowWelcome] = useState(true);

  if (!showWelcome) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-100 dark:border-indigo-500/20 bg-linear-to-r from-indigo-50 to-white dark:from-indigo-950/40 dark:to-zinc-900 p-6 shadow-xs mb-6">
      {/* Decorative gradient blob */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-jakarta text-2xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
            Good morning, Avery.
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-600 dark:text-zinc-400">
            Seven high-fit candidates need review before the Platform hiring sync.
          </p>
        </div>
        <button
          className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-700 text-slate-500 dark:text-zinc-400 transition-colors border border-slate-200/50 dark:border-zinc-700/50 shadow-xs cursor-pointer"
          onClick={() => setShowWelcome(false)}
          aria-label="Dismiss welcome message"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}