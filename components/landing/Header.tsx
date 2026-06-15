import React from 'react';
import Link from 'next/link';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/75 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/75 transition-all duration-300">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5 sm:px-8">
        <Link href="/" className="group flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-black text-white shadow-sm shadow-indigo-600/20 group-hover:bg-indigo-700 transition-colors duration-200">
            TF
          </span>
          <span>
            TalentFlow <span className="bg-linear-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-indigo-300">AI</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium text-slate-600 dark:text-zinc-400">
          <a
            href="#features"
            className="relative py-1.5 transition-colors duration-200 hover:text-indigo-600 dark:hover:text-indigo-400 group"
          >
            Features
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-indigo-600 dark:bg-indigo-400 transition-all duration-300 group-hover:w-full" />
          </a>
          <a
            href="#pricing"
            className="relative py-1.5 transition-colors duration-200 hover:text-indigo-600 dark:hover:text-indigo-400 group"
          >
            Pricing
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-indigo-600 dark:bg-indigo-400 transition-all duration-300 group-hover:w-full" />
          </a>
          <a
            href="#how"
            className="relative py-1.5 transition-colors duration-200 hover:text-indigo-600 dark:hover:text-indigo-400 group"
          >
            How it works
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-indigo-600 dark:bg-indigo-400 transition-all duration-300 group-hover:w-full" />
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-zinc-300 dark:hover:bg-zinc-900 transition-all duration-200 active:scale-98"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm shadow-indigo-600/10 hover:bg-indigo-500 hover:shadow-indigo-600/20 transition-all duration-200 active:scale-98"
          >
            Start Free
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
