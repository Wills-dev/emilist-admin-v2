import { expect, it } from 'vitest';
import { ADMIN_ROLES, SPOTLIGHT_CANDIDATES } from './settingsFixtures';
import { PERMISSION_LABELS } from '@/features/settings/constants/permissions';
it('preserves role and candidate identity and resolves every presentation permission', () => {
  expect(new Set(ADMIN_ROLES.map((role) => role.id)).size).toBe(
    ADMIN_ROLES.length,
  );
  expect(
    new Set(SPOTLIGHT_CANDIDATES.map((candidate) => candidate.id)).size,
  ).toBe(SPOTLIGHT_CANDIDATES.length);
  for (const role of ADMIN_ROLES)
    for (const permission of role.permissions)
      expect(PERMISSION_LABELS[permission]).toBeTruthy();
  expect(ADMIN_ROLES.find((role) => role.name === 'Guest')?.users).toHaveLength(
    0,
  );
});
