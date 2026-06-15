'use client';

import React, { useState } from 'react';
import { TrendData } from '../../../types';

interface RecruitmentTrendChartProps {
  trends?: TrendData[];
}

export default function RecruitmentTrendChart({ trends = [] }: RecruitmentTrendChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{x: number, y: number, date: string, count: number} | null>(null);

  if (!trends || trends.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[220px] bg-slate-50/50 dark:bg-zinc-800/50 rounded-xl border border-dashed border-slate-200 dark:border-zinc-700">
        <span className="text-slate-400 dark:text-zinc-500 text-sm font-medium">No trend data available</span>
      </div>
    );
  }

  // Dimensions
  const width = 500;
  const height = 220;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Find max value for Y-scaling
  const maxVal = Math.max(...trends.map((t) => t.applications), 1);
  const minVal = 0;

  // Generate coordinates
  const points = trends.map((t, i) => {
    const x = paddingLeft + (i / (trends.length - 1 || 1)) * chartWidth;
    const y = paddingTop + chartHeight - (t.applications / maxVal) * chartHeight;
    // Format date string to simpler form (e.g. Jun 13)
    let formattedDate = t.date;
    try {
      const d = new Date(t.date);
      if (!isNaN(d.getTime())) {
        formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    } catch {
      // Keep original string if parsing fails
    }
    return {
      x,
      y,
      applications: t.applications,
      date: formattedDate,
      rawDate: t.date,
    };
  });

  // SVG Paths
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
    : '';

  // X-axis ticks (render up to 5 labels to avoid crowding)
  const xTicksIndices = [];
  if (points.length > 0) {
    const step = Math.max(1, Math.floor(points.length / 4));
    for (let i = 0; i < points.length; i += step) {
      xTicksIndices.push(i);
    }
    // Make sure last index is included if it was skipped
    if (xTicksIndices[xTicksIndices.length - 1] !== points.length - 1) {
      xTicksIndices.push(points.length - 1);
    }
  }

  // Y-axis ticks (4 levels)
  const yTicks = [0, 0.33, 0.66, 1].map((ratio) => Math.round(minVal + ratio * maxVal));

  return (
    <div className="w-full relative h-[220px]">
      {/* Custom HTML Tooltip */}
      {hoveredPoint && (
        <div 
          className="absolute z-10 pointer-events-none transition-all duration-200 ease-out"
          style={{ 
            left: `${(hoveredPoint.x / width) * 100}%`, 
            top: `${(hoveredPoint.y / height) * 100}%`,
            transform: 'translate(-50%, -120%)'
          }}
        >
          <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs py-1.5 px-3 rounded-lg shadow-xl border border-slate-800 dark:border-white whitespace-nowrap flex flex-col items-center">
            <span className="font-bold tabular-data">{hoveredPoint.count} apps</span>
            <span className="text-[10px] text-slate-300 dark:text-slate-600">{hoveredPoint.date}</span>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-[3px] border-transparent border-t-slate-900 dark:border-t-white" />
          </div>
        </div>
      )}

      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="100%"
        className="overflow-visible"
        aria-label="Recruitment Activity Trend Chart"
        onMouseLeave={() => setHoveredPoint(null)}
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.10" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
          </linearGradient>
          <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="rgba(79,70,229,0.25)" />
          </filter>
        </defs>

        {/* Grid lines */}
        {yTicks.map((tick, i) => {
          const y = paddingTop + chartHeight - (tick / maxVal) * chartHeight;
          return (
            <g key={i}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                className="stroke-slate-200 dark:stroke-zinc-800"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={paddingLeft - 8}
                y={y + 4}
                textAnchor="end"
                className="fill-slate-400 dark:fill-zinc-500 text-[10px] font-medium tabular-data"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        {areaPath && (
          <path
            d={areaPath}
            fill="url(#chartGradient)"
            className="transition-all duration-300"
          />
        )}

        {/* Line */}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            className="stroke-primary transition-all duration-300"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#drop-shadow)"
          />
        )}

        {/* Interactive Dots & Tooltips */}
        {points.map((p, i) => {
          const isHovered = hoveredPoint?.x === p.x;
          return (
            <g 
              key={i} 
              className="cursor-pointer"
              onMouseEnter={() => setHoveredPoint({x: p.x, y: p.y, date: p.date, count: p.applications})}
            >
              {/* Invisible larger hit area for easier hovering */}
              <circle cx={p.x} cy={p.y} r="16" fill="transparent" />
              
              {/* Outer hover ring */}
              <circle
                cx={p.x}
                cy={p.y}
                r="7"
                className={`fill-primary/20 transition-opacity duration-150 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
              />
              {/* Inner dot */}
              <circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? "5" : "3.5"}
                className="fill-white dark:fill-zinc-900 stroke-primary stroke-[2.5px] transition-all duration-200 ease-out"
              />
            </g>
          );
        })}

        {/* X-axis labels */}
        {xTicksIndices.map((idx) => {
          const p = points[idx];
          if (!p) return null;
          return (
            <text
              key={idx}
              x={p.x}
              y={height - 5}
              textAnchor="middle"
              className="fill-slate-400 dark:fill-zinc-500 text-[10px] font-medium tabular-data"
            >
              {p.date}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
