import { OverviewToolbar } from '@/features/dashboard/components/OverviewToolbar/OverviewToolbar';
import { DashboardAnalytics } from '@/features/dashboard/components/DashboardAnalytics/DashboardAnalytics';
export function DashboardOverview() {
  return (
    <div className="space-y-3 xl:space-y-4">
      <OverviewToolbar />
      <DashboardAnalytics />
    </div>
  );
}
