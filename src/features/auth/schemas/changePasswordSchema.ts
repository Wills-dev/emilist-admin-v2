import { z } from 'zod';
import { passwordSchema } from './authSchemas';
// UI validation only; confirmed password-change requirements need a backend contract.
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Enter your current password.'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  })
  .refine((value) => value.password !== value.currentPassword, {
    path: ['password'],
    message: 'Choose a different password.',
  });
