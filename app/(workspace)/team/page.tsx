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
  const [removing, setRemoving] = useState<string | null>(null);
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
  }, [loadMembers]);

  const handleRemove = async (memberId: string, memberUserId: string) => {
    if (!activeWorkspace?.id) return;
    if (!confirm('Remove this member from the workspace?')) return;
    setRemoving(memberUserId);
    try {
      await workspaceService.removeMember(activeWorkspace.id, memberUserId);
      setMembers((prev) => prev.filter((m) => m.userId !== memberUserId));
    } catch (e) {
      console.error('Failed to remove member', e);
      alert('Failed to remove member. Please try again.');
    } finally {
      setRemoving(null);
    }
  };

  return (
    <>
      <header className="topbar">
        <div className="crumb">
          {activeWorkspace?.name ?? 'Workspace'} <span className="text-slate-300 dark:text-zinc-600 mx-1">/</span> <strong>Team Directory</strong>
        </div>
        {canManage && (
          <button
            className="btn primary"
            onClick={() => setInviteOpen(true)}
            style={{ cursor: 'pointer' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/></svg>
            Invite Member
          </button>
        )}
      </header>

      <section className="content">
        <div className="page-head">
          <div>
            <h1 className="text-2xl font-bold">Team Directory</h1>
            <p>
              {members.length} active member{members.length !== 1 ? 's' : ''} in{' '}
              <strong>{activeWorkspace?.name}</strong>
              {activeWorkspace?.isBusiness && (
                <span className="chip ml-2" style={{ fontSize: '10px', padding: '2px 8px' }}>✦ Business</span>
              )}
            </p>
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton type="table" count={5} />
        ) : members.length > 0 ? (
          <div className="card overflow-hidden">
            <div className="table-wrap">
              <table className="density-tight">
                <thead>
                  <tr className="bg-surface-2/50 border-b border-border">
                    <th>Member</th>
                    <th>Email</th>
                    <th>Workspace Role</th>
                    <th>Joined</th>
                    {canManage && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => {
                    const roleMeta = ROLE_BADGE[member.role] ?? { label: member.role, variant: 'applied' };
                    const isSelf = member.userId === user?.id;
                    const isOwner = member.role === 'OWNER';

                    return (
                      <tr key={member.id} className="group">
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="avatar sm w-6 h-6 text-[10px]">
                              {member.user?.fullName?.charAt(0) || '?'}
                            </div>
                            <span className="font-bold text-text-1 group-hover:text-primary transition-colors">
                              {member.user?.fullName ?? 'Unknown'}
                              {isSelf && (
                                <span className="ml-1 text-text-4 text-xs font-normal">(you)</span>
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="text-text-2">{member.user?.email}</td>
                        <td>
                          <Badge variant={roleMeta.variant as any}>{roleMeta.label}</Badge>
                        </td>
                        <td className="text-text-4 font-medium">
                          {member.createdAt
                            ? new Date(member.createdAt).toLocaleDateString()
                            : '—'}
                        </td>
                        {canManage && (
                          <td>
                            {!isSelf && !isOwner ? (
                              <button
                                className="btn ghost"
                                style={{ minHeight: 28, padding: '0 10px', fontSize: 12, color: 'var(--danger)' }}
                                disabled={removing === member.userId}
                                onClick={() => handleRemove(member.id, member.userId)}
                              >
                                {removing === member.userId ? 'Removing…' : 'Remove'}
                              </button>
                            ) : (
                              <span className="text-text-4 text-xs">—</span>
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
    </>
  );
}