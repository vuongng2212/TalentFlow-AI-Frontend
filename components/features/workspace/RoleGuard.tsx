'use client';

import React from 'react';
import { useWorkspaceRole } from './RoleContext';

interface RoleGuardProps {
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children }) => {
  const { role, setRole, isMounted } = useWorkspaceRole();

  if (!isMounted) {
    return (
      <div className="flex flex-1 items-center justify-center p-12 text-gray-500">
        Verifying administrator authorization...
      </div>
    );
  }

  if (role !== 'ADMIN') {
    return (
      <>
        <header className="topbar">
          <div className="crumb">
            Workspace / <strong>Access Denied</strong>
          </div>
        </header>
        <section className="content flex flex-col items-center justify-center py-20 text-center">
          <div
            className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-6 font-bold text-3xl"
            style={{ border: '2px solid var(--danger)' }}
          >
            !
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 max-w-md mb-6">
            You do not have administrative clearance to access this governance route. Your active role is set to{' '}
            <strong>Recruiter</strong>.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setRole()}
              className="btn primary"
              style={{ cursor: 'pointer' }}
            >
              Switch to Admin Role
            </button>
            <a href="/dashboard" className="btn secondary">
              Return to Dashboard
            </a>
          </div>
        </section>
      </>
    );
  }

  return <>{children}</>;
};

export default RoleGuard;
