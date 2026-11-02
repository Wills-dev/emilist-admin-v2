'use client';
import { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/Chart/Chart';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion/usePrefersReducedMotion';
import { REPORT_TRENDS } from '@/features/reports/fixtures/reportFixtures';
import { ReportsChartCard } from '@/features/reports/components/ReportsChartCard/ReportsChartCard';
const definitions = {
  churn: {
    title: 'Platform Daily Churn Rates',
    description: 'New daily drop-offs on the platform',
    color: '#ff625e',
    fill: '#ffe4e7',
    max: 5,
    min: 0.5,
    ticks: [0.5, 2.5, 5],
    cohort: undefined,
  },
  acquisition: {
    title: 'New User Acquisition Rates',
    description: 'New daily signups on the platform',
    color: '#23b6b2',
    fill: '#defced',
    max: 100,
    min: 0,
    ticks: [0, 50, 100],
    cohort: 'cohort',
  },
  active: {
    title: 'Daily Active Users',
    description: 'Paying customers that visit daily',
    color: '#7773ff',
    fill: '#e0e4ff',
    max: 10000,
    min: 1000,
    ticks: [1000, 5000, 10000],
    cohort: 'returning',
  },
} as const;
export function TrendReport({ kind }: { kind: keyof typeof definitions }) {
  const item = definitions[kind];
  const reduced = usePrefersReducedMotion();
  const [animated, setAnimated] = useState(false);
  return (
    <ReportsChartCard title={item.title} description={item.description}>
      <ChartContainer
        config={{
          [kind]: { label: item.title, color: item.color },
          cohort: { label: 'Sample cohort', color: '#ffffff' },
          returning: { label: 'Sample returning users', color: '#ffffff' },
        }}
        aria-label={`${item.title}, static sample trend`}
        className="h-52 w-full"
      >
        <AreaChart
          data={REPORT_TRENDS}
          accessibilityLayer
          margin={{ top: 8, right: 4, left: 0, bottom: 0 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            fontSize={9}
            interval={0}
            tickMargin={10}
          />
          <YAxis
            domain={[item.min, item.max]}
            ticks={[...item.ticks]}
            axisLine={false}
            tickLine={false}
            width={28}
            fontSize={9}
            tickFormatter={(value) =>
              kind === 'churn'
                ? `${value}%`
                : kind === 'active'
                  ? `${Number(value) / 1000}K`
                  : String(value)
            }
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey={kind}
            stroke={item.color}
            fill={item.fill}
            strokeWidth={1}
            isAnimationActive={!reduced && !animated}
            animationDuration={600}
            onAnimationEnd={() => setAnimated(true)}
          />
          {item.cohort && (
            <Area
              type="monotone"
              dataKey={item.cohort}
              stroke="none"
              fill="#ffffff"
              fillOpacity={0.85}
              isAnimationActive={false}
            />
          )}
        </AreaChart>
      </ChartContainer>
    </ReportsChartCard>
  );
}
