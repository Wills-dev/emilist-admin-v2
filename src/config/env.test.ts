import { describe, expect, it } from 'vitest';
import { publicEnvSchema } from './env';
describe('public environment validation', () => {
  it('allows an unconfigured API without guessing an endpoint', () => {
    expect(publicEnvSchema.parse({})).toEqual({ apiTimeoutMs: 15000 });
  });
  it('rejects invalid origins and request timeouts', () => {
    expect(
      publicEnvSchema.safeParse({ apiBaseUrl: 'ftp://example.com' }).success,
    ).toBe(false);
    expect(publicEnvSchema.safeParse({ apiTimeoutMs: '-1' }).success).toBe(
      false,
    );
    expect(
      publicEnvSchema.safeParse({
        apiBaseUrl: 'https://api.example.com',
        apiTimeoutMs: '2000',
      }).success,
    ).toBe(true);
  });
});
