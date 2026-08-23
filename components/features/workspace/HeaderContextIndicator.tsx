'use client';

import React from 'react';
import { useWorkspaceRole } from './RoleContext';

export default function HeaderContextIndicator() {
  const { role, isMounted } = useWorkspaceRole();

  if (!isMounted || role !== 'ADMIN') return null;

  return (
    <div className="bg-red-500/10 dark:bg-red-500/20 border-b border-red-500/20 text-red-700 dark:text-red-400 text-[10px] font-bold py-1.5 px-4 flex items-center justify-center gap-2 uppercase tracking-widest backdrop-blur-md">
      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      Administrative Access Mode — Restricted Environment
    </div>
  );
}
