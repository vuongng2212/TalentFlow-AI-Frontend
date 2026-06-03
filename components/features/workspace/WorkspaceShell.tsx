'use client';

import React, { useEffect, useState } from 'react';
import { useUIStore } from '@/lib/store/useUIStore';

export default function WorkspaceShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarExpanded = useUIStore((state) => state.sidebarExpanded);
  const theme = useUIStore((state) => state.theme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, mounted]);

  const shellClasses = [
    'shell',
    mounted && !sidebarExpanded ? 'sidebar-collapsed' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={shellClasses}>{children}</div>;
}
