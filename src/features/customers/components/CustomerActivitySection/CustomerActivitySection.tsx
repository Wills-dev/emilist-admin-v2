'use client';
import { CustomerRecordTable } from '@/features/customers/components/CustomerRecordTable/CustomerRecordTable';
import {
  CUSTOMER_JOBS,
  CUSTOMER_LISTINGS,
  CUSTOMER_ORDERS,
  CUSTOMER_SALES,
  CUSTOMER_TRANSACTIONS,
} from '@/features/customers/fixtures/customerFixtures';
import {
  jobColumns,
  listingColumns,
  orderColumns,
  saleColumns,
  transactionColumns,
} from '@/features/customers/helpers/customerColumns';
export type CustomerActivityKind =
  'jobs' | 'listedItems' | 'orders' | 'sales' | 'transactions';
export function CustomerActivitySection({
  customerId,
  kind,
}: {
  customerId: string;
  kind: CustomerActivityKind;
}) {
  const sample = customerId === 'demo-customer-001';
  switch (kind) {
    case 'jobs':
      return (
        <CustomerRecordTable
          rows={sample ? CUSTOMER_JOBS : []}
          columns={jobColumns}
          label="Job count"
          searchText={(row) => `${row.id} ${row.title} ${row.role}`}
        />
      );
    case 'listedItems':
      return (
        <CustomerRecordTable
          rows={sample ? CUSTOMER_LISTINGS : []}
          columns={listingColumns}
          label="Listing count"
          searchText={(row) => `${row.id} ${row.product} ${row.category}`}
        />
      );
    case 'orders':
      return (
        <CustomerRecordTable
          rows={sample ? CUSTOMER_ORDERS : []}
          columns={orderColumns}
          label="Order count"
          searchText={(row) => `${row.id} ${row.product} ${row.category}`}
        />
      );
    case 'sales':
      return (
        <CustomerRecordTable
          rows={sample ? CUSTOMER_SALES : []}
          columns={saleColumns}
          label="Sales count"
          searchText={(row) =>
            `${row.id} ${row.product} ${row.buyer} ${row.address}`
          }
        />
      );
    case 'transactions':
      return (
        <CustomerRecordTable
          rows={sample ? CUSTOMER_TRANSACTIONS : []}
          columns={transactionColumns}
          label="Transaction count"
          searchText={(row) =>
            `${row.id} ${row.counterparty} ${row.type} ${row.method}`
          }
        />
      );
  }
}
