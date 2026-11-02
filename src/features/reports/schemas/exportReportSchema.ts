import { z } from 'zod';
export const exportReportSchema = z
  .object({
    report: z.enum([
      'churn',
      'acquisition',
      'job-success',
      'active-users',
      'materials',
      'subscriptions',
    ]),
    from: z.iso.date('Choose a start date.'),
    to: z.iso.date('Choose an end date.'),
    format: z.enum(['PDF', 'CSV', 'MD']),
  })
  .refine((value) => value.from <= value.to, {
    path: ['to'],
    message: 'End date must be on or after the start date.',
  });
