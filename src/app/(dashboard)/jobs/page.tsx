import { Suspense } from 'react';
import { JobsPage } from '@/features/jobs/components/JobsPage/JobsPage';
import { ManagementSkeleton } from '@/components/organisms/ManagementSkeleton/ManagementSkeleton';
export default function Page() {
  return (
    <Suspense fallback={<ManagementSkeleton />}>
      <JobsPage />
    </Suspense>
  );
}
