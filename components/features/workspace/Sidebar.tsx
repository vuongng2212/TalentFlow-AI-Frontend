'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './RoleContext';
import { useUIStore } from '@/lib/store/useUIStore';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();

  const sidebarExpanded = useUIStore((state) => state.sidebarExpanded);
  const theme = useUIStore((state) => state.theme);
  const toggleTheme = useUIStore((state) => state.toggleTheme);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: (
      <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
    ) },
    { href: '/jobs', label: 'Jobs', icon: (
      <svg viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="13" rx="2"/><path d="M9 6V4h6v2M8 11h8M8 15h5"/></svg>
    ) },
    { href: '/candidates', label: 'Candidates', icon: (
      <svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><circle cx="17" cy="9" r="2"/><path d="M15.5 17.5c.7-.9 1.8-1.5 3-1.5 1.4 0 2.6.8 3.2 2"/></svg>
    ) },
    { href: '/interviews', label: 'Interviews', icon: (
      <svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16M8 14h4M8 17h8"/></svg>
    ) },
    { href: '/billing', label: 'Billing', icon: (
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M8 12h8"/></svg>
    ) }
  ];

  const adminLinks = [
    { href: '/team', label: 'Team Management', icon: (
      <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/></svg>
    ) },
    { href: '/settings', label: 'Settings', icon: (
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9 7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1"/></svg>
    ) }
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard' && pathname === '/dashboard') return true;
    return pathname.startsWith(href) && href !== '/dashboard';
  };

  const handleLogout = async () => {
     try {
       await logout();
     } catch (e) {
       console.error("Logout failed", e);
     }
  };

  const role = user?.role || 'RECRUITER';
  const isAdmin = role === 'ADMIN';

  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <Link className="logo" href="/">
          <span className="logo-mark">TF</span>
          <span className="sidebar-expanded-only"> TalentFlow AI</span>
        </Link>
      </div>

      <div className="sidebar-tenant">
        <div className="label">Current Tenant</div>
        <div className="name">Acme Corp HQ</div>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        <div className="nav-section">Recruitment</div>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-link ${isActive(link.href) ? 'active' : ''}`}
          >
            <span className="nav-ico">{link.icon}</span>
            <span className="sidebar-expanded-only">{link.label}</span>
          </Link>
        ))}

        {/* Admin section */}
        <div style={{ display: !isLoading && isAdmin ? undefined : 'none' }}>
          <div className="nav-section" data-role-only="ADMIN">Admin</div>
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${isActive(link.href) ? 'active' : ''}`}
              data-role-only="ADMIN"
            >
              <span className="nav-ico">{link.icon}</span>
              <span className="sidebar-expanded-only">{link.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Sidebar Controls */}
      <div className="sidebar-controls px-4 py-2 border-t border-border flex items-center gap-2 justify-between">
        <button
          onClick={toggleTheme}
          className="p-2 rounded hover:bg-surface-2 text-text-3 hover:text-text-1 flex items-center justify-center flex-1"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          {theme === 'light' ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              <span className="sidebar-expanded-only ml-2 text-xs font-semibold">Dark Mode</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
              <span className="sidebar-expanded-only ml-2 text-xs font-semibold">Light Mode</span>
            </>
          )}
        </button>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded hover:bg-surface-2 text-text-3 hover:text-text-1 flex items-center justify-center"
          title={sidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {sidebarExpanded ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
          )}
        </button>
      </div>

      <div className="sidebar-foot relative group cursor-pointer" onClick={handleLogout} title="Click to logout">
        <div className="avatar uppercase">{user?.fullName?.charAt(0) || 'U'}</div>
        <div className="sidebar-expanded-only">
          <strong className="truncate block max-w-[120px]">{user?.fullName || 'User'}</strong>
          <p>
            <span data-current-role>{!isLoading ? role : '...'}</span>
          </p>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
