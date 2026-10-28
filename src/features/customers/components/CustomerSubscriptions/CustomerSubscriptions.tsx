'use client';
import { CustomerRecordTable } from '@/features/customers/components/CustomerRecordTable/CustomerRecordTable';
import { subscriptionColumns } from '@/features/customers/helpers/customerColumns';
import {
  CUSTOMER_SUBSCRIPTIONS,
  CUSTOMER_PLANS,
} from '@/features/customers/fixtures/customerFixtures';
import { SubscriptionPlans } from '@/components/organisms/SubscriptionPlans/SubscriptionPlans';
import { EmptyState } from '@/components/molecules/EmptyState/EmptyState';

export function CustomerSubscriptions({ customerId }: { customerId: string }) {
  if (customerId !== 'demo-customer-001')
    return (
      <EmptyState
        title="No subscription fixtures"
        description="No subscription presentation records are supplied for this customer."
      />
    );
  return (
    <section aria-label="Subscriptions" className="min-w-0 space-y-4">
      <SubscriptionPlans plans={CUSTOMER_PLANS} />
      <CustomerRecordTable
        rows={CUSTOMER_SUBSCRIPTIONS}
        columns={subscriptionColumns}
        label="Subscription history"
        searchText={(row) => `${row.description} ${row.receipt}`}
        toolbar={false}
      />
    </section>
  );
}
