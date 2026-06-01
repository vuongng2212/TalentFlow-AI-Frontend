'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signupSchema } from '../../../services/schemas';
import { WorkspaceRole } from '../../../types';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('Avery Sloan');
  const [email, setEmail] = useState('avery@novaware.dev');
  const [password, setPassword] = useState('talentflow');
  const [confirmPassword, setConfirmPassword] = useState('talentflow');
  const [role, setRole] = useState<WorkspaceRole>('Recruiter');
  const [agree, setAgree] = useState(true);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agree?: string;
  }>({});
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg('');

    if (!agree) {
      setErrors({ agree: 'Accept terms to continue.' });
      return;
    }

    const validation = signupSchema.safeParse({ name, email, password, confirmPassword, role });
    if (!validation.success) {
      const fieldErrors: typeof errors = {};
      validation.error.issues.forEach((err) => {
        const path = err.path[0] as string;
        fieldErrors[path as keyof typeof errors] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSuccessMsg('Account created successfully! Redirecting...');
    setTimeout(() => {
      localStorage.setItem('tf-role', role);
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <main className="auth-page min-h-screen">
      <section className="auth-brand">
        <Link className="logo text-white" href="/">
          <span className="logo-mark">TF</span> TalentFlow AI
        </Link>
        <div>
          <h1 className="text-4xl font-extrabold" style={{ fontSize: '42px' }}>
            Create a role-aware hiring workspace.
          </h1>
          <p style={{ marginTop: '14px', maxWidth: '520px' }}>
            Invite recruiters, interviewers, and admins into a governed hiring operating system.
          </p>
        </div>
        <div className="quote-card">
          Growth plan teams typically start with jobs, CV upload, AI triage, and kanban automation enabled.
        </div>
      </section>
      <section className="auth-form">
        <form className="form-card" onSubmit={handleSubmit} noValidate>
          <div>
            <h1>Create account</h1>
            <p>Start your TalentFlow AI workspace.</p>
          </div>
          <div className="field">
            <label>Full name</label>
            <input
              className={`input ${errors.name ? 'error' : ''}`}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <span className="helper">{errors.name || ''}</span>
          </div>
          <div className="field">
            <label>Work email</label>
            <input
              className={`input ${errors.email ? 'error' : ''}`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span className="helper">{errors.email || ''}</span>
          </div>
          <div className="field">
            <label>Password</label>
            <input
              className={`input ${errors.password ? 'error' : ''}`}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="helper">{errors.password || ''}</span>
          </div>
          <div className="field">
            <label>Confirm password</label>
            <input
              className={`input ${errors.confirmPassword ? 'error' : ''}`}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span className="helper">{errors.confirmPassword || ''}</span>
          </div>
          <div className="field">
            <label>Primary role</label>
            <select
              className="select animate-none"
              value={role}
              onChange={(e) => setRole(e.target.value as WorkspaceRole)}
            >
              <option value="Recruiter">Recruiter</option>
              <option value="Admin">Admin</option>
            </select>
            <span className="helper"></span>
          </div>
          <div>
            <label style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', color: 'var(--text-2)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                required
              />{' '}
              I agree to the workspace terms and AI-assisted screening policy.
            </label>
            <span className="helper">{errors.agree || ''}</span>
          </div>
          <button className="btn primary" style={{ width: '100%', cursor: 'pointer' }}>
            Create Account
          </button>
          {successMsg && (
            <p style={{ color: 'var(--success)', fontWeight: 700, marginTop: '10px', textAlign: 'center' }}>
              {successMsg}
            </p>
          )}
          <p style={{ textAlign: 'center', marginTop: '10px' }}>
            Already have an account?{' '}
            <Link style={{ color: 'var(--primary)', fontWeight: 800 }} href="/login">
              Login
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
