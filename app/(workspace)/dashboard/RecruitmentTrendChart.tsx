'use client';

import React from 'react';
import { TrendData } from '../../../types';

interface RecruitmentTrendChartProps {
  trends?: TrendData[];
}

export default function RecruitmentTrendChart({ trends = [] }: RecruitmentTrendChartProps) {
  if (!trends || trends.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[220px] bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
        <span className="text-gray-400 text-sm font-medium">No trend data available</span>
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
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="100%"
        className="overflow-visible"
        aria-label="Recruitment Activity Trend Chart"
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.00" />
          </linearGradient>
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
                className="stroke-gray-100"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={paddingLeft - 8}
                y={y + 4}
                textAnchor="end"
                className="fill-gray-400 text-[10px] font-medium"
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
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Interactive Dots & Tooltips */}
        {points.map((p, i) => (
          <g key={i} className="group">
            {/* Outer hover ring */}
            <circle
              cx={p.x}
              cy={p.y}
              r="7"
              className="fill-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-pointer"
            />
            {/* Inner dot */}
            <circle
              cx={p.x}
              cy={p.y}
              r="3.5"
              className="fill-primary stroke-white stroke-[1.5px] cursor-pointer"
            >
              <title>{`${p.date}: ${p.applications} application(s)`}</title>
            </circle>
          </g>
        ))}

        {/* X-axis labels */}
        {xTicksIndices.map((idx) => {
          const p = points[idx];
          if (!p) return null;
          return (
            <text
              key={idx}
              x={p.x}
              y={height - 10}
              textAnchor="middle"
              className="fill-gray-400 text-[10px] font-medium"
            >
              {p.date}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
