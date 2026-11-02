import { expect, it } from 'vitest';
import {
  inviteAdminSchema,
  subscriptionPriceSchema,
} from './adminDraftSchemas';
it('validates invitations without establishing a role assignment', () => {
  expect(
    inviteAdminSchema.safeParse({
      email: 'demo@example.test',
      firstName: 'Demo',
      lastName: 'Operator',
      role: 'Growth Manager',
      department: 'Operations',
    }).success,
  ).toBe(true);
  expect(inviteAdminSchema.safeParse({ email: 'bad' }).success).toBe(false);
});
it('allows the free tier but rejects negative, empty and non-finite prices', () => {
  const values = {
    basic: '0',
    silver: '24000',
    gold: '32000',
    platinum: '48000',
  };
  expect(subscriptionPriceSchema.safeParse(values).success).toBe(true);
  for (const value of ['-1', '', 'Infinity'])
    expect(
      subscriptionPriceSchema.safeParse({ ...values, silver: value }).success,
    ).toBe(false);
});
