#!/bin/bash

cat << 'INNER_EOF' > app/\(workspace\)/dashboard/page.tsx
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
      <svg className="w-4 h-4 text-slate-500 dark:text-zinc-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    );
  }
  if (d.includes('sale') || d.includes('mark') || d.includes('biz') || d.includes('growth')) {
    return (
      <svg className="w-4 h-4 text-slate-500 dark:text-zinc-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    );
  }
  if (d.includes('prod') || d.includes('design') || d.includes('ux')) {
    return (
      <svg className="w-4 h-4 text-slate-500 dark:text-zinc-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    );
  }
  if (d.includes('hr') || d.includes('peopl') || d.includes('talent')) {
    return (
      <svg className="w-4 h-4 text-slate-500 dark:text-zinc-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4 text-slate-500 dark:text-zinc-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeWorkspace?.id]);

  const totalCandidates = pipeline.reduce((sum, stage) => sum + stage.count, 0);

  if (isLoading) {
    return (
      <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        <div className="h-32 rounded-2xl bg-slate-100 dark:bg-zinc-800 animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-36 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 animate-pulse" />
          <div className="h-96 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="topbar bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800">
        <div className="crumb text-slate-500 dark:text-zinc-400">
          {activeWorkspace?.name ?? 'TalentFlow'} <span className="mx-2 text-slate-300 dark:text-zinc-700">/</span> <strong className="text-slate-900 dark:text-zinc-50 font-bold">Dashboard</strong>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/50 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold tracking-wide text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            System Online
          </span>
        </div>
      </header>

      <section className="content bg-noise">
        <WelcomeHeader />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 relative z-10">
          <div className="card stat-card interactive bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none p-5">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-slate-500 dark:text-zinc-400 text-xs tracking-wider uppercase">Open Positions</span>
              <span className="w-8 h-8 rounded-[10px] flex items-center justify-center border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 4h4v3h-4V4z" />
                </svg>
              </span>
            </div>
            <div className="text-3xl tabular-data text-slate-900 dark:text-zinc-50 font-black tracking-tight mt-1">{stats?.openJobs || 0}</div>
            <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium block mt-2 tracking-wide">Out of <span className="tabular-data text-slate-600 dark:text-zinc-300 font-bold">{stats?.totalJobs || 0}</span> active roles</span>
          </div>

          <div className="card stat-card interactive bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none p-5">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-slate-500 dark:text-zinc-400 text-xs tracking-wider uppercase">Total Applications</span>
              <span className="w-8 h-8 rounded-[10px] flex items-center justify-center border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </span>
            </div>
            <div className="text-3xl tabular-data text-slate-900 dark:text-zinc-50 font-black tracking-tight mt-1">{stats?.totalApplications || 0}</div>
            <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium block mt-2 tracking-wide">Across all workspace roles</span>
          </div>

          <div className="card stat-card interactive bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none p-5">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-slate-500 dark:text-zinc-400 text-xs tracking-wider uppercase">Candidates Database</span>
              <span className="w-8 h-8 rounded-[10px] flex items-center justify-center border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </span>
            </div>
            <div className="text-3xl tabular-data text-slate-900 dark:text-zinc-50 font-black tracking-tight mt-1">{stats?.totalCandidates || 0}</div>
            <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium block mt-2 tracking-wide">Verified talent profiles</span>
          </div>

          <div className="card stat-card interactive bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none p-5">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-slate-500 dark:text-zinc-400 text-xs tracking-wider uppercase">Hired / Offer</span>
              <span className="w-8 h-8 rounded-[10px] flex items-center justify-center border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <div className="text-3xl tabular-data text-slate-900 dark:text-zinc-50 font-black tracking-tight">{stats?.hiredCount || 0}</div>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300">
                Rate: <span className="tabular-data ml-1">{stats?.hireRate || 0}%</span>
              </span>
            </div>
            <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium block mt-2 tracking-wide">Successful placement rate</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="card p-6 bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-50">Recruitment Activity Trend</h2>
                  <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Daily application volume over time.</p>
                </div>
              </div>
              <RecruitmentTrendChart trends={trends} />
            </div>

            <div className="card p-6 bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-50">Top Performing Jobs</h2>
                  <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Open roles with the highest application volume.</p>
                </div>
                <Link className="btn secondary text-xs h-8 px-3" href="/jobs">
                  View all jobs
                </Link>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-zinc-800">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-zinc-800/50">
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Title</th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Department</th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 text-center">Apps</th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                    {topJobs.length === 0 ? (
                      <tr><td colSpan={4} className="text-center py-8 text-sm text-slate-400 dark:text-zinc-500 font-medium">No active jobs found.</td></tr>
                    ) : topJobs.map((job) => (
                      <tr key={job.id} className="group hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors duration-150">
                        <td className="px-4 py-3">
                          <Link href={`/jobs/${job.id}`} className="font-semibold text-slate-900 dark:text-zinc-100 block truncate group-hover:text-primary transition-colors max-w-[200px]" title={job.title}>
                            {job.title}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-zinc-400">
                            {getDepartmentIcon(job.department)}
                            <span className="truncate max-w-[150px]">{job.department}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex tabular-data items-center px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                            {job.applicationCount}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={job.status.toLowerCase() as any}>{job.status.toUpperCase()}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div>
            <div className="card p-6 bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80 sticky top-24">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-50">Pipeline Breakdown</h2>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Candidates by stage across the system.</p>
              </div>
              <div className="flex flex-col gap-5">
                {pipeline.map((stage, i) => {
                  const percentage = totalCandidates > 0 ? Math.round((stage.count / totalCandidates) * 100) : 0;
                  return (
                    <div key={stage.stage} className="flex flex-col gap-2">
                      <div className="flex justify-between items-end">
                        <Badge variant={stage.stage.toLowerCase() as any}>{stage.stage}</Badge>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-slate-900 dark:text-zinc-100 tabular-data text-sm">{stage.count}</span>
                          <span className="text-[10px] font-medium text-slate-400 dark:text-zinc-500 tabular-data w-8 text-right">{percentage}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-slate-800 dark:bg-slate-300 h-full rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${percentage}%`, transitionDelay: `${i * 100}ms` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
INNER_EOF
