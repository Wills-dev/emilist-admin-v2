import { z } from 'zod';
// UI draft only; no backend request contract is implied.
export const listingDeListSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(1, 'Enter a reason for de-listing.')
    .max(1000, 'Keep the reason within 1,000 characters.'),
});
