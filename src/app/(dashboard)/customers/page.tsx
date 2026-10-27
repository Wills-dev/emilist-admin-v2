import { Suspense } from 'react';
import { CustomersList } from '@/features/customers/components/CustomersList/CustomersList';
import { CustomerSkeleton } from '@/features/customers/components/CustomerSkeleton/CustomerSkeleton';
import { CUSTOMERS } from '@/features/customers/fixtures/customerFixtures';
export default function Page() {
  return (
    <Suspense fallback={<CustomerSkeleton />}>
      <CustomersList customers={CUSTOMERS} />
    </Suspense>
  );
}
