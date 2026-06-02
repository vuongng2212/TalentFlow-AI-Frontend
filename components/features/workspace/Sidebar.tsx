'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './RoleContext';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

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
          <span className="logo-mark">TF</span> TalentFlow AI
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
            {link.label}
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
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="sidebar-foot relative group cursor-pointer" onClick={handleLogout} title="Click to logout">
        <div className="avatar uppercase">{user?.fullName?.charAt(0) || 'U'}</div>
        <div>
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
