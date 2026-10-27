import { Suspense } from 'react';
import { SupportPage } from '@/features/support/components/SupportPage/SupportPage';
import { ManagementSkeleton } from '@/components/organisms/ManagementSkeleton/ManagementSkeleton';
export default function Page() {
  return (
    <Suspense fallback={<ManagementSkeleton includeMetrics={true} />}>
      <SupportPage />
    </Suspense>
  );
}
