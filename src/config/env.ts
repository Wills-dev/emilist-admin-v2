import { z } from 'zod';

export const publicEnvSchema = z.object({
  apiBaseUrl: z
    .url()
    .refine((value) => /^https?:\/\//.test(value), 'Use an HTTP(S) URL')
    .optional(),
  apiTimeoutMs: z.coerce.number().int().min(1000).max(120000).default(15000),
});

export const publicEnv = publicEnvSchema.parse({
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || undefined,
  apiTimeoutMs: process.env.NEXT_PUBLIC_API_TIMEOUT_MS || undefined,
});
