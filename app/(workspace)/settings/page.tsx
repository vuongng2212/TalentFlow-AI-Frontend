'use client';

import React, { useState } from 'react';
import { workspaceSettingsSchema } from '../../../services/schemas';
import { useUIStore } from '../../../lib/store/useUIStore';

interface AuditLog {
  event: string;
  actor: string;
  time: string;
}

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { event: 'Exported candidate CSV', actor: 'Morgan Reyes', time: 'Today 10:41' },
  { event: 'Changed role permission', actor: 'Morgan Reyes', time: 'Yesterday' },
  { event: 'AI score override', actor: 'Avery Sloan', time: 'May 29' },
];

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const { showLoading, hideLoading } = useUIStore();
  const [workspaceName, setWorkspaceName] = useState('Novaware');
  const [companyDomain, setCompanyDomain] = useState('novaware.dev');
  const [inboundEmail, setInboundEmail] = useState('apply@novaware.talentflow.ai');
  const [autoParse, setAutoParse] = useState(true);
  const [createAbove60, setCreateAbove60] = useState(true);
  const [allowRoleToggles, setAllowRoleToggles] = useState(true);

  const [errors, setErrors] = useState<{ workspaceName?: string; companyDomain?: string; inboundEmail?: string }>({});
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg('');

    const validation = workspaceSettingsSchema.safeParse({
      workspaceName,
      companyDomain,
      allowRoleToggles,
    });

    if (!validation.success) {
      const fieldErrors: typeof errors = {};
      validation.error.issues.forEach((err) => {
        const path = err.path[0] as string;
        if (path === 'workspaceName') fieldErrors.workspaceName = err.message;
        if (path === 'companyDomain') fieldErrors.companyDomain = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (!inboundEmail.includes('@') || !inboundEmail.includes('.')) {
      setErrors({ inboundEmail: 'Invalid inbound email structure' });
      return;
    }

    showLoading('Saving settings...');
    setIsSaving(true);
    setSuccessMsg('Settings saved successfully!');
    setTimeout(() => {
      hideLoading();
      setIsSaving(false);
      setSuccessMsg('');
    }, 3000);
  };

  return (
    <>
      <header className="topbar">
        <div className="crumb">
          Workspace / <strong>Settings</strong>
        </div>
        <button className="btn primary" onClick={handleSave} style={{ cursor: 'pointer' }}>
          Save changes
        </button>
      </header>

      <section className="content">
        <div className="page-head">
          <div>
            <h1 className="text-2xl font-bold">Workspace Settings</h1>
            <p>Configure ingestion, integrations, AI scoring, security, and audit controls.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="grid-2" noValidate>
          <div className="card pad space-y-4">
            <h2>General Configuration</h2>
            <div className="field">
              <label>Workspace Name</label>
              <input
                type="text"
                className={`input ${errors.workspaceName ? 'error' : ''}`}
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                required
              />
              {errors.workspaceName && <span className="helper">{errors.workspaceName}</span>}
            </div>
            <div className="field">
              <label>Company Domain</label>
              <input
                type="text"
                className={`input ${errors.companyDomain ? 'error' : ''}`}
                value={companyDomain}
                onChange={(e) => setCompanyDomain(e.target.value)}
                required
              />
              {errors.companyDomain && <span className="helper">{errors.companyDomain}</span>}
            </div>
            <label style={{ display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={allowRoleToggles}
                onChange={(e) => setAllowRoleToggles(e.target.checked)}
              />
              Allow role toggles in sidebar navigation menu
            </label>
          </div>

          <div className="card pad">
            <h2>Automation Ingestion</h2>
            <div className="list" style={{ marginTop: '12px' }}>
              <div className="field">
                <label>Inbound resume email</label>
                <input
                  className={`input ${errors.inboundEmail ? 'error' : ''}`}
                  value={inboundEmail}
                  onChange={(e) => setInboundEmail(e.target.value)}
                  required
                />
                {errors.inboundEmail && <span className="helper">{errors.inboundEmail}</span>}
              </div>
              <label style={{ display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={autoParse}
                  onChange={(e) => setAutoParse(e.target.checked)}
                />{' '}
                Auto-parse uploaded CVs
              </label>
              <label style={{ display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={createAbove60}
                  onChange={(e) => setCreateAbove60(e.target.checked)}
                />{' '}
                Create candidate when score is above 60
              </label>
            </div>
          </div>

          <div className="card pad">
            <h2>Integrations</h2>
            <div className="list" style={{ marginTop: '12px', fontSize: '13px' }}>
              <p>
                <strong>Google Calendar:</strong> Connected
              </p>
              <p>
                <strong>Slack:</strong> #hiring-platform alerts
              </p>
              <p>
                <strong>Greenhouse import:</strong> Scheduled nightly
              </p>
              <button type="button" className="btn secondary mt-2" style={{ cursor: 'pointer' }}>
                Manage integrations
              </button>
            </div>
          </div>

          <div className="card pad">
            <h2>AI Scoring Policy</h2>
            <p style={{ marginTop: '8px', fontSize: '13px' }} className="text-gray-600">
              Scores must show evidence, gaps, and confidence. Recruiter overrides require a note and are included in
              audit exports.
            </p>
            <div className="skills" style={{ marginTop: '12px' }}>
              <span className="chip ai-chip">AI ✦ explanation required</span>
              <span className="chip">Override note</span>
              <span className="chip">Bias review</span>
            </div>
          </div>

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
                  {INITIAL_AUDIT_LOGS.map((log, index) => (
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

        {successMsg && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 font-bold text-center">
            {successMsg}
          </div>
        )}
      </section>
    </>
  );
}
