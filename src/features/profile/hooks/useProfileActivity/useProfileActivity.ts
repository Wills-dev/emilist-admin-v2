'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { validDateRange, type DateRange } from '@/lib/date/calendarDates';
import { PROFILE_ACTIVITY } from '@/features/profile/fixtures/profileFixtures';
export function useProfileActivity() {
  const params = useSearchParams();
  const pathname = usePathname();
  const requested = {
    from: params.get('from') || '',
    to: params.get('to') || '',
  };
  const dates = validDateRange(requested)
    ? requested
    : { from: '2026-10-12', to: '2026-10-13' };
  return {
    dates,
    rows: PROFILE_ACTIVITY.filter(
      (row) => row.date >= dates.from && row.date <= dates.to,
    ),
    setDates: (value: DateRange) => {
      if (!validDateRange(value)) return;
      const next = new URLSearchParams(params.toString());
      next.set('from', value.from);
      next.set('to', value.to);
      window.history.replaceState(null, '', `${pathname}?${next}`);
    },
  };
}
