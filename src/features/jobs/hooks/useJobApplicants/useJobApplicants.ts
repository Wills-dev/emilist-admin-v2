'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useFixtureTable } from '@/hooks/useFixtureTable/useFixtureTable';
import type { JobDetail } from '@/features/jobs/types/jobDetailTypes';
export function useJobApplicants(detail: JobDetail) {
  const params = useSearchParams();
  const pathname = usePathname();
  const table = useFixtureTable({
    rows: detail.applicants,
    pageSize: 6,
    searchText: (row) => `${row.name} ${row.username} ${row.location}`,
    rowStatus: (row) => row.level,
  });
  const selected =
    detail.applicants.find((row) => row.id === params.get('applicant')) ||
    detail.applicants[0];
  return {
    ...table,
    selected,
    select: (id: string) => {
      if (!detail.applicants.some((row) => row.id === id)) return;
      const next = new URLSearchParams(params.toString());
      next.set('applicant', id);
      window.history.replaceState(null, '', `${pathname}?${next}`);
    },
  };
}
