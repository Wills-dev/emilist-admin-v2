import { expect, it } from 'vitest';
import {
  parseCalendarDate,
  calendarMonth,
  monthDays,
  addCalendarDays,
  validDateRange,
} from './calendarDates';
it('uses calendar dates without timezone rollover and rejects invalid dates', () => {
  expect(parseCalendarDate('2026-02-29')).toBeUndefined();
  expect(parseCalendarDate('2036-02-29')).toBeDefined();
  expect(parseCalendarDate('2026-2-1')).toBeUndefined();
  expect(addCalendarDays('2026-12-31', 1)).toBe('2027-01-01');
  expect(calendarMonth('2036-01-31', 1)).toBe('2036-02-29');
  expect(calendarMonth('2026-03-31', -1)).toBe('2026-02-28');
  const days = monthDays('2036-10-18');
  expect(days).toHaveLength(35);
  expect(parseCalendarDate(days[0]!)!.getUTCDay()).toBe(1);
  expect(new Set(days).size).toBe(days.length);
  expect(validDateRange({ from: '2036-10-18', to: '2036-10-26' })).toBe(true);
  expect(validDateRange({ from: '2036-10-26', to: '2036-10-18' })).toBe(false);
});
