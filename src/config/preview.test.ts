import { expect, it } from 'vitest';
import { isDashboardPreviewEnabled } from './preview';
it('requires exact development opt-in and always denies production or unknown environments', () => {
  expect(isDashboardPreviewEnabled('development', 'true')).toBe(true);
  for (const environment of ['production', 'test', undefined])
    for (const flag of ['true', 'false', undefined])
      expect(isDashboardPreviewEnabled(environment, flag)).toBe(false);
  for (const flag of ['false', 'TRUE', '1', '', undefined])
    expect(isDashboardPreviewEnabled('development', flag)).toBe(false);
});
