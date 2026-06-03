import React from 'react';
import Sidebar from '../../components/features/workspace/Sidebar';
import HeaderContextIndicator from '../../components/features/workspace/HeaderContextIndicator';
import WorkspaceShell from '../../components/features/workspace/WorkspaceShell';

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WorkspaceShell>
      <Sidebar />
      <main className="main flex flex-col min-h-screen">
        <HeaderContextIndicator />
        {children}
      </main>
    </WorkspaceShell>
  );
}
