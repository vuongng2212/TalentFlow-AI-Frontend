'use client';

import React, { useState, useEffect } from 'react';
import { getInvoices } from '../../../services/mockData';
import { Invoice } from '../../../types';
import { useUIStore } from '../../../lib/store/useUIStore';
import Badge from '../../../components/ui/badge';

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [updatingPlan, setUpdatingPlan] = useState<string | null>(null);
  const { showLoading, hideLoading } = useUIStore();

  useEffect(() => {
    async function load() {
      const list = await getInvoices();
      setInvoices(list);
    }
    load();
  }, []);

  return (
    <>
      <header className="topbar">
        <div className="crumb">
          Workspace / <strong>Billing</strong>
        </div>
        <button className="btn primary" style={{ cursor: 'pointer' }} disabled={!!updatingPlan} onClick={() => setUpdatingPlan('update')}>
          {updatingPlan === 'update' ? 'Updating...' : 'Update plan'}
        </button>
      </header>

      <section className="content">
        <div className="page-head">
          <div>
            <h1 className="text-2xl font-bold">Plans & Billing</h1>
            <p>Track seats, AI credits, invoices, and upgrade paths.</p>
          </div>
        </div>

        <div className="grid-3">
          <div className="card pad">
            <span className="badge closed">Personal</span>
            <h2 style={{ marginTop: '12px', fontSize: '20px', fontWeight: 'bold' }}>Free</h2>
            <p className="text-xs text-gray-500 mt-1">2 active jobs · 50 AI parses · single recruiter.</p>
            <button className="btn secondary" style={{ marginTop: '16px', width: '100%', cursor: 'pointer' }} disabled={!!updatingPlan} onClick={() => setUpdatingPlan('free')}>
              {updatingPlan === 'free' ? 'Downgrading...' : 'Downgrade'}
            </button>
          </div>
          <div className="card pad" style={{ borderColor: 'var(--primary)', boxShadow: 'var(--shadow-ai)' }}>
            <span className="badge screening">Current · Plus</span>
            <h2 style={{ marginTop: '12px', fontSize: '20px', fontWeight: 'bold' }}>$49 / seat</h2>
            <p className="text-xs text-gray-500 mt-1">For individual/freelancers. Expanded CV parsing limits, candidate synthesis, and AI scoring.</p>
            <button className="btn primary" style={{ marginTop: '16px', width: '100%', cursor: 'pointer' }} disabled={!!updatingPlan} onClick={() => setUpdatingPlan('plus')}>
              {updatingPlan === 'plus' ? 'Loading...' : 'Manage Plus'}
            </button>
          </div>
          <div className="card pad">
            <span className="badge open">Business</span>
            <h2 style={{ marginTop: '12px', fontSize: '20px', fontWeight: 'bold' }}>Custom</h2>
            <p className="text-xs text-gray-500 mt-1">SSO, audit exports, custom score rubrics, dedicated support.</p>
            <button className="btn secondary" style={{ marginTop: '16px', width: '100%', cursor: 'pointer' }} disabled={!!updatingPlan} onClick={() => setUpdatingPlan('business')}>
              {updatingPlan === 'business' ? 'Loading...' : 'Contact sales'}
            </button>
          </div>
        </div>

        <div className="grid-2" style={{ marginTop: '18px' }}>
          <div className="card pad">
            <h2>Current Usage</h2>
            <div className="list" style={{ marginTop: '12px' }}>
              <p>
                <strong>Seats:</strong> 24 of 30
              </p>
              <p>
                <strong>AI parses:</strong> 8,421 of 12,000
              </p>
              <p>
                <strong>Open jobs:</strong> 18
              </p>
              <p>
                <strong>Storage:</strong> 42 GB candidate attachments
              </p>
            </div>
          </div>
          <div className="card pad">
            <h2>Invoices</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Invoice Code</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id}>
                      <td className="font-semibold text-xs">{inv.id}</td>
                      <td>{inv.date}</td>
                      <td className="font-semibold">{inv.amount}</td>
                      <td>
                        <Badge variant="open">{inv.status.toUpperCase()}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
