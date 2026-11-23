import { expect, it } from 'vitest';
import { formatElapsedTime, formatSupportDate } from './supportHelpers';
it('formats backend-ready elapsed durations without a timer or wrapping after a day', () => {
  expect(formatElapsedTime(5100)).toBe('01:25:00');
  expect(formatElapsedTime(90061)).toBe('25:01:01');
  expect(formatElapsedTime(-1)).toBe('00:00:00');
  expect(formatElapsedTime(NaN)).toBe('00:00:00');
});

it('formats backend timestamps for the Lagos admin dashboard', () => {
  expect(formatSupportDate('2026-11-18T22:57:45.557Z')).toBe(
    '18 Nov 2026, 11:57 pm',
  );
});
