'use client';
import { useFixtureTable } from '@/hooks/useFixtureTable/useFixtureTable';
import type { JobDetail } from '@/features/jobs/types/jobDetailTypes';
export function useJobPayments(detail: JobDetail) {
  return useFixtureTable({
    rows: detail.payments,
    pageSize: 3,
    searchText: (row) => `${row.reference} ${row.recipient} ${row.tag}`,
    rowStatus: (row) => row.status,
  });
}
