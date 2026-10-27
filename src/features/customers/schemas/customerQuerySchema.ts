import { z } from 'zod';
export const customerQuerySchema = z.object({
  search: z.string().max(200).catch(''),
  status: z.string().max(40).catch('all'),
  page: z.coerce.number().int().min(1).max(100000).catch(1),
});
