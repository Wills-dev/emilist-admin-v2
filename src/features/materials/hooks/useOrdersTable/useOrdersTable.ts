'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useFixtureTable } from '@/hooks/useFixtureTable/useFixtureTable';
import { MATERIAL_ORDERS } from '@/features/materials/fixtures/materialFixtures';
export function useOrdersTable() {
  const params = useSearchParams();
  const pathname = usePathname();
  const rawPayment = params.get('payment');
  const payment =
    rawPayment === 'Paid' || rawPayment === 'Pending' ? rawPayment : 'all';
  const table = useFixtureTable({
    rows: MATERIAL_ORDERS.filter(
      (row) => payment === 'all' || row.payment === payment,
    ),
    pageSize: 9,
    searchText: (row) =>
      `${row.id} ${row.product.name} ${row.buyer} ${row.product.merchant}`,
    rowStatus: (row) => row.delivery,
  });
  return {
    ...table,
    payment,
    setPayment: (value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value === 'all') next.delete('payment');
      else next.set('payment', value);
      next.delete('page');
      const suffix = next.toString();
      window.history.replaceState(
        null,
        '',
        `${pathname}${suffix ? `?${suffix}` : ''}`,
      );
    },
  };
}
