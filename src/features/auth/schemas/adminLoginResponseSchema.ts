import { z } from 'zod';

export const adminMfaEnrollmentSchema = z.object({
  mfaEnrollmentRequired: z.literal(true),
  mfaRequired: z.literal(false).optional(),
  enrollmentToken: z.string().min(1),
  authenticator: z.object({
    secret: z.string().regex(/^[A-Z2-7]+=*$/),
    otpauthUri: z.string().startsWith('otpauth://totp/').max(4096),
    issuer: z.string().min(1),
    accountName: z.string().min(1),
  }),
});

const adminMfaChallengeSchema = z.object({
  mfaRequired: z.literal(true),
  mfaEnrollmentRequired: z.literal(false).optional(),
  challengeToken: z.string().min(1),
});

export const adminLoginResponseSchema = z.object({
  message: z.literal('success'),
  data: z.union([adminMfaEnrollmentSchema, adminMfaChallengeSchema]),
});

export type AdminLoginResponse = z.infer<typeof adminLoginResponseSchema>;
export type AdminMfaEnrollment = z.infer<typeof adminMfaEnrollmentSchema>;
