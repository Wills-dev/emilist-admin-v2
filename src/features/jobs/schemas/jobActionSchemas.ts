import { z } from 'zod';
// UI draft validation only; no confirmed backend mutation payload is implied.
export const jobReasonSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(1, 'Enter a reason.')
    .max(1000, 'Keep the reason within 1,000 characters.'),
});
export const recurringJobSchema = z
  .object({
    frequency: z.enum(['Weekly', 'Monthly']),
    startDate: z.iso.date('Enter a valid start date.'),
    endDate: z.iso.date('Enter a valid end date.'),
    amount: z.coerce
      .number()
      .finite()
      .positive('Enter a positive recurring budget.'),
    period: z.enum(['Weekly', 'Monthly']),
  })
  .refine((value) => value.endDate >= value.startDate, {
    path: ['endDate'],
    message: 'End date must be on or after the start date.',
  });
