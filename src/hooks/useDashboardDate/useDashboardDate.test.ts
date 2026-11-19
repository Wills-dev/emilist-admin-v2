import { act, renderHook } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { getDashboardDate } from '@/lib/date/getDashboardDate';
import { useDashboardDate } from './useDashboardDate';

afterEach(() => vi.useRealTimers());
it('rolls over at Lagos midnight without a page reload', async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-11-18T22:59:30Z'));
  const view = renderHook(() => useDashboardDate(getDashboardDate()));
  expect(view.result.current.dateTime).toBe('2026-11-18');
  await act(async () => {
    await vi.advanceTimersByTimeAsync(30_000);
  });
  expect(view.result.current.dateTime).toBe('2026-11-19');
  view.unmount();
});
