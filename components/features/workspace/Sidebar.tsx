'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from './RoleContext';
import { useUIStore } from '@/lib/store/useUIStore';
import WorkspaceSwitcher from './WorkspaceSwitcher';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();

  const sidebarExpanded = useUIStore((state) => state.sidebarExpanded);
  const theme = useUIStore((state) => state.theme);
  const toggleTheme = useUIStore((state) => state.toggleTheme);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
    ) },
    { href: '/jobs', label: 'Jobs', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
    ) },
    { href: '/candidates', label: 'Candidates', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    ) },
    { href: '/interviews', label: 'Interviews', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><rect x="8" y="14" width="8" height="4" rx="1"/></svg>
    ) },
    { href: '/billing', label: 'Billing', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
    ) }
  ];

  const adminLinks = [
    { href: '/team', label: 'Team', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    ) },
    { href: '/settings', label: 'Settings', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
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

  // Seed avatar for consistency
  const userSeed = user?.email || 'admin@talentflow.invalid';

  return (
    <aside className="sidebar bg-slate-50 dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800">
      <div className="sidebar-head border-b border-slate-200 dark:border-zinc-800 h-16 flex items-center px-5">
        <Link className="flex items-center gap-3 text-slate-900 dark:text-white" href="/">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white font-black text-[11px] tracking-wider shadow-md shrink-0">
            TF
          </div>
          <span className="sidebar-expanded-only font-jakarta text-lg font-bold tracking-tight">TalentFlow AI</span>
        </Link>
      </div>

      <div className="sidebar-tenant border-b border-slate-200 dark:border-zinc-800 bg-transparent py-2">
        <WorkspaceSwitcher />
      </div>

      <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        <div className="nav-section text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest px-4 mb-2">Recruitment</div>
        <div className="px-3 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link group flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-all duration-200 font-semibold text-sm ${isActive(link.href) ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 shadow-sm border border-indigo-100 dark:border-indigo-500/20' : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-200 border border-transparent'}`}
            >
              <span className={`nav-ico shrink-0 transition-colors ${isActive(link.href) ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-zinc-500 group-hover:text-slate-600 dark:group-hover:text-zinc-400'}`}>
                {link.icon}
              </span>
              <span className="sidebar-expanded-only">{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Admin section */}
        <div style={{ display: !isLoading && isAdmin ? 'block' : 'none' }} className="mt-8">
          <div className="nav-section text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest px-4 mb-2" data-role-only="ADMIN">Administration</div>
          <div className="px-3 space-y-1">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link group flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-all duration-200 font-semibold text-sm ${isActive(link.href) ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 shadow-sm border border-indigo-100 dark:border-indigo-500/20' : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-200 border border-transparent'}`}
                data-role-only="ADMIN"
              >
                <span className={`nav-ico shrink-0 transition-colors ${isActive(link.href) ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-zinc-500 group-hover:text-slate-600 dark:group-hover:text-zinc-400'}`}>
                  {link.icon}
                </span>
                <span className="sidebar-expanded-only">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Sidebar Controls */}
      <div className="sidebar-controls px-4 py-3 border-t border-slate-200 dark:border-zinc-800 flex items-center gap-2 justify-between bg-slate-50 dark:bg-zinc-950">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-zinc-800 hover:bg-white dark:hover:bg-zinc-900 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 flex items-center justify-center flex-1 transition-all duration-200"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          {theme === 'light' ? (
            <>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              <span className="sidebar-expanded-only ml-2 text-[11px] font-bold uppercase tracking-wider">Dark Mode</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
              <span className="sidebar-expanded-only ml-2 text-[11px] font-bold uppercase tracking-wider">Light Mode</span>
            </>
          )}
        </button>
        <button
          onClick={toggleSidebar}
          className="p-2.5 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-zinc-800 hover:bg-white dark:hover:bg-zinc-900 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 flex items-center justify-center transition-all duration-200"
          title={sidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {sidebarExpanded ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M11 19l-7-7 7-7M20 19l-7-7 7-7" /></svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M13 5l7 7-7 7M4 5l7 7-7 7" /></svg>
          )}
        </button>
      </div>

      <div
        className="sidebar-foot relative group cursor-pointer p-4 border-t border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors flex items-center gap-3"
        onClick={handleLogout}
        title="Click to logout"
      >
        <div className="relative w-9 h-9 shrink-0 overflow-hidden rounded-[10px] border border-slate-200 dark:border-zinc-700 shadow-sm">
          <Image src={`https://i.pravatar.cc/150?u=${userSeed}`} alt={user?.fullName || "User"} fill className="object-cover" unoptimized />
        </div>
        <div className="sidebar-expanded-only flex-1 min-w-0">
          <strong className="block text-sm font-bold text-slate-900 dark:text-zinc-50 truncate leading-tight">
            {user?.fullName || 'User'}
          </strong>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 truncate block mt-0.5">
            {!isLoading ? role : '...'}
          </span>
        </div>
        <div className="sidebar-expanded-only shrink-0 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
