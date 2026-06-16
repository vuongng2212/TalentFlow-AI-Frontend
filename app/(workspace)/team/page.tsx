'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { workspaceService } from '../../../services/api/workspace.service';
import { WorkspaceMember, WorkspaceMemberRole } from '../../../types';
import LoadingSkeleton from '../../../components/ui/LoadingSkeleton';
import { useAuth } from '../../../components/features/workspace/RoleContext';
import { useMinDuration } from '../../../hooks/useMinDuration';
import EmptyState from '../../../components/ui/EmptyState';
import Badge from '../../../components/ui/badge';
import InviteMemberModal from '../../../components/features/workspace/InviteMemberModal';

const ROLE_BADGE: Record<WorkspaceMemberRole, { label: string; variant: string }> = {
  OWNER:     { label: 'Owner',     variant: 'offer' },
  ADMIN:     { label: 'Admin',     variant: 'interview' },
  RECRUITER: { label: 'Recruiter', variant: 'screening' },
  VIEWER:    { label: 'Viewer',    variant: 'applied' },
};

export default function TeamPage() {
  const { activeWorkspace, user } = useAuth();
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);

  // Custom dialog state instead of window.confirm/alert
  const [confirmDeleteMember, setConfirmDeleteMember] = useState<{ id: string, userId: string, name: string } | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const minDur = useMinDuration();

  const canManage =
    activeWorkspace?.memberRole === 'OWNER' ||
    activeWorkspace?.memberRole === 'ADMIN';

  const loadMembers = useCallback(async () => {
    if (!activeWorkspace?.id) return;
    minDur.start();
    setLoading(true);
    try {
      const list = await workspaceService.listMembers(activeWorkspace.id);
      setMembers(list);
    } catch (e) {
      console.error('Failed to load workspace members', e);
    } finally {
      minDur.end(() => setLoading(false));
    }
  }, [activeWorkspace?.id]);

  useEffect(() => {
    loadMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeWorkspace?.id]);

  const handleRemove = async () => {
    if (!activeWorkspace?.id || !confirmDeleteMember) return;
    const { id, userId } = confirmDeleteMember;
    setRemoving(userId);
    setErrorMessage('');
    try {
      await workspaceService.removeMember(activeWorkspace.id, userId);
      setMembers((prev) => prev.filter((m) => m.userId !== userId));
      setSuccessMessage('Member removed successfully.');
      setTimeout(() => setSuccessMessage(''), 4000);
      setConfirmDeleteMember(null);
    } catch (e) {
      console.error('Failed to remove member', e);
      setErrorMessage('Failed to remove member. Please try again.');
    } finally {
      setRemoving(null);
    }
  };

  return (
    <>
      <header className="topbar bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800">
        <div className="crumb text-slate-500 dark:text-zinc-400">
          {activeWorkspace?.name ?? 'Workspace'} <span className="mx-2 text-slate-300 dark:text-zinc-700">/</span> <strong className="text-slate-900 dark:text-zinc-50 font-bold">Team Directory</strong>
        </div>
        {canManage && (
          <button
            className="btn primary text-xs h-8 px-3 cursor-pointer"
            onClick={() => setInviteOpen(true)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/></svg>
            Invite Member
          </button>
        )}
      </header>

      <section className="content bg-noise">
        <div className="page-head mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-50">Team Directory</h1>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
              {members.length} active member{members.length !== 1 ? 's' : ''} collaborating in{' '}
              <strong className="text-slate-950 dark:text-zinc-200">{activeWorkspace?.name}</strong>
              {activeWorkspace?.isBusiness && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/50 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 ml-2">
                  ✦ Business Plan
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Success/Error Banners */}
        {successMessage && (
          <div className="mb-6 p-3 rounded-xl font-bold text-center bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
            ✓ {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-6 p-3 rounded-xl font-bold text-center bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400">
            {errorMessage}
          </div>
        )}

        {loading ? (
          <LoadingSkeleton type="table" count={5} />
        ) : members.length > 0 ? (
          <div className="card bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none overflow-hidden relative z-10">
            <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-zinc-800">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-zinc-800/50">
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Member</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Email Address</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Workspace Role</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Joined Date</th>
                    {canManage && <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {members.map((member) => {
                    const roleMeta = ROLE_BADGE[member.role] ?? { label: member.role, variant: 'applied' };
                    const isSelf = member.userId === user?.id;
                    const isOwner = member.role === 'OWNER';

                    return (
                      <tr key={member.id} className="group hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors duration-150">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 font-bold flex items-center justify-center text-xs">
                              {member.user?.fullName?.charAt(0) || '?'}
                            </div>
                            <span className="font-bold text-slate-900 dark:text-zinc-100 group-hover:text-primary transition-colors flex items-center gap-1.5">
                              {member.user?.fullName ?? 'Unknown'}
                              {isSelf && (
                                <span className="text-[10px] font-medium text-slate-400 dark:text-zinc-500 bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">(you)</span>
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-zinc-400 tabular-data">{member.user?.email}</td>
                        <td className="px-4 py-3">
                          <Badge variant={roleMeta.variant as any}>{roleMeta.label}</Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500 dark:text-zinc-400 tabular-data">
                          {member.createdAt
                            ? new Date(member.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                            : '—'}
                        </td>
                        {canManage && (
                          <td className="px-4 py-3 text-right">
                            {!isSelf && !isOwner ? (
                              <button
                                className="btn ghost hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 text-xs h-7 px-2.5 rounded-md cursor-pointer border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                                disabled={removing === member.userId}
                                onClick={() => setConfirmDeleteMember({
                                  id: member.id,
                                  userId: member.userId,
                                  name: member.user?.fullName ?? 'Unknown'
                                })}
                              >
                                {removing === member.userId ? 'Removing…' : 'Remove'}
                              </button>
                            ) : (
                              <span className="text-slate-400 dark:text-zinc-500 text-xs mr-4">—</span>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <EmptyState
            title="No team members found"
            description="Invite colleagues to collaborate on hiring."
            action={canManage ? { label: 'Invite Member', onClick: () => setInviteOpen(true) } : undefined}
          />
        )}
      </section>

      {inviteOpen && activeWorkspace && (
        <InviteMemberModal
          workspace={activeWorkspace}
          onClose={() => setInviteOpen(false)}
          onSuccess={() => {
            setInviteOpen(false);
            loadMembers();
          }}
        />
      )}

      {/* Confirmation Dialog (replaces window.confirm) */}
      {confirmDeleteMember && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl max-w-md w-full flex flex-col gap-4 animate-fade-in-up">
            <h3 className="font-jakarta text-lg font-bold text-slate-900 dark:text-zinc-50">
              Remove Team Member
            </h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
              Are you sure you want to remove <strong className="text-slate-900 dark:text-zinc-100 font-bold">{confirmDeleteMember.name}</strong> from the workspace? They will lose all access to job pipelines and candidate folders.
            </p>
            <div className="flex gap-3 justify-end mt-2">
              <button
                className="btn secondary text-xs h-9 cursor-pointer"
                onClick={() => setConfirmDeleteMember(null)}
                disabled={removing !== null}
              >
                Cancel
              </button>
              <button
                className="btn danger text-xs h-9 cursor-pointer"
                onClick={handleRemove}
                disabled={removing !== null}
              >
                {removing ? 'Removing...' : 'Confirm Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
