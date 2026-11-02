'use client';
import { useFixtureTable } from '@/hooks/useFixtureTable/useFixtureTable';
import type { JobDetail } from '@/features/jobs/types/jobDetailTypes';
export function useJobInvoices(detail: JobDetail) {
  return useFixtureTable({
    rows: detail.invoices,
    pageSize: 4,
    searchText: (row) => `${row.number} ${row.billedTo} ${row.label}`,
    rowStatus: (row) => row.status,
  });
}
