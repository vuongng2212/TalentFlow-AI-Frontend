'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Badge from '../../../components/ui/badge';
import WelcomeHeader from './WelcomeHeader';
import RecruitmentTrendChart from './RecruitmentTrendChart';
import { analyticsService } from '../../../services/api/analytics.service';
import { DashboardMetrics, TopJobData, PipelineStageCount, TrendData } from '../../../types';
import { useMinDuration } from '../../../hooks/useMinDuration';
import { useAuth } from '../../../components/features/workspace/RoleContext';

const getDepartmentIcon = (dept: string) => {
  const d = dept.toLowerCase();
  if (d.includes('eng') || d.includes('tech') || d.includes('software')) {
    return (
      <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    );
  }
  if (d.includes('sale') || d.includes('mark') || d.includes('biz') || d.includes('growth')) {
    return (
      <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    );
  }
  if (d.includes('prod') || d.includes('design') || d.includes('ux')) {
    return (
      <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    );
  }
  if (d.includes('hr') || d.includes('peopl') || d.includes('talent')) {
    return (
      <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardMetrics | null>(null);
  const [topJobs, setTopJobs] = useState<TopJobData[]>([]);
  const [pipeline, setPipeline] = useState<PipelineStageCount[]>([]);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const minDur = useMinDuration();
  const { activeWorkspace } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!activeWorkspace?.id) return;
      setIsLoading(true);
      minDur.start();
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
  }, [activeWorkspace?.id]); // Depend on workspace ID instead of minDur

  const totalCandidates = pipeline.reduce((sum, stage) => sum + stage.count, 0);

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
          {activeWorkspace?.name ?? 'TalentFlow'} <span className="text-slate-300 dark:text-zinc-600 mx-1">/</span> <strong>Dashboard</strong>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            className="chip hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            onClick={() => {
              setPipeline(pipeline.map(p => ({ ...p, count: 0 })));
              if (stats) {
                setStats({ ...stats, totalApplications: 0, hiredCount: 0, hireRate: 0 });
              }
            }}
          >
            Mock Zero Apps
          </button>
          <span className="chip text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1" />
            System Online
          </span>
        </div>
      </header>

      <section className="content">
        <WelcomeHeader />

        <div className="grid-4">
          <div className="card stat-card bg-gradient-to-br from-indigo-50/40 via-white to-indigo-100/10 border-indigo-100/80 shadow-sm transition-all duration-300 hover:shadow-md hover:border-indigo-200">
            <div className="stat-top">
              <span className="font-semibold text-gray-600 text-sm">Open Positions</span>
              <span className="stat-icon bg-indigo-50 border border-indigo-100/50 p-2 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 4h4v3h-4V4z" />
                </svg>
              </span>
            </div>
            <div className="stat-number text-gray-900 font-extrabold tracking-tight mt-1">{stats?.openJobs || 0}</div>
            <span className="trend text-xs text-indigo-600 font-medium block mt-2">Out of {stats?.totalJobs || 0} active roles</span>
          </div>

          <div className="card stat-card bg-gradient-to-br from-blue-50/40 via-white to-blue-100/10 border-blue-100/80 shadow-sm transition-all duration-300 hover:shadow-md hover:border-blue-200">
            <div className="stat-top">
              <span className="font-semibold text-gray-600 text-sm">Total Applications</span>
              <span className="stat-icon bg-blue-50 border border-blue-100/50 p-2 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </span>
            </div>
            <div className="stat-number text-gray-900 font-extrabold tracking-tight mt-1">{stats?.totalApplications || 0}</div>
            <span className="trend text-xs text-blue-600 font-medium block mt-2">Across all workspace roles</span>
          </div>

          <div className="card stat-card bg-gradient-to-br from-emerald-50/40 via-white to-emerald-100/10 border-emerald-100/80 shadow-sm transition-all duration-300 hover:shadow-md hover:border-emerald-200">
            <div className="stat-top">
              <span className="font-semibold text-gray-600 text-sm">Candidates Database</span>
              <span className="stat-icon bg-emerald-50 border border-emerald-100/50 p-2 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </span>
            </div>
            <div className="stat-number text-gray-900 font-extrabold tracking-tight mt-1">{stats?.totalCandidates || 0}</div>
            <span className="trend text-xs text-emerald-600 font-medium block mt-2">Verified talent profiles</span>
          </div>

          <div className="card stat-card bg-gradient-to-br from-violet-50/40 via-white to-violet-100/10 border-violet-100/80 shadow-sm transition-all duration-300 hover:shadow-md hover:border-violet-200">
            <div className="stat-top">
              <span className="font-semibold text-gray-600 text-sm">Hired / Offer</span>
              <span className="stat-icon bg-violet-50 border border-violet-100/50 p-2 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="stat-number text-gray-900 font-extrabold tracking-tight">{stats?.hiredCount || 0}</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-violet-100 text-violet-700">
                Rate: {stats?.hireRate || 0}%
              </span>
            </div>
            <span className="trend text-xs text-violet-600 font-medium block mt-2">Successful placement rate</span>
          </div>
        </div>

        {/* Recruitment Activity Trend Chart */}
        <div className="card pad" style={{ marginTop: '18px' }}>
          <div className="page-head">
            <div>
              <h2>Recruitment Activity Trend</h2>
              <p>Daily application volume over time.</p>
            </div>
            <div>
              <button
                className="chip cursor-pointer hover:bg-gray-100"
                onClick={() => setTrends(trends.length > 0 ? [] : [
                  { date: '2026-06-09', applications: 12 },
                  { date: '2026-06-10', applications: 19 },
                  { date: '2026-06-11', applications: 15 },
                  { date: '2026-06-12', applications: 27 },
                  { date: '2026-06-13', applications: 32 }
                ])}
              >
                Toggle Empty/Mock Trend
              </button>
            </div>
          </div>
          <RecruitmentTrendChart trends={trends} />
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
                <colgroup>
                  <col className="w-[45%]" />
                  <col className="w-[25%]" />
                  <col className="w-[15%]" />
                  <col className="w-[15%]" />
                </colgroup>
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
                    <tr key={job.id} className="odd:bg-white even:bg-gray-50/30 hover:bg-indigo-50/20 transition-colors duration-200">
                      <td className="max-w-[200px] truncate">
                        <Link href={`/jobs/${job.id}`} className="hover:underline font-semibold text-gray-900 block truncate" title={job.title}>
                          {job.title}
                        </Link>
                      </td>
                      <td className="max-w-[150px] truncate">
                        <div className="flex items-center gap-2" title={job.department}>
                          {getDepartmentIcon(job.department)}
                          <span className="truncate">{job.department}</span>
                        </div>
                      </td>
                      <td>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100/80">
                          {job.applicationCount}
                        </span>
                      </td>
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
              {pipeline.map((stage) => {
                const percentage = totalCandidates > 0 ? Math.round((stage.count / totalCandidates) * 100) : 0;
                return (
                  <div key={stage.stage} className="py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex justify-between items-center mb-2">
                      <Badge variant={stage.stage.toLowerCase() as any}>{stage.stage}</Badge>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-700">{stage.count} candidate(s)</span>
                        <span className="text-xs text-gray-400">({percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-primary h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
