'use client';
import { useSearchParams, usePathname } from 'next/navigation';
import { useFixtureTable } from '@/hooks/useFixtureTable/useFixtureTable';
import { SUPPORT_TICKETS } from '@/features/support/fixtures/supportFixtures';
export function useSupportTable() {
  const params = useSearchParams();
  const pathname = usePathname();
  const raw = params.get('priority');
  const priority = ['Critical', 'High', 'Medium', 'Low'].includes(raw || '')
    ? raw!
    : 'all';
  const table = useFixtureTable({
    rows: SUPPORT_TICKETS.filter(
      (row) => priority === 'all' || row.priority === priority,
    ),
    pageSize: 8,
    searchText: (row) =>
      `${row.id} ${row.customer} ${row.subject} ${row.category} ${row.assignee}`,
    rowStatus: (row) => row.status,
  });
  return {
    ...table,
    priority,
    setPriority: (value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value === 'all') next.delete('priority');
      else next.set('priority', value);
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
