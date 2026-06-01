'use client';

import React, { useEffect } from 'react';
import ErrorState from '../../../components/ui/ErrorState';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <header className="topbar">
        <div className="crumb">
          TalentFlow / <strong>Dashboard</strong>
        </div>
      </header>
      <section className="content">
        <ErrorState
          message="Failed to load your recruitment dashboard metrics."
          onRetry={() => reset()}
        />
      </section>
    </>
  );
}
