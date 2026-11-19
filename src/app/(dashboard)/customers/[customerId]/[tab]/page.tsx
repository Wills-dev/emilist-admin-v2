import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { CUSTOMER_TAB_PATHS } from '@/constants/routes';
import { CustomerServices } from '@/features/customers/components/CustomerServices/CustomerServices';
import { CustomerSubscriptions } from '@/features/customers/components/CustomerSubscriptions/CustomerSubscriptions';
import {
  CustomerActivitySection,
  type CustomerActivityKind,
} from '@/features/customers/components/CustomerActivitySection/CustomerActivitySection';
import { CustomerTabSkeleton } from '@/features/customers/components/CustomerTabSkeleton/CustomerTabSkeleton';
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
      <Suspense fallback={<CustomerTabSkeleton tab={tab} />}>
        <CustomerSubscriptions customerId={customerId} />
      </Suspense>
    );
  return (
    <Suspense fallback={<CustomerTabSkeleton tab={tab} />}>
      <CustomerActivitySection
        customerId={customerId}
        kind={key as CustomerActivityKind}
      />
    </Suspense>
  );
}
