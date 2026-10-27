import { z } from 'zod';
export const platformSchema = z
  .object({
    commission: z.number().min(0).max(100),
    withdrawalMin: z.number().min(0),
    withdrawalMax: z.number().min(0),
    depositMin: z.number().min(0),
  })
  .refine((values) => values.withdrawalMax >= values.withdrawalMin, {
    path: ['withdrawalMax'],
    message: 'Maximum withdrawal must be at least the minimum.',
  });
export type PlatformDraft = z.infer<typeof platformSchema>;
