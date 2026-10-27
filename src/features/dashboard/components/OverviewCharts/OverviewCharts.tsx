'use client';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
import { OVERVIEW_FIXTURES } from '@/features/dashboard/fixtures/overviewFixtures';
const Donut = dynamic(
  () =>
    import('@/features/dashboard/components/DonutSummary/DonutSummary').then(
      (module) => module.DonutSummary,
    ),
  { loading: () => <Skeleton className="h-72 rounded-lg" />, ssr: false },
);
const Revenue = dynamic(
  () =>
    import('@/features/dashboard/components/RevenueSummary/RevenueSummary').then(
      (module) => module.RevenueSummary,
    ),
  { loading: () => <Skeleton className="h-72 rounded-lg" />, ssr: false },
);
export function OverviewCharts() {
  return (
    <div className="overview-stagger grid min-w-0 gap-4 md:grid-cols-2">
      <Donut data={OVERVIEW_FIXTURES.transactions} kind="transactions" />
      <Donut data={OVERVIEW_FIXTURES.jobs} kind="jobs" />
      <Donut data={OVERVIEW_FIXTURES.customers} kind="customers" />
      <Revenue />
    </div>
  );
}
