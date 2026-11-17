import { z } from 'zod';

export const authenticatedAdminSchema = z.object({
  id: z.string().min(1),
  fullName: z.string().min(1),
  email: z.email(),
  mobile: z.string().nullable(),
  profileImage: z.string().nullable(),
  department: z.string(),
  jobTitle: z.string(),
  permissions: z.array(z.unknown()),
  role: z.string().min(1),
  status: z.literal('Active'),
  onboardingStatus: z.literal('active'),
  mfaEnabled: z.literal(true),
});

// The bearer token is parsed only by the server and never returned to JS.
export const backendAdminSessionSchema = z.object({
  message: z.literal('success'),
  data: z.object({
    token: z.string().min(1).max(3500),
    admin: authenticatedAdminSchema,
  }),
});

export const adminVerificationResponseSchema = z.object({
  message: z.literal('success'),
  data: z.object({ admin: authenticatedAdminSchema }),
});

export type AdminVerificationResponse = z.infer<
  typeof adminVerificationResponseSchema
>;
