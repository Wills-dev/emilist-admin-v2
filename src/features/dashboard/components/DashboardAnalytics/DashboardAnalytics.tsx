import { OverviewMetrics } from '@/features/dashboard/components/OverviewMetrics/OverviewMetrics';
import { OverviewCharts } from '@/features/dashboard/components/OverviewCharts/OverviewCharts';
import { QuickActions } from '@/features/dashboard/components/QuickActions/QuickActions';
import { TradeSummary } from '@/features/dashboard/components/TradeSummary/TradeSummary';
export function DashboardAnalytics({ jobTotal }: { jobTotal?: number }) {
  return (
    <>
      <OverviewMetrics />
      <div className="grid min-w-0 items-start gap-4 min-[70rem]:grid-cols-[2.08fr_1fr]">
        <OverviewCharts jobTotal={jobTotal} />
        <div className="overview-stagger grid min-w-0 gap-4 md:grid-cols-2 min-[70rem]:grid-cols-1">
          <QuickActions />
          <TradeSummary />
        </div>
      </div>
    </>
  );
}
