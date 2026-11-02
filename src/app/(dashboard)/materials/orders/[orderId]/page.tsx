import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getMaterialOrderDetail } from '@/features/materials/fixtures/materialOrderDetailFixtures';
import { MaterialOrderDetails } from '@/features/materials/components/MaterialOrderDetails/MaterialOrderDetails';
import { MaterialOrderSkeleton } from '@/features/materials/components/MaterialOrderSkeleton/MaterialOrderSkeleton';
export default async function Page({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const detail = getMaterialOrderDetail(orderId);
  if (!detail) notFound();
  return (
    <Suspense fallback={<MaterialOrderSkeleton />}>
      <MaterialOrderDetails detail={detail} />
    </Suspense>
  );
}
