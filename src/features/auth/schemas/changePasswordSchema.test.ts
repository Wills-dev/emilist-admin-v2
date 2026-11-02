import { expect, it } from 'vitest';
import { changePasswordSchema } from './changePasswordSchema';
it('validates change-password drafts without allowing mismatches or password reuse', () => {
  const value = {
    currentPassword: 'OldPassword123!',
    password: 'NewPassword123!',
    confirmPassword: 'NewPassword123!',
  };
  expect(changePasswordSchema.safeParse(value).success).toBe(true);
  expect(
    changePasswordSchema.safeParse({ ...value, confirmPassword: 'different' })
      .success,
  ).toBe(false);
  expect(
    changePasswordSchema.safeParse({
      ...value,
      password: value.currentPassword,
      confirmPassword: value.currentPassword,
    }).success,
  ).toBe(false);
});
