'use client';

import React, { useState, useEffect } from 'react';
import { getInvoices } from '../../../services/mockData';
import { Invoice } from '../../../types';
import Badge, { BadgeProps } from '../../../components/ui/badge';

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [updatingPlan, setUpdatingPlan] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const list = await getInvoices();
      setInvoices(list);
    }
    load();
  }, []);

  return (
    <>
      <header className="topbar bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800">
        <div className="crumb text-slate-500 dark:text-zinc-400">
          Workspace <span className="mx-2 text-slate-300 dark:text-zinc-700">/</span> <strong className="text-slate-900 dark:text-zinc-50 font-bold">Billing</strong>
        </div>
        <button
          className="btn primary text-xs h-8 px-3"
          disabled={!!updatingPlan}
          onClick={() => setUpdatingPlan('update')}
        >
          {updatingPlan === 'update' ? 'Updating...' : 'Update plan'}
        </button>
      </header>

      <section className="content bg-noise">
        <div className="page-head mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-50">Plans & Billing</h1>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Track seats, AI credits, invoices, and subscription tiers.</p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
          {/* Free Tier */}
          <div className="card bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80 p-6 flex flex-col justify-between shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="badge closed text-[10px] font-bold uppercase tracking-wider">Free</span>
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold uppercase">Personal</span>
              </div>
              <h2 className="font-jakarta text-3xl font-black text-slate-900 dark:text-zinc-50 tracking-tight mb-2">
                $0
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed mb-6">
                For trying out TalentFlow. 2 active jobs · 50 AI parses · single recruiter seats.
              </p>
            </div>
            <button
              className="btn secondary w-full cursor-pointer mt-4"
              disabled={!!updatingPlan}
              onClick={() => setUpdatingPlan('free')}
            >
              {updatingPlan === 'free' ? 'Downgrading...' : 'Downgrade'}
            </button>
          </div>

          {/* Plus Tier (Current) */}
          <div className="card bg-white dark:bg-zinc-900 border-2 border-indigo-600 dark:border-indigo-500 p-6 flex flex-col justify-between shadow-[0_4px_20px_-4px_rgba(79,70,229,0.1)] dark:shadow-none relative hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
              Current Plan
            </div>
            <div>
              <div className="flex justify-between items-center mb-4 mt-1">
                <span className="badge screening text-[10px] font-bold uppercase tracking-wider">Plus</span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold uppercase">Individual</span>
              </div>
              <h2 className="font-jakarta text-3xl font-black text-slate-900 dark:text-zinc-50 tracking-tight mb-2 flex items-baseline gap-1">
                <span className="tabular-data">$49</span>
                <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium">/ seat / month</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed mb-6">
                For independent/freelance recruiters. Expanded CV parsing limits, candidate synthesis, and advanced AI scoring rubrics.
              </p>
            </div>
            <button
              className="btn primary w-full cursor-pointer mt-4"
              disabled={!!updatingPlan}
              onClick={() => setUpdatingPlan('plus')}
            >
              {updatingPlan === 'plus' ? 'Loading...' : 'Manage Subscription'}
            </button>
          </div>

          {/* Business Tier */}
          <div className="card bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80 p-6 flex flex-col justify-between shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="badge open text-[10px] font-bold uppercase tracking-wider">Custom</span>
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold uppercase">Business</span>
              </div>
              <h2 className="font-jakarta text-3xl font-black text-slate-900 dark:text-zinc-50 tracking-tight mb-2">
                Enterprise
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed mb-6">
                For teams and agencies. SSO integration, custom audit exports, shared quota pools, and dedicated support.
              </p>
            </div>
            <button
              className="btn secondary w-full cursor-pointer mt-4"
              disabled={!!updatingPlan}
              onClick={() => setUpdatingPlan('business')}
            >
              {updatingPlan === 'business' ? 'Loading...' : 'Contact Sales'}
            </button>
          </div>
        </div>

        {/* Usage & Invoices Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {/* Usage Stats Card */}
          <div className="card p-6 bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80">
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-50 mb-6">Current Usage</h2>

            <div className="flex flex-col gap-5">
              {/* Seats usage */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500 dark:text-zinc-400">Team Seats</span>
                  <span className="text-slate-900 dark:text-zinc-100 tabular-data font-bold">24 / 30 active</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-slate-800 dark:bg-slate-300 h-full rounded-full" style={{ width: '80%' }} />
                </div>
              </div>

              {/* AI Parses usage */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500 dark:text-zinc-400">AI Resume Parses</span>
                  <span className="text-slate-900 dark:text-zinc-100 tabular-data font-bold">8,421 / 12,000 monthly</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-slate-800 dark:bg-slate-300 h-full rounded-full" style={{ width: '70.1%' }} />
                </div>
              </div>

              {/* Open jobs usage */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500 dark:text-zinc-400">Active Job Postings</span>
                  <span className="text-slate-900 dark:text-zinc-100 tabular-data font-bold">18 positions open</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-slate-800 dark:bg-slate-300 h-full rounded-full" style={{ width: '60%' }} />
                </div>
              </div>

              {/* Storage usage */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500 dark:text-zinc-400">Candidate Attachment Storage</span>
                  <span className="text-slate-900 dark:text-zinc-100 tabular-data font-bold">42 GB utilized</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-slate-800 dark:bg-slate-300 h-full rounded-full" style={{ width: '42%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Invoices Card */}
          <div className="lg:col-span-2 card p-6 bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80">
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-50 mb-6">Billing History</h2>

            <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-zinc-800">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-zinc-800/50">
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Invoice</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Billing Date</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Amount</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {invoices.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-sm text-slate-400 dark:text-zinc-500 font-medium">
                        No billing history found.
                      </td>
                    </tr>
                  ) : (
                    invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors duration-150">
                        <td className="px-4 py-3 font-semibold text-xs text-slate-900 dark:text-zinc-100 tabular-data">
                          {inv.id}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-zinc-400 tabular-data">
                          {inv.date}
                        </td>
                        <td className="px-4 py-3 font-bold text-sm text-slate-900 dark:text-zinc-50 tabular-data">
                          {inv.amount}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={inv.status.toLowerCase() as BadgeProps['variant']}>
                            {inv.status.toUpperCase()}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
