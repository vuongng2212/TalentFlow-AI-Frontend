'use client';

import React from 'react';
import { useUIStore } from '../../lib/store/useUIStore';
import Spinner from './Spinner';

export default function GlobalLoadingOverlay() {
  const globalLoading = useUIStore((state) => state.globalLoading);
  const loadingMessage = useUIStore((state) => state.loadingMessage);

  if (!globalLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-white px-8 py-10 shadow-2xl">
        <Spinner size="lg" className="text-primary" />
        {loadingMessage && (
          <p className="text-sm font-medium text-gray-600">{loadingMessage}</p>
        )}
      </div>
    </div>
  );
}
