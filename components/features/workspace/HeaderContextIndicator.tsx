'use client';

import React from 'react';
import { useWorkspaceRole } from './RoleContext';

export default function HeaderContextIndicator() {
  const { role, isMounted } = useWorkspaceRole();

  if (!isMounted || role !== 'ADMIN') return null;

  return (
    <div className="bg-red-600 text-white text-[10px] font-bold py-1 px-4 text-center uppercase tracking-[0.2em]">
      Administrative Access Mode — Restricted Environment
    </div>
  );
}
