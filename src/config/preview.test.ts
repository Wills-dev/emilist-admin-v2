import { expect, it } from 'vitest';
import { isDashboardPreviewEnabled } from './preview';
it('requires an exact development-only opt-in and cannot enable production access', () => {
  expect(isDashboardPreviewEnabled('development', 'true')).toBe(true);
  for (const environment of ['production', 'test', undefined])
    expect(isDashboardPreviewEnabled(environment, 'true')).toBe(false);
  for (const flag of ['false', '1', 'TRUE', undefined])
    expect(isDashboardPreviewEnabled('development', flag)).toBe(false);
});
