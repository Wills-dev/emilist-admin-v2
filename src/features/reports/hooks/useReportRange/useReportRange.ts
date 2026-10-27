'use client';
import { useSearchParams, usePathname } from 'next/navigation';
import { REPORT_PERIODS } from '@/features/reports/fixtures/reportFixtures';
export function useReportRange() {
  const params = useSearchParams();
  const pathname = usePathname();
  const period =
    REPORT_PERIODS.find((item) => item.value === params.get('range')) ||
    REPORT_PERIODS[0];
  return {
    period,
    setRange: (range: string) => {
      const next = new URLSearchParams(params.toString());
      next.set('range', range);
      window.history.replaceState(null, '', `${pathname}?${next}`);
    },
  };
}
