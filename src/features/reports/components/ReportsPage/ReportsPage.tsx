import { Suspense } from 'react';
import { ReportsCharts } from '@/features/reports/components/ReportsCharts/ReportsCharts';
import { ReportsToolbar } from '@/features/reports/components/ReportsToolbar/ReportsToolbar';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
export function ReportsPage() {
  return (
    <div className="space-y-4">
      <Suspense fallback={<Skeleton className="h-24" />}>
        <ReportsToolbar />
      </Suspense>
      <ReportsCharts />
    </div>
  );
}
