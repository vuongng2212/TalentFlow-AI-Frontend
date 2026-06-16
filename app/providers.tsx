'use client';

import React, { useEffect, useState } from 'react';
import { AuthProvider } from '../components/features/workspace/RoleContext';
import GlobalLoadingOverlay from '../components/ui/GlobalLoadingOverlay';
import { useUIStore } from '../lib/store/useUIStore';

export default function Providers({ children }: { children: React.ReactNode }) {
  const theme = useUIStore((state) => state.theme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const updateTheme = React.useCallback(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (!mounted) return;
    updateTheme();
  }, [mounted, updateTheme]);

  return (
    <AuthProvider>
      {children}
      <GlobalLoadingOverlay />
    </AuthProvider>
  );
}
