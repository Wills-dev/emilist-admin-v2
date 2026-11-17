import 'server-only';
import { z } from 'zod';

const authServerEnvSchema = z.object({
  apiUrl: z.url().refine((value) => {
    const url = new URL(value);
    return (
      /^https?:$/.test(url.protocol) &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash &&
      (process.env.NODE_ENV !== 'production' || url.protocol === 'https:')
    );
  }),
  timeoutMs: z.coerce.number().int().min(1000).max(30000).default(12000),
});

export function getAuthServerEnv() {
  return authServerEnvSchema.parse({
    apiUrl: process.env.EMILIST_API_URL,
    timeoutMs: process.env.EMILIST_API_TIMEOUT_MS || undefined,
  });
}
