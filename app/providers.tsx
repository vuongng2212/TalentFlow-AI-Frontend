'use client';

import React from 'react';
import { AuthProvider } from '../components/features/workspace/RoleContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
