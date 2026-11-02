import { expect, it } from 'vitest';
import { PROFILE_ACTIVITY, PROFILE_FIXTURES } from './profileFixtures';
import { DEMO_PROFILE } from '@/constants/demoProfile';
it('uses one demo persona and fictional activity without real account information', () => {
  expect(PROFILE_FIXTURES.displayName).toBe(DEMO_PROFILE.displayName);
  expect(PROFILE_FIXTURES.role).toBe('Demo persona');
  expect(PROFILE_ACTIVITY).toHaveLength(15);
  expect(
    PROFILE_ACTIVITY.every(
      (row) =>
        row.ip.startsWith('198.51.100.') &&
        row.description.includes('@example.test'),
    ),
  ).toBe(true);
  expect(new Set(PROFILE_ACTIVITY.map((row) => row.id)).size).toBe(15);
});
