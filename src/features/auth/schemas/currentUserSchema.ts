import { z } from 'zod';
import { authenticatedAdminSchema } from './adminSessionSchema';

export type CurrentUser = z.infer<typeof authenticatedAdminSchema>;

// Provisional envelope adapter using the confirmed MFA admin fields.
// Replace these alternatives with the exact current-user contract when supplied.
export const backendCurrentUserSchema = z
  .object({
    message: z.literal('success'),
    data: z.union([
      authenticatedAdminSchema,
      z.object({ admin: authenticatedAdminSchema }),
    ]),
  })
  .transform(({ data }) => ('admin' in data ? data.admin : data));
