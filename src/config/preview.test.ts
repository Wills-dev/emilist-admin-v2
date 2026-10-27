import { expect, it } from 'vitest';
import { isDashboardPreviewEnabled } from './preview';

it('allows the deployed static preview by default and supports explicit opt-out', () => {
  expect(isDashboardPreviewEnabled('production', undefined)).toBe(true);
  expect(isDashboardPreviewEnabled('production', 'true')).toBe(true);
  for (const flag of ['false', '1', 'TRUE', ''])
    expect(isDashboardPreviewEnabled('production', flag)).toBe(false);
});

it('requires explicit opt-in in development and denies unknown or test environments', () => {
  expect(isDashboardPreviewEnabled('development', 'true')).toBe(true);
  for (const environment of ['test', undefined])
    expect(isDashboardPreviewEnabled(environment, 'true')).toBe(false);
  for (const flag of ['false', '1', 'TRUE', undefined])
    expect(isDashboardPreviewEnabled('development', flag)).toBe(false);
});
