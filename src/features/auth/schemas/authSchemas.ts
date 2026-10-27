import { z } from 'zod';

export const emailSchema = z.email('Enter a valid work email address.');
export const otpSchema = z.string().regex(/^\d{6}$/, 'Enter all six digits.');

// UI validation requirements from the design; reconcile with the backend policy at integration.
export const PASSWORD_REQUIREMENTS = [
  { label: '12+ characters', test: (value: string) => value.length >= 12 },
  {
    label: 'Mixed case',
    test: (value: string) => /[a-z]/.test(value) && /[A-Z]/.test(value),
  },
  { label: 'A number', test: (value: string) => /[0-9]/.test(value) },
  { label: 'A symbol', test: (value: string) => /[^a-zA-Z0-9\s]/.test(value) },
] as const;
export const passwordSchema = z
  .string()
  .refine(
    (value) => PASSWORD_REQUIREMENTS.every((rule) => rule.test(value)),
    'Meet all four password requirements.',
  );
export const newPasswordSchema = z
  .object({ password: passwordSchema, confirmPassword: z.string() })
  .refine((value) => value.password === value.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });
