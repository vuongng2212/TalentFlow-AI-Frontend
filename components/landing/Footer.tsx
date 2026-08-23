import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-50/50 dark:bg-zinc-950/20 border-t border-slate-200/60 dark:border-zinc-900 pt-16 pb-12 transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-12 border-b border-slate-200/60 dark:border-zinc-900">

          {/* Logo & Brand description */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="group flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-black text-white shadow-sm shadow-indigo-600/20 group-hover:bg-indigo-700 transition-colors duration-200">
                TF
              </span>
              <span>
                TalentFlow <span className="bg-linear-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-indigo-300">AI</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-zinc-400 max-w-[32ch] text-pretty">
              Explainable AI recruiting pipelines. Automate resume triaging, fit scoring, and workflow actions securely.
            </p>
          </div>

          {/* Column 1: Product */}
          <div className="md:col-span-2 space-y-3.5">
            <h4 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-zinc-400">
              <li>
                <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pricing</a>
              </li>
              <li>
                <a href="#how" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">How it works</a>
              </li>
            </ul>
          </div>

          {/* Column 2: Solutions */}
          <div className="md:col-span-2 space-y-3.5">
            <h4 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
              Solutions
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-zinc-400">
              <li>
                <Link href="/signup" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">CV Triage</Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Explainable AI</Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Workspace Collab</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="md:col-span-2 space-y-3.5">
            <h4 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-zinc-400">
              <li>
                <span className="text-slate-400 dark:text-zinc-600 cursor-default select-none">About</span>
              </li>
              <li>
                <span className="text-slate-400 dark:text-zinc-600 cursor-default select-none">Customers</span>
              </li>
              <li>
                <span className="text-slate-400 dark:text-zinc-600 cursor-default select-none">Careers</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="md:col-span-2 space-y-3.5">
            <h4 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-zinc-400">
              <li>
                <span className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">Privacy Policy</span>
              </li>
              <li>
                <span className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">Terms of Service</span>
              </li>
              <li>
                <span className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">Cookie Settings</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 gap-4 text-[11px] font-semibold text-slate-400 dark:text-zinc-500">
          <p>© 2026 TalentFlow AI. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-600 dark:hover:text-zinc-300 transition-colors cursor-pointer">Status</span>
            <span className="hover:text-slate-600 dark:hover:text-zinc-300 transition-colors cursor-pointer">Contact Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
