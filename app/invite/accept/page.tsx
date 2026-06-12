'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { workspaceService } from '@/services/api/workspace.service';
import { useAuth } from '@/components/features/workspace/RoleContext';

type PageState = 'loading' | 'success' | 'error' | 'needs-login';

export default function AcceptInvitePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoading, refreshWorkspaces } = useAuth();

  const [pageState, setPageState] = useState<PageState>('loading');
  const [workspaceName, setWorkspaceName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    if (isLoading) return; // Wait for auth check to complete

    if (!token) {
      setPageState('error');
      setErrorMessage('No invitation token provided. The link may be invalid.');
      return;
    }

    if (!user) {
      // Save token to sessionStorage so we can use it after login
      sessionStorage.setItem('pendingInviteToken', token);
      setPageState('needs-login');
      return;
    }

    // User is logged in — accept the invitation
    const accept = async () => {
      try {
        const result = await workspaceService.acceptInvitation(token);
        setWorkspaceName(result.workspaceName);
        await refreshWorkspaces();
        setPageState('success');

        // Redirect to dashboard after 2.5s
        setTimeout(() => router.replace('/dashboard'), 2500);
      } catch (err: any) {
        setPageState('error');
        setErrorMessage(err?.message || 'The invitation may have expired or already been used.');
      }
    };

    void accept();
  }, [isLoading, user, token]);

  // After login redirect back with token
  const handleLoginRedirect = () => {
    router.push(`/login?next=/invite/accept?token=${encodeURIComponent(token ?? '')}`);
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        padding: '24px',
      }}
    >
      <div
        className="card pad"
        style={{
          width: 'min(440px, 100%)',
          display: 'grid',
          gap: 20,
          textAlign: 'center',
          animation: 'fade-in-up 0.3s cubic-bezier(0.16,1,0.3,1) forwards',
        }}
      >
        {/* Logo */}
        <Link className="logo" href="/" style={{ justifyContent: 'center' }}>
          <span className="logo-mark">TF</span>
          <span style={{ fontWeight: 800 }}>TalentFlow AI</span>
        </Link>

        {pageState === 'loading' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <svg className="animate-spin" style={{ width: 40, height: 40, color: 'var(--primary)' }}
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: 22 }}>Accepting invitation…</h1>
              <p>Please wait while we process your invitation.</p>
            </div>
          </>
        )}

        {pageState === 'success' && (
          <>
            <div
              style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'var(--green-soft)', display: 'grid',
                placeItems: 'center', margin: '0 auto',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="var(--green-text)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: 22, color: 'var(--green-text)' }}>You're in! 🎉</h1>
              <p style={{ marginTop: 8 }}>
                You've successfully joined <strong>{workspaceName}</strong>.
                <br />Redirecting you to the dashboard…
              </p>
            </div>
            <Link href="/dashboard" className="btn primary" style={{ justifyContent: 'center' }}>
              Go to Dashboard now
            </Link>
          </>
        )}

        {pageState === 'needs-login' && (
          <>
            <div
              style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'var(--primary-soft)', display: 'grid',
                placeItems: 'center', margin: '0 auto',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="var(--primary)" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: 22 }}>Login required</h1>
              <p style={{ marginTop: 8 }}>
                You need to be logged in to accept this workspace invitation.
                Your invitation will be processed automatically after login.
              </p>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              <button className="btn primary" onClick={handleLoginRedirect}>
                Login to accept invitation
              </button>
              <Link href="/signup" className="btn secondary" style={{ justifyContent: 'center' }}>
                Create an account
              </Link>
            </div>
          </>
        )}

        {pageState === 'error' && (
          <>
            <div
              style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'var(--red-soft)', display: 'grid',
                placeItems: 'center', margin: '0 auto',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="var(--red-text)" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M15 9l-6 6M9 9l6 6"/>
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: 22, color: 'var(--danger)' }}>Invitation invalid</h1>
              <p style={{ marginTop: 8 }}>{errorMessage}</p>
            </div>
            <Link href="/dashboard" className="btn secondary" style={{ justifyContent: 'center' }}>
              Go to Dashboard
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
