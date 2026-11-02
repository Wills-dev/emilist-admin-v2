import { z } from 'zod';
export const suspensionDraftSchema = z.object({
  type: z.enum(['Temporary', 'Permanent']),
  reason: z.enum(['Policy review', 'Customer request', 'Account review']),
  context: z.string().max(1000, 'Keep the context within 1,000 characters.'),
});
