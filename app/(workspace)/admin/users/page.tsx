'use client';

import React, { useState } from 'react';
import RoleGuard from '../../../../components/features/workspace/RoleGuard';
import Badge from '../../../../components/ui/badge';
import Modal from '../../../../components/ui/dialog/Modal';
import { userInvitationSchema } from '../../../../services/schemas';
import { useUIStore } from '../../../../lib/store/useUIStore';

interface WorkspaceUser {
  id: string;
  name: string;
  email: string;
  role: 'Recruiter' | 'Interviewer' | 'Admin';
  teams: string;
  status: 'active' | 'invited';
  lastActive: string;
}

const INITIAL_USERS: WorkspaceUser[] = [
  {
    id: 'u1',
    name: 'Avery Sloan',
    email: 'avery@novaware.dev',
    role: 'Recruiter',
    teams: 'Platform, Design',
    status: 'active',
    lastActive: '8 min ago',
  },
  {
    id: 'u2',
    name: 'Nora Walsh',
    email: 'nora@novaware.dev',
    role: 'Interviewer',
    teams: 'Engineering',
    status: 'active',
    lastActive: '1 hr ago',
  },
  {
    id: 'u3',
    name: 'Morgan Reyes',
    email: 'morgan@novaware.dev',
    role: 'Admin',
    teams: 'All workspace',
    status: 'active',
    lastActive: 'Today',
  },
  {
    id: 'u4',
    name: 'Sam Lee',
    email: 'sam@novaware.dev',
    role: 'Interviewer',
    teams: 'ML Platform',
    status: 'invited',
    lastActive: 'Pending',
  },
];

export default function UserManagementPage() {
  const [users, setUsers] = useState<WorkspaceUser[]>(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Invite Form fields
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Recruiter' | 'Admin'>('Recruiter');
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const { showLoading, hideLoading } = useUIStore();

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError('');
    setInviteSuccess('');

    const validation = userInvitationSchema.safeParse({ email: inviteEmail, role: inviteRole });
    if (!validation.success) {
      setInviteError(validation.error.issues[0].message);
      return;
    }

    // Add to state
    const newUser: WorkspaceUser = {
      id: `u-${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      teams: 'Ad-hoc',
      status: 'invited',
      lastActive: 'Pending',
    };

    setUsers([...users, newUser]);
    setInviteEmail('');
    showLoading('Sending invitation...');
    setInviteLoading(true);
    setInviteSuccess('Invitation sent successfully!');
    setTimeout(() => {
      hideLoading();
      setInviteLoading(false);
      setShowInviteModal(false);
      setInviteSuccess('');
    }, 1000);
  };

  const filteredUsers = users.filter((u) => {
    if (statusFilter === 'open' && u.status !== 'active') return false;
    if (statusFilter === 'draft' && u.status !== 'invited') return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <RoleGuard>
      <header className="topbar">
        <div className="crumb">
          Admin <span className="text-slate-300 dark:text-zinc-600 mx-1">/</span> <strong>User Management</strong>
        </div>
        <button
          className="btn primary"
          onClick={() => setShowInviteModal(true)}
          style={{ cursor: 'pointer' }}
        >
          Invite User
        </button>
      </header>

      <section className="content">
        <div className="page-head">
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p>Govern recruiting access across recruiters, interviewers, and admins.</p>
          </div>
        </div>

        <div className="toolbar">
          <input
            className="input"
            type="text"
            placeholder="Search by name, email, role"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="select animate-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All seats</option>
            <option value="open">Active</option>
            <option value="draft">Invited</option>
          </select>
        </div>

        <div className="card pad">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Teams</th>
                  <th>Status</th>
                  <th>Last active</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </td>
                    <td>{user.role}</td>
                    <td>{user.teams}</td>
                    <td>
                      <Badge variant={user.status === 'active' ? 'open' : 'draft'}>
                        {user.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td>{user.lastActive}</td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      No workspace members match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid-2" style={{ marginTop: '18px' }}>
          <div className="card pad">
            <h2>Role Permissions</h2>
            <p style={{ marginTop: '8px', fontSize: '13px' }} className="text-gray-600">
              Recruiters manage jobs and candidates. Interviewers review assigned dossiers and submit feedback. Admins
              manage users, billing, audit, and integrations.
            </p>
          </div>
          <div className="card pad">
            <h2>Seat Health</h2>
            <p style={{ marginTop: '8px', fontSize: '13px' }} className="text-gray-600">
              24 active seats, 1 pending invite, 5 available on the Plus plan.
            </p>
          </div>
        </div>
      </section>

      <Modal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} title="Invite Workspace User">
        <form onSubmit={handleInviteUser} className="space-y-4" noValidate>
          <div className="field">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">Work Email</label>
            <input
              type="email"
              className={`input ${inviteError ? 'error' : ''}`}
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="name@company.com"
              required
            />
            {inviteError && <span className="helper">{inviteError}</span>}
          </div>
          <div className="field">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">Workspace Role</label>
            <select
              className="select animate-none"
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as 'Recruiter' | 'Admin')}
            >
              <option value="Recruiter">Recruiter</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          {inviteSuccess && <p className="text-green-600 font-bold text-sm text-center">{inviteSuccess}</p>}
          <div className="flex justify-end gap-3 pt-5 border-t border-slate-100 dark:border-zinc-800/60 mt-6 bg-slate-50/50 dark:bg-zinc-900/10 -mx-6 -mb-6 p-6">
            <button
              type="button"
              className="btn secondary"
              onClick={() => setShowInviteModal(false)}
              disabled={inviteLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn primary"
              disabled={inviteLoading}
            >
              {inviteLoading ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </form>
      </Modal>
    </RoleGuard>
  );
}
