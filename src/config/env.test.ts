import { describe, expect, it } from 'vitest';
import { publicEnvSchema } from './env';

describe('public environment validation', () => {
  it('defaults the same-origin browser request timeout', () => {
    expect(publicEnvSchema.parse({})).toEqual({ apiTimeoutMs: 15000 });
  });
  it('bounds and coerces request timeouts', () => {
    expect(publicEnvSchema.safeParse({ apiTimeoutMs: '-1' }).success).toBe(
      false,
    );
    expect(publicEnvSchema.safeParse({ apiTimeoutMs: '120001' }).success).toBe(
      false,
    );
    expect(publicEnvSchema.parse({ apiTimeoutMs: '2000' })).toEqual({
      apiTimeoutMs: 2000,
    });
  });
});
