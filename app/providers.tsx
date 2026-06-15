'use client';

import React, { useEffect, useState } from 'react';
import { AuthProvider } from '../components/features/workspace/RoleContext';
import GlobalLoadingOverlay from '../components/ui/GlobalLoadingOverlay';
import { useUIStore } from '../lib/store/useUIStore';

export default function Providers({ children }: { children: React.ReactNode }) {
  const theme = useUIStore((state) => state.theme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, mounted]);

  return (
    <AuthProvider>
      {children}
      <GlobalLoadingOverlay />
    </AuthProvider>
  );
}
