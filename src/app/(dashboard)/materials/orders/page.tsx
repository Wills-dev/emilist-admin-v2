import { Suspense } from 'react';
import { MaterialsOrders } from '@/features/materials/components/MaterialsOrders/MaterialsOrders';
import { ManagementSkeleton } from '@/components/organisms/ManagementSkeleton/ManagementSkeleton';
export default function Page() {
  return (
    <Suspense fallback={<ManagementSkeleton includeMetrics={false} />}>
      <MaterialsOrders />
    </Suspense>
  );
}
