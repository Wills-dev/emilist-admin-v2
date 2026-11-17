import { z } from 'zod';

export const adminLoginRequestSchema = z
  .object({
    email: z.email().max(254),
    password: z.string().min(1).max(1024),
  })
  .strict();

export const adminVerificationRequestSchema = z.discriminatedUnion('mode', [
  z
    .object({
      mode: z.literal('login'),
      flowToken: z.string().min(1).max(4096),
      code: z.string().regex(/^\d{6}$/),
    })
    .strict(),
  z
    .object({
      mode: z.literal('enroll'),
      flowToken: z.string().min(1).max(4096),
      code: z.string().regex(/^\d{6}$/),
    })
    .strict(),
]);
