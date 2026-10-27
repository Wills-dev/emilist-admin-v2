'use client';
import { useState } from 'react';
import { Pie, PieChart } from 'recharts';
import { ChartContainer } from '@/components/ui/Chart/Chart';
import { OverviewCard } from '@/features/dashboard/components/OverviewCard/OverviewCard';
import {
  ChartNoAxesCombined,
  BriefcaseBusiness,
  UsersRound,
} from 'lucide-react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion/usePrefersReducedMotion';
import type { DonutSummary as DonutSummaryData } from '@/features/dashboard/types/overviewTypes';

export function DonutSummary({
  data,
  kind,
}: {
  data: DonutSummaryData;
  kind: 'transactions' | 'jobs' | 'customers';
}) {
  const reducedMotion = usePrefersReducedMotion();
  const [animated, setAnimated] = useState(false);
  const chartConfig = Object.fromEntries(
    data.segments.map((item) => [
      item.key,
      { label: item.label, color: item.fill },
    ]),
  );
  return (
    <OverviewCard
      title={data.title}
      description={data.description}
      icon={
        kind === 'transactions'
          ? ChartNoAxesCombined
          : kind === 'jobs'
            ? BriefcaseBusiness
            : UsersRound
      }
    >
      <div className="mt-3 flex min-w-0 items-center gap-3">
        <div className="relative size-32 shrink-0 xl:size-40">
          <ChartContainer
            config={chartConfig}
            className="h-full w-full"
            aria-label={`${data.label}: ${data.total.toLocaleString('en-US')}`}
            role="img"
          >
            <PieChart accessibilityLayer>
              <Pie
                data={data.segments}
                dataKey="value"
                nameKey="label"
                innerRadius="69%"
                outerRadius="98%"
                startAngle={90}
                endAngle={-270}
                strokeWidth={1}
                isAnimationActive={!reducedMotion && !animated}
                animationDuration={550}
                animationBegin={0}
                onAnimationEnd={() => setAnimated(true)}
              />
            </PieChart>
          </ChartContainer>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
          >
            <span className="text-[11px] text-[#788096]">{data.label}</span>
            <strong className="mt-1 text-xl font-bold tracking-tight text-[#0c1710]">
              {data.total.toLocaleString('en-US')}
            </strong>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <ul className="space-y-3 text-[11px] text-[#576079]">
            {data.segments.map((item) => (
              <li
                key={item.key}
                className="flex items-center justify-between gap-2"
              >
                <span className="flex items-center gap-2">
                  <svg
                    width="9"
                    height="9"
                    aria-hidden="true"
                    className="shrink-0"
                  >
                    <circle cx="4.5" cy="4.5" r="4.5" fill={item.fill} />
                  </svg>
                  {item.label}
                </span>
                <span className="text-[#1f293b] tabular-nums">
                  {item.value.toLocaleString('en-US')}
                </span>
              </li>
            ))}
          </ul>
          {data.others && (
            <ul className="mt-3 space-y-2 text-[10px] text-[#576079]">
              {data.others.map((item) => (
                <li key={item.label} className="flex justify-between gap-2">
                  <span>{item.label}</span>
                  <span>{item.value?.toLocaleString('en-US')}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-[#788096]">
        <span>{data.footerLabel}</span>
        <span>
          <strong className="text-lg font-bold text-[#4b514d]">
            {data.footerValue}
          </strong>
          {kind === 'customers' && (
            <span className="ml-1 text-[10px] text-[#4b514d]">
              Since last month
            </span>
          )}
        </span>
      </div>
    </OverviewCard>
  );
}
