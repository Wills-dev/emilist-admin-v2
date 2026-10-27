import { describe, expect, it } from 'vitest';
import {
  hasPermission,
  hasEveryPermission,
  type AdminSession,
} from './authorization';
const now = Date.parse('2026-01-01T00:00:00Z');
const session: AdminSession = {
  userId: 'admin',
  permissions: ['users.read'],
  expiresAt: '2026-01-02T00:00:00Z',
};
describe('authorization', () => {
  it('denies absent, expired and malformed sessions', () => {
    expect(hasPermission(null, 'users.read', now)).toBe(false);
    expect(
      hasPermission({ ...session, expiresAt: 'invalid' }, 'users.read', now),
    ).toBe(false);
    expect(
      hasPermission(
        { ...session, expiresAt: new Date(now).toISOString() },
        'users.read',
        now,
      ),
    ).toBe(false);
  });
  it('requires explicit permissions without implied role privileges', () => {
    expect(hasPermission(session, 'users.read', now)).toBe(true);
    expect(hasPermission(session, 'users.write', now)).toBe(false);
    expect(
      hasEveryPermission(session, ['users.read', 'users.write'], now),
    ).toBe(false);
    expect(hasEveryPermission(null, [], now)).toBe(false);
  });
});
