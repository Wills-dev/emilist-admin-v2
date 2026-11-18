import { z } from 'zod';
import { passwordSchema } from './authSchemas';

export const invitationTokenSchema = z
  .string()
  .min(1)
  .max(3500)
  .refine((value) => !/\s/.test(value) && value !== '.' && value !== '..');

export const authenticatorDetailsSchema = z.object({
  secret: z.string().regex(/^[A-Z2-7]+=*$/),
  otpauthUri: z.string().startsWith('otpauth://totp/').max(4096),
  issuer: z.string().min(1),
  accountName: z.string().min(1),
});
export type AuthenticatorDetails = z.infer<typeof authenticatorDetailsSchema>;

export const backendInvitationResponseSchema = z.object({
  message: z.literal('success'),
  data: z.object({
    admin: z.object({
      email: z.email(),
      onboardingStatus: z.string().min(1),
      mfaEnabled: z.boolean(),
    }),
    nextStep: z.enum(['password', 'authenticator']),
    invitationExpiresAt: z.iso.datetime(),
  }),
});
// Browser-only correlation value. It cannot authorize any backend operation.
export const invitationResponseSchema = backendInvitationResponseSchema.extend({
  data: backendInvitationResponseSchema.shape.data.extend({
    flowId: z.string().regex(/^[a-f0-9]{64}$/),
  }),
});
export type InvitationResponse = z.infer<typeof invitationResponseSchema>;

export const invitationSetupResponseSchema = z.object({
  message: z.literal('success'),
  data: z.object({
    admin: z.object({}).optional(),
    authenticator: authenticatorDetailsSchema,
  }),
});
export type InvitationSetupResponse = z.infer<
  typeof invitationSetupResponseSchema
>;

export const invitationPasswordSchema = z
  .object({
    password: passwordSchema.max(1024),
    confirmPassword: z.string().max(1024),
  })
  .strict()
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });
export type InvitationPasswordPayload = z.infer<
  typeof invitationPasswordSchema
>;
