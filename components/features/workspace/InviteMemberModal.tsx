'use client';

import React, { useState } from 'react';
import Modal from '../../ui/dialog/Modal';
import { workspaceService } from '@/services/api/workspace.service';
import { Workspace, WorkspaceMemberRole } from '@/types';

interface Props {
  workspace: Workspace;
  onClose: () => void;
  onSuccess: () => void;
}

const ROLES: { value: WorkspaceMemberRole; label: string; description: string }[] = [
  { value: 'ADMIN',     label: 'Admin',     description: 'Manage members and settings' },
  { value: 'RECRUITER', label: 'Recruiter', description: 'Post jobs, review candidates' },
  { value: 'VIEWER',    label: 'Viewer',    description: 'Read-only access' },
];

export default function InviteMemberModal({ workspace, onClose, onSuccess }: Props) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<WorkspaceMemberRole>('RECRUITER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      if (workspace.isBusiness) {
        // Business workspaces: send email invitation token
        await workspaceService.createInvitation(workspace.id, { email: email.trim(), role });
        setSuccess(`Invitation sent to ${email}. They will receive an email to accept.`);
      } else {
        // Personal/Plus workspaces: add existing user directly
        await workspaceService.addMember(workspace.id, { email: email.trim(), role });
        setSuccess(`${email} has been added to the workspace.`);
      }

      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(
        error?.message ||
          (workspace.isBusiness
            ? 'Failed to send invitation. Please try again.'
            : 'Failed to add member. Make sure the user is registered in the system.'),
      );
    } finally {
      setLoading(false);
    }
  };

  const title = workspace.isBusiness ? 'Invite Member' : 'Add Member';

  return (
    <Modal isOpen={true} onClose={onClose} title={title}>
      <div className="flex flex-col gap-4">
        {/* Description message */}
        <p className="text-sm text-slate-500 dark:text-zinc-400">
          {workspace.isBusiness
            ? `Send an email invitation to join "${workspace.name}"`
            : `Add an existing user to "${workspace.name}"`}
        </p>

        {/* Plan badge banner */}
        {workspace.isBusiness ? (
          <div className="flex items-center gap-2.5 p-3.5 bg-emerald-500/10 dark:bg-emerald-950/10 border border-emerald-500/20 dark:border-emerald-500/20 rounded-xl text-xs font-semibold text-emerald-800 dark:text-emerald-400">
            <span className="text-base">✦</span>
            <span>Business workspace — invitation email will be sent automatically</span>
          </div>
        ) : (
          <div className="p-3.5 bg-slate-50 dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800/80 rounded-xl text-xs text-slate-500 dark:text-zinc-400">
            💡 Personal/Plus workspace: the user must already have a TalentFlow account.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input field */}
          <div className="field">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
              Email address
            </label>
            <input
              type="email"
              className="input w-full"
              placeholder="colleague@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoFocus
            />
          </div>

          {/* Role selection section */}
          <div className="field">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
              Workspace role
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {ROLES.map((r) => (
                <label
                  key={r.value}
                  className={`flex items-center gap-3.5 p-3.5 rounded-xl cursor-pointer border transition-all duration-200 ${
                    role === r.value
                      ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/10'
                      : 'border-slate-200 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/10 hover:border-slate-300 dark:hover:border-zinc-700/80'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r.value}
                    checked={role === r.value}
                    onChange={() => setRole(r.value)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      role === r.value
                        ? 'border-indigo-600 dark:border-indigo-400'
                        : 'border-slate-350 dark:border-zinc-700'
                    }`}
                  >
                    {role === r.value && (
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                    )}
                  </div>
                  <div>
                    <div
                      className={`font-bold text-sm leading-tight transition-colors ${
                        role === r.value
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-800 dark:text-zinc-200'
                      }`}
                    >
                      {r.label}
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5 leading-normal">
                      {r.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Feedback alerts */}
          {error && (
            <div className="p-3.5 bg-red-50 dark:bg-red-950/25 border border-red-100 dark:border-red-900/35 text-red-700 dark:text-red-400 rounded-xl text-sm font-semibold">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/25 border border-emerald-100 dark:border-emerald-900/35 text-emerald-700 dark:text-emerald-400 rounded-xl text-sm font-semibold">
              ✓ {success}
            </div>
          )}

          {/* Bottom aligned action CTA panel */}
          <div className="flex justify-end gap-3 pt-5 border-t border-slate-100 dark:border-zinc-800/60 mt-6 bg-slate-50/50 dark:bg-zinc-900/10 -mx-6 -mb-6 p-6">
            <button
              type="button"
              className="btn secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn primary"
              disabled={loading || !!success}
            >
              {loading
                ? workspace.isBusiness ? 'Sending…' : 'Adding…'
                : workspace.isBusiness ? 'Send Invitation' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
