'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left side: Brand/Illustration */}
      <section className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-slate-900 p-12 lg:p-16 xl:p-24 border-r border-slate-800 dark:bg-zinc-950 dark:border-zinc-900">
        {/* Ambient glowing effect */}
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-150 h-150 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5 text-white group">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white font-black text-[11px] tracking-wider shadow-md group-hover:bg-indigo-500 transition-colors">
              TF
            </div>
            <span className="font-jakarta text-xl font-bold tracking-tight">TalentFlow AI</span>
          </Link>

          <div className="mt-24">
            <h1 className="font-jakarta text-4xl font-extrabold tracking-tight text-white sm:text-5xl leading-[1.05] text-balance">
              Recruiting intelligence for serious hiring teams.
            </h1>
            <p className="mt-6 text-lg text-slate-300 dark:text-zinc-400 max-w-md leading-relaxed text-pretty">
              Score candidates, manage pipelines, and keep every hiring stakeholder aligned from one enterprise workspace.
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-24">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-md">
            <div className="absolute -top-3 -left-2 text-6xl font-serif text-indigo-300/20 select-none pointer-events-none">
              &ldquo;
            </div>
            <p className="relative z-10 text-slate-200 text-[15px] leading-relaxed italic mb-6">
              We cut the first review loop from two days to one morning, and the score explanation made hiring managers trust the shortlist.
            </p>
            <div className="flex items-center gap-3.5 pt-4 border-t border-white/10">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-indigo-200/20">
                <Image src="https://i.pravatar.cc/150?u=elena" alt="Elena Brooks" fill className="object-cover" unoptimized />
              </div>
              <div>
                <h4 className="font-jakarta text-sm font-bold text-white">Elena Brooks</h4>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Head of Talent <span className="mx-1 text-slate-600">&bull;</span> Helios AI</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right side: Form */}
      <section className="flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-white dark:bg-zinc-950 relative">
        {/* Mobile Header (Hidden on LG) */}
        <div className="absolute top-6 left-6 lg:hidden">
          <Link href="/" className="inline-flex items-center gap-2.5 text-slate-900 dark:text-white">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white font-black text-[11px] tracking-wider shadow-md">
              TF
            </div>
            <span className="font-jakarta text-xl font-bold tracking-tight">TalentFlow AI</span>
          </Link>
        </div>

        <div className="w-full max-w-md space-y-8 mt-12 lg:mt-0">
          <div className="text-center lg:text-left">
            <h2 className="font-jakarta text-3xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">
              Login to continue reviewing candidates.
            </p>

            <div className="mt-6 text-xs text-slate-600 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-slate-200 dark:border-zinc-800/80 text-left">
              <span className="font-bold text-slate-800 dark:text-zinc-200 block mb-2 uppercase tracking-wider text-[10px]">Default Test Accounts</span>
              <div className="space-y-1">
                <div className="flex justify-between items-center"><span className="font-medium">Admin:</span> <code className="bg-slate-200/50 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[11px]">seed-admin@talentflow.invalid</code></div>
                <div className="flex justify-between items-center"><span className="font-medium">Recruiter:</span> <code className="bg-slate-200/50 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[11px]">seed-recruiter@talentflow.invalid</code></div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200 dark:border-zinc-800"><span className="font-medium">Password:</span> <code className="bg-slate-200/50 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[11px]">SeedPassword123!</code></div>
              </div>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {errors.form && (
              <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm font-medium border border-red-100 dark:border-red-900/30 flex items-start gap-2">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{errors.form}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300">Email address</label>
              <input
                className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 dark:border-red-900/50 dark:focus:border-red-500' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-zinc-800 dark:focus:border-indigo-500'} bg-white dark:bg-zinc-900/50 text-slate-900 dark:text-zinc-50 outline-none transition-all duration-200 shadow-xs`}
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {errors.email && <span className="text-xs text-red-500 font-medium mt-1 block">{errors.email}</span>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300">Password</label>
              <input
                className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 dark:border-red-900/50 dark:focus:border-red-500' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-zinc-800 dark:focus:border-indigo-500'} bg-white dark:bg-zinc-900/50 text-slate-900 dark:text-zinc-50 outline-none transition-all duration-200 shadow-xs`}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {errors.password && <span className="text-xs text-red-500 font-medium mt-1 block">{errors.password}</span>}
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-zinc-400 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="peer appearance-none w-4 h-4 border border-slate-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 checked:bg-indigo-600 checked:border-indigo-600 transition-colors cursor-pointer"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 14 14" fill="none">
                    <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
                  </svg>
                </div>
                <span className="group-hover:text-slate-900 dark:group-hover:text-zinc-300 transition-colors">Remember me</span>
              </label>

              <Link href="#" className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className={`w-full h-11 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-500 hover:shadow-indigo-600/20 transition-all duration-200 active:scale-[0.98] active:translate-y-0.5 hover:-translate-y-0.5 mt-4 ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </>
              ) : 'Login'}
            </button>

            {successMsg && (
              <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm text-center mt-3 bg-emerald-50 dark:bg-emerald-500/10 p-2.5 rounded-lg">
                {successMsg}
              </p>
            )}

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white dark:bg-zinc-950 px-4 text-xs text-slate-500 dark:text-zinc-500 uppercase tracking-wider font-semibold">
                  or
                </span>
              </div>
            </div>

            <p className="text-center text-sm text-slate-600 dark:text-zinc-400">
              Don&apos;t have an account?{' '}
              <Link className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors" href="/signup">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
