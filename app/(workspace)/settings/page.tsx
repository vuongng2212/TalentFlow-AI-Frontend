'use client';

import React, { useState, useEffect } from 'react';
import { workspaceService } from '../../../services/api/workspace.service';
import { useAuth } from '../../../components/features/workspace/RoleContext';
import { useUIStore } from '../../../lib/store/useUIStore';

interface AuditLog {
  event: string;
  actor: string;
  time: string;
}

const MOCK_AUDIT_LOGS: AuditLog[] = [
  { event: 'Workspace settings updated', actor: 'You', time: 'Just now' },
  { event: 'Member invited', actor: 'You', time: 'Today' },
  { event: 'AI score override', actor: 'Avery Sloan', time: 'May 29' },
];

export default function SettingsPage() {
  const { activeWorkspace, refreshWorkspaces, user } = useAuth();
  const { showLoading, hideLoading } = useUIStore();

  const [workspaceName, setWorkspaceName] = useState('');
  const [isBusiness, setIsBusiness] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [nameError, setNameError] = useState('');

  const canEdit =
    activeWorkspace?.memberRole === 'OWNER' ||
    activeWorkspace?.memberRole === 'ADMIN';

  // Sync form fields whenever active workspace changes
  useEffect(() => {
    if (activeWorkspace) {
      setWorkspaceName(activeWorkspace.name);
      setIsBusiness(activeWorkspace.isBusiness);
    }
  }, [activeWorkspace?.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setNameError('');

    if (!workspaceName.trim() || workspaceName.trim().length < 2) {
      setNameError('Workspace name must be at least 2 characters.');
      return;
    }

    if (!activeWorkspace?.id) return;

    showLoading('Saving workspace settings…');
    setIsSaving(true);

    try {
      await workspaceService.updateWorkspace(activeWorkspace.id, {
        name: workspaceName.trim(),
        isBusiness,
      });
      await refreshWorkspaces();
      setSuccessMsg('Workspace settings saved successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to save settings. Please try again.');
    } finally {
      hideLoading();
      setIsSaving(false);
    }
  };

  return (
    <>
      <header className="topbar">
        <div className="crumb">
          {activeWorkspace?.name ?? 'Workspace'} <span className="text-slate-300 dark:text-zinc-600 mx-1">/</span> <strong>Settings</strong>
        </div>
        {canEdit && (
          <button
            className="btn primary"
            onClick={handleSave}
            disabled={isSaving}
            style={{ cursor: 'pointer' }}
          >
            {isSaving ? 'Saving…' : 'Save changes'}
          </button>
        )}
      </header>

      <section className="content">
        <div className="page-head">
          <div>
            <h1 className="text-2xl font-bold">Workspace Settings</h1>
            <p>Configure your workspace name, plan, and operational policies.</p>
          </div>
          {activeWorkspace?.memberRole && (
            <span className="chip" style={{ fontSize: 11 }}>
              Your role: <strong style={{ marginLeft: 4 }}>{activeWorkspace.memberRole}</strong>
            </span>
          )}
        </div>

        {/* Feedback banners */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-lg font-bold text-center"
            style={{ background: 'var(--green-soft)', border: '1px solid rgba(4,120,87,.2)', color: 'var(--green-text)', marginBottom: 16 }}>
            ✓ {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg font-bold text-center"
            style={{ background: 'var(--red-soft)', border: '1px solid rgba(220,38,38,.2)', color: 'var(--red-text)', marginBottom: 16 }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSave} className="grid-2" noValidate>
          {/* General Configuration */}
          <div className="card pad space-y-4">
            <h2>General Configuration</h2>

            <div className="field" style={{ marginTop: 16 }}>
              <label>Workspace Name</label>
              <input
                type="text"
                className={`input ${nameError ? 'error' : ''}`}
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                disabled={!canEdit || isSaving}
                maxLength={150}
                required
              />
              {nameError && <span className="helper">{nameError}</span>}
            </div>

            <div style={{ marginTop: 8 }}>
              <label
                style={{
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                  cursor: canEdit ? 'pointer' : 'not-allowed',
                  opacity: canEdit ? 1 : 0.6,
                  padding: '12px', borderRadius: 8,
                  border: `1px solid ${isBusiness ? 'var(--ai)' : 'var(--border)'}`,
                  background: isBusiness ? 'var(--ai-soft)' : 'var(--surface-2)',
                  transition: 'all 0.12s',
                }}
              >
                <input
                  type="checkbox"
                  checked={isBusiness}
                  onChange={(e) => setIsBusiness(e.target.checked)}
                  disabled={!canEdit || isSaving}
                  style={{ marginTop: 2 }}
                />
                <div>
                  <div style={{ fontWeight: 700, color: isBusiness ? 'var(--green-text)' : 'var(--text-1)', fontSize: 13 }}>
                    ✦ Business Plan
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
                    Enables email invitations, SSO, audit exports, and custom score rubrics.
                  </div>
                </div>
              </label>
            </div>

            {!canEdit && (
              <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 8 }}>
                Only workspace Owners and Admins can edit settings.
              </p>
            )}
          </div>

          {/* Workspace Info (read-only) */}
          <div className="card pad">
            <h2>Workspace Details</h2>
            <div className="list" style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--text-3)', fontWeight: 600 }}>Workspace ID</span>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-3)' }}>
                  {activeWorkspace?.id?.slice(0, 8)}…
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--text-3)', fontWeight: 600 }}>Plan</span>
                <span className={`chip ${isBusiness ? 'ai-chip' : ''}`} style={{ fontSize: 10 }}>
                  {isBusiness ? '✦ Business' : 'Personal'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--text-3)', fontWeight: 600 }}>Members</span>
                <span style={{ fontWeight: 700 }}>{activeWorkspace?.memberCount ?? '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--text-3)', fontWeight: 600 }}>Created</span>
                <span>
                  {activeWorkspace?.createdAt
                    ? new Date(activeWorkspace.createdAt).toLocaleDateString()
                    : '—'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--text-3)', fontWeight: 600 }}>Your role</span>
                <span style={{ fontWeight: 700 }}>{activeWorkspace?.memberRole ?? '—'}</span>
              </div>
            </div>
          </div>

          {/* AI Scoring Policy */}
          <div className="card pad">
            <h2>AI Scoring Policy</h2>
            <p style={{ marginTop: 8, fontSize: 13 }} className="text-gray-600">
              Scores must show evidence, gaps, and confidence. Recruiter overrides require a note and are included in
              audit exports.
            </p>
            <div className="skills" style={{ marginTop: 12 }}>
              <span className="chip ai-chip">AI ✦ explanation required</span>
              <span className="chip">Override note</span>
              <span className="chip">Bias review</span>
            </div>
          </div>

          {/* Integrations */}
          <div className="card pad">
            <h2>Integrations</h2>
            <div className="list" style={{ marginTop: 12, fontSize: 13 }}>
              <p><strong>Google Calendar:</strong> Connected</p>
              <p><strong>Slack:</strong> #hiring-platform alerts</p>
              <p><strong>Greenhouse import:</strong> Scheduled nightly</p>
              <button type="button" className="btn secondary mt-2" style={{ cursor: 'pointer' }}>
                Manage integrations
              </button>
            </div>
          </div>

          {/* Security & Audit */}
          <div className="card pad" style={{ gridColumn: '1 / -1' }}>
            <h2>Security & Audit</h2>
            <div className="table-wrap mt-3">
              <table>
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Actor</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_AUDIT_LOGS.map((log, index) => (
                    <tr key={index}>
                      <td className="font-semibold text-xs">{log.event}</td>
                      <td>{log.actor}</td>
                      <td>{log.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </form>
      </section>
    </>
  );
}
