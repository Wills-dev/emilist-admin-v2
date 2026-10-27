'use client';
import { RecordActions } from '@/components/molecules/RecordActions/RecordActions';
import { CUSTOMER_ROUTES } from '@/constants/routes';
export function CustomerRowActions({
  customerId,
  name,
}: {
  customerId: string;
  name: string;
}) {
  return (
    <RecordActions
      name={name}
      viewHref={CUSTOMER_ROUTES.details(customerId)}
      viewLabel="View customer"
      actions={['Edit', 'Suspend']}
    />
  );
}
