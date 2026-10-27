'use client';
import { useState } from 'react';
import { CartesianGrid, Line, LineChart, Tooltip, XAxis } from 'recharts';
import { Wallet } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/Chart/Chart';
import { OverviewCard } from '@/features/dashboard/components/OverviewCard/OverviewCard';
import { OVERVIEW_FIXTURES } from '@/features/dashboard/fixtures/overviewFixtures';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion/usePrefersReducedMotion';
const config = {
  value: { label: 'Presentation trend', color: '#13c864' },
} satisfies ChartConfig;
export function RevenueSummary() {
  const reducedMotion = usePrefersReducedMotion();
  const [animated, setAnimated] = useState(false);
  return (
    <OverviewCard title="Revenue Summary" icon={Wallet}>
      <div className="my-4 flex flex-wrap items-center gap-2">
        <strong className="text-xl font-bold tracking-tight text-[#0c1710]">
          {OVERVIEW_FIXTURES.revenueTotal}
        </strong>
        <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600">
          +12.5%
        </span>
        <span className="text-xs text-[#788096]">(+ ₦320,000)</span>
      </div>
      <ChartContainer
        config={config}
        className="h-36 w-full rounded-lg border border-slate-100 bg-[#fcfcfe]"
        aria-label="Static revenue trend for six five-day periods"
      >
        <LineChart
          accessibilityLayer
          data={OVERVIEW_FIXTURES.revenue}
          margin={{ left: 10, right: 15, top: 10, bottom: 0 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="period"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            fontSize={9}
            stroke="#788096"
            interval={0}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Line
            type="linear"
            dataKey="value"
            stroke={config.value.color}
            strokeWidth={1.5}
            dot={{ r: 2, fill: config.value.color, strokeWidth: 0 }}
            isAnimationActive={!reducedMotion && !animated}
            animationDuration={600}
            animationBegin={0}
            onAnimationEnd={() => setAnimated(true)}
          />
        </LineChart>
      </ChartContainer>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-xs text-[#788096]">
        <span>All time revenue (12 months):</span>
        <strong className="text-lg font-bold text-[#4b514d]">
          {OVERVIEW_FIXTURES.lifetimeRevenue}
        </strong>
      </div>
    </OverviewCard>
  );
}
