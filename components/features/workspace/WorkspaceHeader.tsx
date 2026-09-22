'use client';

import React from 'react';
import { useAuth } from './RoleContext';
import NotificationBell from '../notifications/NotificationBell';

export default function WorkspaceHeader() {
  const { activeWorkspace } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-14 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800/80 px-6 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 dark:text-zinc-500">Workspace /</span>
          <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">
            {activeWorkspace?.name || 'Main Workspace'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <NotificationBell />
      </div>
    </header>
  );
}
