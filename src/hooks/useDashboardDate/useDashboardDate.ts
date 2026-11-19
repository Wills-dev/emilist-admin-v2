'use client';

import { useEffect, useState } from 'react';
import {
  getDashboardDate,
  type DashboardDate,
} from '@/lib/date/getDashboardDate';

export function useDashboardDate(initialDate: DashboardDate) {
  const [date, setDate] = useState(initialDate);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    function refresh() {
      const next = getDashboardDate();
      setDate((previous) =>
        previous.dateTime === next.dateTime ? previous : next,
      );
      clearTimeout(timer);
      // Align to minute boundaries, including midnight in the display timezone.
      timer = setTimeout(refresh, 60_000 - (Date.now() % 60_000));
    }
    function onVisibilityChange() {
      if (document.visibilityState === 'visible') refresh();
    }
    timer = setTimeout(refresh, 0);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);
  return date;
}
