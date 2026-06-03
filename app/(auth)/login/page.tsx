'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginSchema } from '../../../services/schemas';
import { useAuth } from '../../../components/features/workspace/RoleContext';
import { useUIStore } from '../../../lib/store/useUIStore';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('seed-admin@talentflow.invalid');
  const [password, setPassword] = useState('SeedPassword123!');
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [successMsg, setSuccessMsg] = useState('');

  const { login, isLoading } = useAuth();
  const { showLoading, hideLoading } = useUIStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg('');

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      const fieldErrors: typeof errors = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0] === 'email') fieldErrors.email = err.message;
        if (err.path[0] === 'password') fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await login({ email, password });
      setSuccessMsg('Login successful! Redirecting...');
      // Navigation is handled inside the login function in AuthProvider
    } catch (err: any) {
      hideLoading();
      setErrors({ form: err?.message || 'Invalid credentials' });
    }
  };

  return (
    <main className="auth-page min-h-screen">
      <section className="auth-brand">
        <Link className="logo text-white" href="/">
          <span className="logo-mark">TF</span> TalentFlow AI
        </Link>
        <div>
          <h1 className="text-4xl font-extrabold" style={{ fontSize: '42px' }}>
            Recruiting intelligence for serious hiring teams.
          </h1>
          <p style={{ marginTop: '14px', maxWidth: '520px' }}>
            Score candidates, manage pipelines, and keep every hiring stakeholder aligned from one enterprise workspace.
          </p>
        </div>
        <div className="quote-card">
          &quot;TalentFlow gives our recruiters the context they need before the hiring sync starts.&quot;
          <br />
          <strong style={{ display: 'block', marginTop: '14px' }}>
            Elena Brooks, Head of Talent at Helios AI
          </strong>
        </div>
      </section>
      <section className="auth-form">
        <form className="form-card" onSubmit={handleSubmit} noValidate>
          <div>
            <h1>Welcome back</h1>
            <p>Login to continue reviewing candidates.</p>
            <div className="mt-2 text-xs text-text-3 p-2 bg-surface-2 rounded-md border border-border">
              Default seeds:<br/>
              Admin: seed-admin@talentflow.invalid<br/>
              Recruiter: seed-recruiter@talentflow.invalid<br/>
              Pass: SeedPassword123!
            </div>
          </div>

          {errors.form && (
            <div className="bg-danger/10 text-danger p-3 rounded-md text-sm font-semibold border border-danger/20 mb-4">
              {errors.form}
            </div>
          )}

          <div className="field">
            <label>Email</label>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
            <label style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--text-2)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />{' '}
              Remember me
            </label>
            <a style={{ color: 'var(--primary)', fontWeight: 700 }} href="#">
              Forgot password?
            </a>
          </div>
          <button
             className={`btn primary ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
             style={{ width: '100%', cursor: 'pointer' }}
             disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          {successMsg && (
            <p style={{ color: 'var(--success)', fontWeight: 700, marginTop: '10px', textAlign: 'center' }}>
              {successMsg}
            </p>
          )}
          <div className="divider">or</div>
          <p style={{ textAlign: 'center' }}>
            Don&apos;t have an account?{' '}
            <Link style={{ color: 'var(--primary)', fontWeight: 800 }} href="/signup">
              Sign up
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}