'use client';

import React, { useState } from 'react';
import { workspaceService } from '../../../services/api/workspace.service';
import { useAuth } from '../../../components/features/workspace/RoleContext';
import { useUIStore } from '../../../lib/store/useUIStore';
import { Workspace } from '../../../types';

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
  const { activeWorkspace, refreshWorkspaces } = useAuth();
  const { showLoading, hideLoading } = useUIStore();

  return (
    <SettingsForm
      key={activeWorkspace?.id}
      activeWorkspace={activeWorkspace}
      refreshWorkspaces={refreshWorkspaces}
      showLoading={showLoading}
      hideLoading={hideLoading}
    />
  );
}

function SettingsForm({
  activeWorkspace,
  refreshWorkspaces,
  showLoading,
  hideLoading
}: {
  activeWorkspace: Workspace | null;
  refreshWorkspaces: () => Promise<void>;
  showLoading: (m: string) => void;
  hideLoading: () => void;
}) {
  const [workspaceName, setWorkspaceName] = useState(activeWorkspace?.name || '');
  const [isBusiness, setIsBusiness] = useState(activeWorkspace?.isBusiness || false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [nameError, setNameError] = useState('');

  // AI Policy settings (clean slider control instead of badge cliches)
  const [minMatchScore, setMinMatchScore] = useState(70);

  const canEdit =
    activeWorkspace?.memberRole === 'OWNER' ||
    activeWorkspace?.memberRole === 'ADMIN';

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
    } catch (err: unknown) {
      const error = err as { message?: string };
      setErrorMsg(error?.message || 'Failed to save settings. Please try again.');
    } finally {
      hideLoading();
      setIsSaving(false);
    }
  };

  return (
    <>
      <header className="topbar bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800">
        <div className="crumb text-slate-500 dark:text-zinc-400">
          {activeWorkspace?.name ?? 'Workspace'} <span className="mx-2 text-slate-300 dark:text-zinc-700">/</span> <strong className="text-slate-900 dark:text-zinc-50 font-bold">Settings</strong>
        </div>
        {canEdit && (
          <button
            className="btn primary text-xs h-8 px-3 cursor-pointer"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving…' : 'Save changes'}
          </button>
        )}
      </header>

      <section className="content bg-noise">
        <div className="page-head mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-50">Workspace Settings</h1>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Configure your workspace details, operational policies, and integrations.</p>
          </div>
          {activeWorkspace?.memberRole && (
            <span className="chip text-[11px] font-medium border border-slate-200 dark:border-zinc-700">
              Your role: <strong className="ml-1 text-slate-900 dark:text-zinc-100 font-bold">{activeWorkspace.memberRole}</strong>
            </span>
          )}
        </div>

        {/* Feedback banners */}
        {successMsg && (
          <div className="mb-6 p-3 rounded-xl font-bold text-center bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
            ✓ {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 p-3 rounded-xl font-bold text-center bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10" noValidate>
          {/* General Configuration */}
          <div className="card p-6 bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80 flex flex-col gap-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-3">
              General Configuration
            </h2>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Workspace Name</label>
              <input
                type="text"
                className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-50 outline-none transition-all ${nameError ? 'border-red-500' : 'border-slate-200 dark:border-zinc-800 focus:border-indigo-500'}`}
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                disabled={!canEdit || isSaving}
                maxLength={150}
                required
              />
              {nameError && <span className="text-xs text-red-500 font-medium mt-1">{nameError}</span>}
            </div>

            <div>
              <label
                className={`flex gap-3 items-start p-4 rounded-xl border transition-all ${
                  isBusiness
                    ? 'border-indigo-500/30 bg-indigo-50/20 dark:bg-indigo-950/10'
                    : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
                } ${canEdit ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
              >
                <input
                  type="checkbox"
                  className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  checked={isBusiness}
                  onChange={(e) => {
                    if (e.target.checked) {
                      const confirm = window.confirm("Are you sure you want to upgrade to the Business plan? This will unlock SSO, audit exports, and custom scoring rubrics.");
                      if (!confirm) return;
                    }
                    setIsBusiness(e.target.checked);
                  }}
                  disabled={!canEdit || isSaving}
                />
                <div>
                  <span className={`text-sm font-bold block ${isBusiness ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-zinc-100'}`}>
                    ✦ Business Plan
                  </span>
                  <span className="text-xs text-slate-500 dark:text-zinc-400 mt-1 block leading-relaxed">
                    Enables email invitations, SSO authentication, security audit exports, and custom candidate scoring rubrics.
                  </span>
                </div>
              </label>
            </div>

            {!canEdit && (
              <p className="text-xs text-slate-400 dark:text-zinc-500">
                Only workspace Owners and Admins can modify settings.
              </p>
            )}
          </div>

          {/* Workspace Info (read-only) */}
          <div className="card p-6 bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80 flex flex-col gap-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-3">
              Workspace Details
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-zinc-800/50 pb-2">
                <span className="text-slate-500 dark:text-zinc-400 font-medium">Workspace ID</span>
                <span className="font-mono text-xs text-slate-600 dark:text-zinc-400 tabular-data bg-slate-50 dark:bg-zinc-800 px-2 py-0.5 rounded">
                  {activeWorkspace?.id || '—'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-zinc-800/50 pb-2">
                <span className="text-slate-500 dark:text-zinc-400 font-medium">Current Plan</span>
                <span className={`badge ${isBusiness ? 'screening' : 'closed'} text-[10px] font-bold uppercase`}>
                  {isBusiness ? '✦ Business' : 'Personal Free'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-zinc-800/50 pb-2">
                <span className="text-slate-500 dark:text-zinc-400 font-medium">Workspace Members</span>
                <span className="font-bold text-slate-900 dark:text-zinc-100 tabular-data">{activeWorkspace?.memberCount ?? '—'}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-zinc-800/50 pb-2">
                <span className="text-slate-500 dark:text-zinc-400 font-medium">Creation Date</span>
                <span className="text-slate-900 dark:text-zinc-100 tabular-data">
                  {activeWorkspace?.createdAt
                    ? new Date(activeWorkspace.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* AI Scoring Policy */}
          <div className="card p-6 bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80 flex flex-col gap-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-3">
              AI Scoring Policy
            </h2>
            <div className="flex flex-col gap-4">
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                Determine the threshold and parameters for automated AI fit diagnostics. Higher values require stronger resume alignment.
              </p>

              {/* Slider UI */}
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-600 dark:text-zinc-300">Minimum Fit Threshold</span>
                  <span className="tabular-data text-indigo-600 dark:text-indigo-400 font-extrabold text-sm">{minMatchScore}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={minMatchScore}
                  onChange={(e) => setMinMatchScore(Number(e.target.value))}
                  className="w-full accent-indigo-600 dark:accent-indigo-500 h-1 rounded-lg bg-slate-100 dark:bg-zinc-800 cursor-pointer"
                />
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/50 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                  Evidence-first Diagnosis
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 dark:text-zinc-300">
                  Audit Overrides enabled
                </span>
              </div>
            </div>
          </div>

          {/* Integrations */}
          <div className="card p-6 bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80 flex flex-col gap-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-3">
              Connected Integrations
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-zinc-800/50 pb-2.5">
                <div>
                  <span className="font-semibold block text-slate-900 dark:text-zinc-100">Google Calendar</span>
                  <span className="text-xs text-slate-500 dark:text-zinc-400">Sync interview availability.</span>
                </div>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md">Connected</span>
              </div>

              <div className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-zinc-800/50 pb-2.5">
                <div>
                  <span className="font-semibold block text-slate-900 dark:text-zinc-100">Slack Notifications</span>
                  <span className="text-xs text-slate-500 dark:text-zinc-400">Alerts routed to #hiring-platform.</span>
                </div>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md">Connected</span>
              </div>

              <div className="flex justify-between items-center text-sm pb-1">
                <div>
                  <span className="font-semibold block text-slate-900 dark:text-zinc-100">Greenhouse ATS</span>
                  <span className="text-xs text-slate-500 dark:text-zinc-400">Scheduled CV import active.</span>
                </div>
                <span className="text-xs text-slate-500 dark:text-zinc-400 font-bold bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">Syncing</span>
              </div>

              <button type="button" className="btn secondary text-xs w-full py-1.5 cursor-pointer mt-1">
                Configure Integrations
              </button>
            </div>
          </div>

          {/* Security & Audit */}
          <div className="card p-6 bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80 md:col-span-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-50 mb-6">Security & Workspace Logs</h2>
            <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-zinc-800">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-zinc-800/50">
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Operation / Event</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Actor</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Time elapsed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {MOCK_AUDIT_LOGS.map((log, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors duration-150">
                      <td className="px-4 py-3 font-semibold text-xs text-slate-900 dark:text-zinc-100">
                        {log.event}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-zinc-400">
                        {log.actor}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500 dark:text-zinc-500 tabular-data">
                        {log.time}
                      </td>
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
