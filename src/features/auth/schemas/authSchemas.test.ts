import { describe, expect, it } from 'vitest';
import {
  emailSchema,
  newPasswordSchema,
  otpSchema,
  passwordSchema,
} from './authSchemas';

describe('authentication UI validation', () => {
  it('validates email and exactly six numeric OTP digits', () => {
    expect(emailSchema.safeParse('not-an-email').success).toBe(false);
    expect(emailSchema.safeParse('admin@example.com').success).toBe(true);
    for (const value of ['12345', '1234567', '12 456', 'abcdef'])
      expect(otpSchema.safeParse(value).success).toBe(false);
    expect(otpSchema.safeParse('123456').success).toBe(true);
  });
  it('requires all password rules and matching confirmation', () => {
    for (const value of [
      'Short1!',
      'longpassword1!',
      'LongPassword!!',
      'LongPassword12',
    ])
      expect(passwordSchema.safeParse(value).success).toBe(false);
    const password = 'LongPassword12!';
    expect(
      newPasswordSchema.safeParse({ password, confirmPassword: password })
        .success,
    ).toBe(true);
    expect(
      newPasswordSchema.safeParse({ password, confirmPassword: 'different' })
        .success,
    ).toBe(false);
  });
});
