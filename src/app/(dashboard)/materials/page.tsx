import { Suspense } from 'react';
import { ProductCatalog } from '@/features/materials/components/ProductCatalog/ProductCatalog';
import { ManagementSkeleton } from '@/components/organisms/ManagementSkeleton/ManagementSkeleton';
export default function Page() {
  return (
    <Suspense fallback={<ManagementSkeleton includeMetrics={false} />}>
      <ProductCatalog />
    </Suspense>
  );
}
