'use client';
import { useSearchParams, usePathname } from 'next/navigation';
import {
  dateName,
  validDateRange,
  type DateRange,
} from '@/lib/date/calendarDates';
import { REPORT_PERIODS } from '@/features/reports/fixtures/reportFixtures';
export function useReportRange() {
  const params = useSearchParams();
  const pathname = usePathname();
  const period =
    REPORT_PERIODS.find((item) => item.value === params.get('range')) ||
    REPORT_PERIODS[0];
  const custom = { from: params.get('from') || '', to: params.get('to') || '' };
  const isCustom = params.get('range') === 'custom' && validDateRange(custom);
  return {
    period: isCustom
      ? {
          value: 'custom',
          label: 'Custom dates',
          caption: `${dateName(custom.from)} – ${dateName(custom.to)}`,
        }
      : period,
    dates: isCustom ? custom : { from: period.from, to: period.to },
    setDates: (value: DateRange) => {
      if (!validDateRange(value)) return;
      const next = new URLSearchParams(params.toString());
      next.set('range', 'custom');
      next.set('from', value.from);
      next.set('to', value.to);
      window.history.replaceState(null, '', `${pathname}?${next}`);
    },
    setRange: (range: string) => {
      const next = new URLSearchParams(params.toString());
      next.set('range', range);
      next.delete('from');
      next.delete('to');
      window.history.replaceState(null, '', `${pathname}?${next}`);
    },
  };
}
