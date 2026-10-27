'use client';
import { useFixtureTable } from '@/hooks/useFixtureTable/useFixtureTable';
import { PAYMENTS } from '@/features/payments/fixtures/paymentFixtures';
export function usePaymentsTable() {
  return useFixtureTable({
    rows: PAYMENTS,
    pageSize: 8,
    searchText: (row) =>
      `${row.id} ${row.counterparty} ${row.description} ${row.direction} ${row.method}`,
    rowStatus: (row) => row.status,
  });
}
