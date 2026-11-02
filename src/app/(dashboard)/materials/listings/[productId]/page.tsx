import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getMaterialListingDetail } from '@/features/materials/fixtures/materialOrderDetailFixtures';
import { MaterialListingDetails } from '@/features/materials/components/MaterialListingDetails/MaterialListingDetails';
import { MaterialOrderSkeleton } from '@/features/materials/components/MaterialOrderSkeleton/MaterialOrderSkeleton';
export default async function Page({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const detail = getMaterialListingDetail(productId);
  if (!detail) notFound();
  return (
    <Suspense
      fallback={<MaterialOrderSkeleton label="Loading listing details" />}
    >
      <MaterialListingDetails detail={detail} />
    </Suspense>
  );
}
