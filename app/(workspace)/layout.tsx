"use client";

import React from 'react';
import Sidebar from '../../components/features/workspace/Sidebar';
import HeaderContextIndicator from '../../components/features/workspace/HeaderContextIndicator';
import WorkspaceHeader from '../../components/features/workspace/WorkspaceHeader';
import WorkspaceShell from '../../components/features/workspace/WorkspaceShell';
import { useAuth } from '../../components/features/workspace/RoleContext';

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { activeWorkspace } = useAuth();

  return (
    <WorkspaceShell>
      <Sidebar />
      <main className="main flex flex-col min-h-screen">
        <HeaderContextIndicator />
        <WorkspaceHeader />
        <React.Fragment key={activeWorkspace?.id}>
          {children}
        </React.Fragment>
      </main>
    </WorkspaceShell>
  );
}
