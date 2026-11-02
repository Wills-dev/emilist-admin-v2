import { TrendReport } from '@/features/reports/components/TrendReport/TrendReport';
import { DonutReport } from '@/features/reports/components/DonutReport/DonutReport';
import { SubscriptionReport } from '@/features/reports/components/SubscriptionReport/SubscriptionReport';
export function ReportsCharts() {
  return (
    <div className="overview-stagger grid min-w-0 gap-4 md:grid-cols-2 min-[72rem]:grid-cols-3">
      <TrendReport kind="churn" />
      <TrendReport kind="acquisition" />
      <DonutReport kind="jobs" />
      <TrendReport kind="active" />
      <DonutReport kind="materials" />
      <SubscriptionReport />
    </div>
  );
}
