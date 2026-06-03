'use client';

import React from 'react';
import { AuthProvider } from '../components/features/workspace/RoleContext';
import GlobalLoadingOverlay from '../components/ui/GlobalLoadingOverlay';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <GlobalLoadingOverlay />
    </AuthProvider>
  );
}
