'use client';

import React, { useState } from 'react';
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
    } catch (err: any) {
      setError(
        err?.message ||
          (workspace.isBusiness
            ? 'Failed to send invitation. Please try again.'
            : 'Failed to add member. Make sure the user is registered in the system.'),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(4px)', zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="card"
        style={{
          width: 'min(460px, 100%)',
          padding: '24px',
          display: 'grid',
          gap: '20px',
          animation: 'fade-in-up 0.2s cubic-bezier(0.16,1,0.3,1) forwards',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: 18 }}>
              {workspace.isBusiness ? 'Invite Member' : 'Add Member'}
            </h2>
            <p style={{ marginTop: 4, fontSize: 13 }}>
              {workspace.isBusiness
                ? `Send an email invitation to join "${workspace.name}"`
                : `Add an existing user to "${workspace.name}"`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn ghost"
            style={{ minHeight: 32, padding: '0 8px', color: 'var(--text-3)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Plan badge */}
        {workspace.isBusiness ? (
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 12px', background: 'var(--ai-soft)',
              borderRadius: 8, border: '1px solid var(--ai-glow)',
              fontSize: 13, color: 'var(--green-text)', fontWeight: 600,
            }}
          >
            <span>✦</span>
            <span>Business workspace — invitation email will be sent automatically</span>
          </div>
        ) : (
          <div
            style={{
              padding: '10px 12px', background: 'var(--surface-2)',
              borderRadius: 8, border: '1px solid var(--border)',
              fontSize: 12, color: 'var(--text-3)',
            }}
          >
            💡 Personal/Plus workspace: the user must already have a TalentFlow account.
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          {/* Email */}
          <div className="field">
            <label>Email address</label>
            <input
              type="email"
              className="input"
              placeholder="colleague@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoFocus
            />
          </div>

          {/* Role selector */}
          <div className="field">
            <label>Workspace role</label>
            <div style={{ display: 'grid', gap: 6 }}>
              {ROLES.map((r) => (
                <label
                  key={r.value}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                    border: `1px solid ${role === r.value ? 'var(--primary)' : 'var(--border)'}`,
                    background: role === r.value ? 'var(--primary-soft)' : 'var(--surface)',
                    transition: 'all 0.12s',
                  }}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r.value}
                    checked={role === r.value}
                    onChange={() => setRole(r.value)}
                    style={{ display: 'none' }}
                  />
                  <div
                    style={{
                      width: 16, height: 16, borderRadius: '50%',
                      border: `2px solid ${role === r.value ? 'var(--primary)' : 'var(--border)'}`,
                      display: 'grid', placeItems: 'center',
                    }}
                  >
                    {role === r.value && (
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }} />
                    )}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: role === r.value ? 'var(--primary)' : 'var(--text-1)' }}>
                      {r.label}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{r.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Feedback */}
          {error && (
            <div style={{
              padding: '10px 12px', background: 'var(--red-soft)',
              border: '1px solid rgba(220,38,38,.2)', borderRadius: 8,
              color: 'var(--red-text)', fontSize: 13, fontWeight: 600,
            }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{
              padding: '10px 12px', background: 'var(--green-soft)',
              border: '1px solid rgba(4,120,87,.2)', borderRadius: 8,
              color: 'var(--green-text)', fontSize: 13, fontWeight: 600,
            }}>
              ✓ {success}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="btn secondary" onClick={onClose} disabled={loading}>
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
    </div>
  );
}
