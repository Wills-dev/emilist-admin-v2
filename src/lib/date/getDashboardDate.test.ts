import { expect, it } from 'vitest';
import { getDashboardDate } from './getDashboardDate';

it('shows the current Lagos calendar date, independently of the server timezone', () => {
  expect(getDashboardDate(new Date('2026-11-18T23:30:00Z'))).toEqual({
    dateTime: '2026-11-19',
    label: 'Thursday, 19 November 2026',
  });
  expect(getDashboardDate(new Date('2026-11-18T22:59:59Z')).dateTime).toBe(
    '2026-11-18',
  );
});
