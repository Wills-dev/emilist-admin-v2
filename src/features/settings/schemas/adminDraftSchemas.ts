import { z } from 'zod';
// Local design validation, not invitation, role, or billing API contracts.
export const inviteAdminSchema = z.object({
  email: z.email('Enter a valid email address.'),
  firstName: z.string().trim().min(1, 'Enter a first name.').max(80),
  lastName: z.string().trim().min(1, 'Enter a last name.').max(80),
  role: z.string().trim().min(1, 'Enter a role label.').max(80),
  department: z.enum(['Operations', 'Product', 'Finance', 'Support']),
});
const amount = z
  .string()
  .trim()
  .min(1, 'Enter an amount.')
  .pipe(
    z.coerce
      .number<string>()
      .finite()
      .nonnegative('Amounts cannot be negative.'),
  );
export const subscriptionPriceSchema = z.object({
  basic: amount,
  silver: amount,
  gold: amount,
  platinum: amount,
});
