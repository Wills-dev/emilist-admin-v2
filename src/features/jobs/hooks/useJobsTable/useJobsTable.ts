'use client';
import { useFixtureTable } from '@/hooks/useFixtureTable/useFixtureTable';
import { JOBS } from '@/features/jobs/fixtures/jobFixtures';
export function useJobsTable() {
  return useFixtureTable({
    rows: JOBS,
    pageSize: 9,
    searchText: (row) =>
      `${row.id} ${row.title} ${row.postedBy} ${row.expert || ''}`,
    rowStatus: (row) => row.status,
  });
}
