import { REPORT_JOB_TOTAL } from '@/features/reports/fixtures/reportFixtures';
import { Suspense } from 'react';
import { DashboardAnalytics } from '@/features/dashboard';
import { ReportsToolbar } from '@/features/reports/components/ReportsToolbar/ReportsToolbar';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
export function ReportsPage() {
  return (
    <div className="space-y-4">
      <Suspense fallback={<Skeleton className="h-24" />}>
        <ReportsToolbar />
      </Suspense>
      <DashboardAnalytics jobTotal={REPORT_JOB_TOTAL} />
    </div>
  );
}
