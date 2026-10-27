import { OverviewToolbar } from '@/features/dashboard/components/OverviewToolbar/OverviewToolbar';
import { OverviewMetrics } from '@/features/dashboard/components/OverviewMetrics/OverviewMetrics';
import { OverviewCharts } from '@/features/dashboard/components/OverviewCharts/OverviewCharts';
import { QuickActions } from '@/features/dashboard/components/QuickActions/QuickActions';
import { TradeSummary } from '@/features/dashboard/components/TradeSummary/TradeSummary';
export function DashboardOverview() {
  return (
    <div className="space-y-3 xl:space-y-4">
      <OverviewToolbar />
      <OverviewMetrics />
      <div className="grid min-w-0 items-start gap-4 min-[70rem]:grid-cols-[2.08fr_1fr]">
        <OverviewCharts />
        <div className="overview-stagger grid min-w-0 gap-4 md:grid-cols-2 min-[70rem]:grid-cols-1">
          <QuickActions />
          <TradeSummary />
        </div>
      </div>
    </div>
  );
}
