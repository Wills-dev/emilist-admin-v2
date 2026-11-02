import { z } from 'zod';
// Local draft validation; not a backend payload contract.
export const orderReturnSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(1, 'Enter a reason for the return.')
    .max(1000, 'Keep the reason within 1,000 characters.'),
});
