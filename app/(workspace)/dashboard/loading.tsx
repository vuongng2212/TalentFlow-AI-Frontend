import React from 'react';
import LoadingSkeleton from '../../../components/ui/LoadingSkeleton';

export default function Loading() {
  return (
    <>
      <header className="topbar">
        <div className="crumb">
          TalentFlow / <strong>Dashboard</strong>
        </div>
      </header>
      <section className="content">
        <div className="h-48 bg-surface-2 rounded-xl mb-6 animate-pulse" />
        <div className="grid-4 mb-6">
          <LoadingSkeleton type="text" count={1} className="h-32 card p-4" />
          <LoadingSkeleton type="text" count={1} className="h-32 card p-4" />
          <LoadingSkeleton type="text" count={1} className="h-32 card p-4" />
          <LoadingSkeleton type="text" count={1} className="h-32 card p-4" />
        </div>
        <div className="grid-60">
          <LoadingSkeleton type="table" count={5} className="card p-4" />
          <LoadingSkeleton type="row" count={5} className="card p-4" />
        </div>
      </section>
    </>
  );
}
