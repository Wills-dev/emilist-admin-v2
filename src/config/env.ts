import { z } from 'zod';

export const publicEnvSchema = z.object({
  apiTimeoutMs: z.coerce.number().int().min(1000).max(120000).default(15000),
});

export const publicEnv = publicEnvSchema.parse({
  apiTimeoutMs: process.env.NEXT_PUBLIC_API_TIMEOUT_MS || undefined,
});
