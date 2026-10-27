import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { CUSTOMER_TAB_PATHS } from '@/constants/routes';
import { CustomerServices } from '@/features/customers/components/CustomerServices/CustomerServices';
import { CustomerSubscriptions } from '@/features/customers/components/CustomerSubscriptions/CustomerSubscriptions';
import {
  CustomerActivitySection,
  type CustomerActivityKind,
} from '@/features/customers/components/CustomerActivitySection/CustomerActivitySection';
import { CustomerSkeleton } from '@/features/customers/components/CustomerSkeleton/CustomerSkeleton';
export default async function Page({
  params,
}: {
  params: Promise<{ customerId: string; tab: string }>;
}) {
  const { customerId, tab } = await params;
  const key = Object.entries(CUSTOMER_TAB_PATHS).find(
    ([, path]) => path === tab,
  )?.[0];
  if (!key || key === 'details') notFound();
  if (key === 'services') return <CustomerServices customerId={customerId} />;
  if (key === 'subscriptions')
    return (
      <Suspense fallback={<CustomerSkeleton />}>
        <CustomerSubscriptions customerId={customerId} />
      </Suspense>
    );
  return (
    <Suspense fallback={<CustomerSkeleton />}>
      <CustomerActivitySection
        customerId={customerId}
        kind={key as CustomerActivityKind}
      />
    </Suspense>
  );
}
