import { Suspense } from 'react';
import { UserPermissions } from '@/features/settings/components/UserPermissions/UserPermissions';
import { ManagementSkeleton } from '@/components/organisms/ManagementSkeleton/ManagementSkeleton';
export default function Page() {
  return (
    <Suspense fallback={<ManagementSkeleton includeMetrics={false} />}>
      <UserPermissions />
    </Suspense>
  );
}
