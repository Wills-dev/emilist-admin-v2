'use client';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/Chart/Chart';
import { REPORT_PLANS } from '@/features/reports/fixtures/reportFixtures';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion/usePrefersReducedMotion';
import { ReportsChartCard } from '@/features/reports/components/ReportsChartCard/ReportsChartCard';
export function SubscriptionReport() {
  const reduced = usePrefersReducedMotion();
  const [animated, setAnimated] = useState(false);
  return (
    <ReportsChartCard
      title="Subscription Plan Performance"
      description="Subscriber count for each plan for 60 days"
      jobs
    >
      <div className="mb-3 flex justify-around gap-2 text-[10px] text-[#66728b]">
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-[#20c46b]" />
          October
        </span>
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-orange-400" />
          September
        </span>
      </div>
      <ChartContainer
        config={{
          October: { label: 'October', color: '#20c46b' },
          September: { label: 'September', color: '#ff992b' },
        }}
        className="h-48 w-full"
        aria-label="Subscription Plan Performance, synthetic subscriber counts"
      >
        <BarChart
          accessibilityLayer
          data={REPORT_PLANS}
          margin={{ top: 4, left: 0, right: 0, bottom: 0 }}
        >
          <CartesianGrid vertical={false} />
          <YAxis hide domain={[0, 200]} />
          <XAxis
            dataKey="plan"
            tickLine={false}
            axisLine={false}
            fontSize={9}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="October"
            fill="#20c46b"
            radius={[3, 3, 0, 0]}
            maxBarSize={20}
            isAnimationActive={!reduced && !animated}
            animationDuration={600}
            onAnimationEnd={() => setAnimated(true)}
          />
          <Bar
            dataKey="September"
            fill="#ff992b"
            radius={[3, 3, 0, 0]}
            maxBarSize={20}
            isAnimationActive={!reduced && !animated}
            animationDuration={600}
          />
        </BarChart>
      </ChartContainer>
    </ReportsChartCard>
  );
}
