import React from 'react';
import Sidebar from '../../components/features/workspace/Sidebar';
import HeaderContextIndicator from '../../components/features/workspace/HeaderContextIndicator';

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="shell">
      <Sidebar />
      <main className="main flex flex-col min-h-screen">
        <HeaderContextIndicator />
        {children}
      </main>
    </div>
  );
}
