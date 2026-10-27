import { Suspense } from 'react';
import { PaymentsPage } from '@/features/payments/components/PaymentsPage/PaymentsPage';
import { ManagementSkeleton } from '@/components/organisms/ManagementSkeleton/ManagementSkeleton';
export default function Page() {
  return (
    <Suspense fallback={<ManagementSkeleton includeMetrics={true} />}>
      <PaymentsPage />
    </Suspense>
  );
}
