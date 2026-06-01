'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { WorkspaceRole, RoleContextProps } from '../../../types';

const RoleContext = createContext<RoleContextProps | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<WorkspaceRole>('Recruiter');
  const [isMounted, setIsMounted] = useState(false);

  // Read localStorage after hydration — prevents SSR/CSR mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    const savedRole = localStorage.getItem('tf-role') as WorkspaceRole;
    if (savedRole === 'Recruiter' || savedRole === 'Admin') {
      setRoleState(savedRole);
    }
  }, []);

  const setRole = (newRole: WorkspaceRole) => {
    setRoleState(newRole);
    localStorage.setItem('tf-role', newRole);
  };

  return (
    <RoleContext.Provider value={{ role, setRole, isMounted }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useWorkspaceRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useWorkspaceRole must be used within a RoleProvider');
  }
  return context;
};
