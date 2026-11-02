'use client';
import { useState } from 'react';
import { Cell, Pie, PieChart, Tooltip } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/Chart/Chart';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion/usePrefersReducedMotion';
import {
  REPORT_SUCCESS,
  REPORT_MATERIALS,
  REPORT_AVERAGE_SUCCESS,
} from '@/features/reports/fixtures/reportFixtures';
import { ReportsChartCard } from '@/features/reports/components/ReportsChartCard/ReportsChartCard';
export function DonutReport({ kind }: { kind: 'jobs' | 'materials' }) {
  const jobs = kind === 'jobs';
  const rows = jobs ? REPORT_SUCCESS : REPORT_MATERIALS;
  const reduced = usePrefersReducedMotion();
  const [animated, setAnimated] = useState(false);
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  const title = jobs
    ? 'Job Success Rates by Timeframe'
    : 'Material Sales Rate by Category';
  return (
    <ReportsChartCard
      title={title}
      description={
        jobs
          ? 'Percentage of jobs actually done'
          : 'Sample material sales across product categories'
      }
      jobs={jobs}
    >
      <div
        className={
          jobs
            ? 'grid min-w-0 grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-center gap-2'
            : 'min-w-0'
        }
      >
        <div className="relative min-w-0">
          <ChartContainer
            config={Object.fromEntries(
              rows.map((row) => [
                row.name,
                { label: row.name, color: row.color },
              ]),
            )}
            className="h-52 w-full"
            aria-label={`${title}, sample proportions`}
          >
            <PieChart accessibilityLayer>
              <Tooltip content={<ChartTooltipContent />} />
              <Pie
                data={rows}
                dataKey="value"
                nameKey="name"
                innerRadius={jobs ? 48 : 43}
                outerRadius={jobs ? 69 : 78}
                startAngle={90}
                endAngle={-270}
                stroke="#ffffff"
                strokeWidth={1}
                isAnimationActive={!reduced && !animated}
                animationDuration={600}
                onAnimationEnd={() => setAnimated(true)}
              >
                {rows.map((row) => (
                  <Cell key={row.name} fill={row.color} />
                ))}
              </Pie>
              {!jobs && (
                <Pie
                  tooltipType="none"
                  aria-hidden="true"
                  data={[{ value: 55 }, { value: 45 }]}
                  dataKey="value"
                  innerRadius={82}
                  outerRadius={87}
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                  isAnimationActive={false}
                >
                  <Cell fill="#20c46b" />
                  <Cell fill="transparent" />
                </Pie>
              )}
            </PieChart>
          </ChartContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            {jobs && (
              <span className="text-[9px] text-[#788096]">
                Avg Success Rate
              </span>
            )}
            <strong className="text-2xl font-bold tracking-tight text-[#0c1710]">
              {jobs ? `${REPORT_AVERAGE_SUCCESS}%` : `${total / 1000}k`}
            </strong>
            {!jobs && <span className="text-[9px]">Items Sold</span>}
          </div>
        </div>
        <ul
          className={
            jobs ? 'space-y-4' : 'mt-2 flex flex-wrap justify-center gap-3'
          }
        >
          {rows.map((row) => (
            <li
              key={row.name}
              className="flex min-w-0 items-center gap-2 text-[9px] text-[#66728b]"
            >
              <span
                aria-hidden="true"
                className="size-2 shrink-0 rounded-full"
                data-report-color={row.name}
              >
                <svg viewBox="0 0 8 8" className="size-2">
                  <circle cx="4" cy="4" r="4" fill={row.color} />
                </svg>
              </span>
              <span>{row.name}</span>
              {jobs && (
                <span className="ml-auto pl-1 text-slate-900">
                  {row.value}%
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </ReportsChartCard>
  );
}
