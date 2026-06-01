import React from 'react';
import Link from 'next/link';
import { getDashboardStats } from '../../../services/mockData';
import Badge from '../../../components/ui/badge';
import WelcomeHeader from './WelcomeHeader';

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <>
      <header className="topbar">
        <div className="crumb">
          TalentFlow / <strong>Dashboard</strong>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span className="chip">3 alerts</span>
          <div className="avatar">AS</div>
        </div>
      </header>

      <section className="content">
        <WelcomeHeader />

        <div className="grid-4">
          <div className="card stat-card">
            <div className="stat-top">
              <span>Open Positions</span>
              <span className="stat-icon">▣</span>
            </div>
            <div className="stat-number">{stats.activeJobs}</div>
            <span className="trend">↑ 4 this week</span>
          </div>
          <div className="card stat-card">
            <div className="stat-top">
              <span>Total Applications</span>
              <span className="stat-icon">◉</span>
            </div>
            <div className="stat-number">{stats.totalCandidates * 12}</div>
            <span className="trend">↑ 16% vs last month</span>
          </div>
          <div className="card stat-card">
            <div className="stat-top">
              <span>Active Candidates</span>
              <span className="stat-icon">↗</span>
            </div>
            <div className="stat-number">{stats.totalCandidates}</div>
            <span className="trend">{stats.interviewsThisWeek} in interview</span>
          </div>
          <div className="card stat-card">
            <div className="stat-top">
              <span>Interviews Scheduled</span>
              <span className="stat-icon">◷</span>
            </div>
            <div className="stat-number">{stats.interviewsThisWeek * 2}</div>
            <span className="trend">9 need feedback</span>
          </div>
        </div>

        <div className="grid-60" style={{ marginTop: '18px' }}>
          <div className="card pad">
            <div className="page-head">
              <div>
                <h2>Recent Job Postings</h2>
                <p>Open roles with current application velocity.</p>
              </div>
              <Link className="btn secondary" href="/jobs">
                View jobs
              </Link>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Location</th>
                    <th>Apps</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentJobs.map((job) => (
                    <tr key={job.id}>
                      <td>
                        <Link href={`/jobs/${job.id}`} className="hover:underline font-semibold">
                          {job.title}
                        </Link>
                      </td>
                      <td>{job.location}</td>
                      <td>{job.applicantsCount || 72}</td>
                      <td>
                        <Badge variant={job.status}>{job.status.toUpperCase()}</Badge>
                      </td>
                      <td>
                        {new Date(job.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card pad">
            <div className="page-head">
              <div>
                <h2>Recent Candidates</h2>
                <p>AI-ranked movement across active roles.</p>
              </div>
            </div>
            <div className="list">
              {stats.recentCandidates.map((cand) => (
                <div key={cand.id} className="candidate-row py-2 border-b border-gray-100 last:border-b-0">
                  <div className="avatar">{cand.avatar}</div>
                  <div>
                    <Link href={`/candidates/${cand.id}`} className="hover:underline font-semibold block">
                      {cand.name}
                    </Link>
                    <p className="text-xs text-gray-500">
                      {cand.title} · <Badge variant={cand.stage}>{cand.stage.toUpperCase()}</Badge>
                    </p>
                  </div>
                  <span className={`score sm ${cand.scoreCategory}`}>{cand.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
