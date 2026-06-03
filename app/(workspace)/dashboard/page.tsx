'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Badge from '../../../components/ui/badge';
import WelcomeHeader from './WelcomeHeader';
import { analyticsService } from '../../../services/api/analytics.service';
import { DashboardMetrics, TopJobData, PipelineStageCount, TrendData } from '../../../types';
import { useUIStore } from '../../../lib/store/useUIStore';
import { useMinDuration } from '../../../hooks/useMinDuration';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardMetrics | null>(null);
  const [topJobs, setTopJobs] = useState<TopJobData[]>([]);
  const [pipeline, setPipeline] = useState<PipelineStageCount[]>([]);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const minDur = useMinDuration();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, topJobsRes, pipelineRes, trendsRes] = await Promise.all([
          analyticsService.getOverview(),
          analyticsService.getTopJobs(),
          analyticsService.getPipeline(),
          analyticsService.getTrends()
        ]);
        setStats(overviewRes);
        setTopJobs(topJobsRes);
        setPipeline(pipelineRes);
        setTrends(trendsRes);
      } catch (error) {
        console.error('Failed to load dashboard stats', error);
      } finally {
        minDur.end(() => setIsLoading(false));
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="flex items-center gap-3"><svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span className="text-gray-500">Loading dashboard...</span></div>
      </div>
    );
  }

  return (
    <>
      <header className="topbar">
        <div className="crumb">
          TalentFlow / <strong>Dashboard</strong>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span className="chip">System Online</span>
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
            <div className="stat-number">{stats?.openJobs || 0}</div>
            <span className="trend text-gray-500">Out of {stats?.totalJobs || 0} total</span>
          </div>
          <div className="card stat-card">
            <div className="stat-top">
              <span>Total Applications</span>
              <span className="stat-icon">◉</span>
            </div>
            <div className="stat-number">{stats?.totalApplications || 0}</div>
            <span className="trend">Across all roles</span>
          </div>
          <div className="card stat-card">
            <div className="stat-top">
              <span>Candidates Database</span>
              <span className="stat-icon">↗</span>
            </div>
            <div className="stat-number">{stats?.totalCandidates || 0}</div>
            <span className="trend text-gray-500">Profiles stored</span>
          </div>
          <div className="card stat-card">
            <div className="stat-top">
              <span>Hired / Offer</span>
              <span className="stat-icon">◷</span>
            </div>
            <div className="stat-number">{stats?.hiredCount || 0}</div>
            <span className="trend">Hire rate: {stats?.hireRate || 0}%</span>
          </div>
        </div>

        <div className="grid-60" style={{ marginTop: '18px' }}>
          <div className="card pad">
            <div className="page-head">
              <div>
                <h2>Top Performing Jobs</h2>
                <p>Open roles with the highest application volume.</p>
              </div>
              <Link className="btn secondary" href="/jobs">
                View all jobs
              </Link>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Department</th>
                    <th>Apps</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {topJobs.length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-4 text-gray-500">No jobs found</td></tr>
                  ) : topJobs.map((job) => (
                    <tr key={job.id}>
                      <td>
                        <Link href={`/jobs/${job.id}`} className="hover:underline font-semibold">
                          {job.title}
                        </Link>
                      </td>
                      <td>{job.department}</td>
                      <td>{job.applicationCount}</td>
                      <td>
                        <Badge variant={job.status.toLowerCase() as any}>{job.status.toUpperCase()}</Badge>
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
                <h2>Pipeline Breakdown</h2>
                <p>Candidates by stage across the system.</p>
              </div>
            </div>
            <div className="list">
              {pipeline.map((stage) => (
                <div key={stage.stage} className="candidate-row py-3 border-b border-gray-100 last:border-b-0 flex justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant={stage.stage.toLowerCase() as any}>{stage.stage}</Badge>
                  </div>
                  <span className="font-semibold text-gray-700">{stage.count} candidate(s)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
