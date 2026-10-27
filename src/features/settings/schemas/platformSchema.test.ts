import { expect, it } from 'vitest';
import { platformSchema } from './platformSchema';
import { PLATFORM_DEFAULTS } from '@/features/settings/fixtures/settingsFixtures';
it('validates local financial drafts and rejects invalid commissions and reversed limits', () => {
  expect(platformSchema.safeParse(PLATFORM_DEFAULTS).success).toBe(true);
  expect(
    platformSchema.safeParse({ ...PLATFORM_DEFAULTS, commission: 101 }).success,
  ).toBe(false);
  expect(
    platformSchema.safeParse({ ...PLATFORM_DEFAULTS, withdrawalMax: 100 })
      .success,
  ).toBe(false);
  expect(
    platformSchema.safeParse({ ...PLATFORM_DEFAULTS, depositMin: -1 }).success,
  ).toBe(false);
});
