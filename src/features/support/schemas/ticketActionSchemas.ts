import { z } from 'zod';
import { DEMO_TEAMS } from '@/features/support/fixtures/ticketDetailFixtures';
// UI drafts only. Teams do not represent granted permissions or an API contract.
export const escalationDraftSchema = z.object({
  team: z.enum(DEMO_TEAMS),
  priority: z.enum(['Critical', 'High', 'Medium', 'Low']),
});
export const resolutionDraftSchema = z.object({
  resolution: z
    .string()
    .trim()
    .min(1, 'Describe how the issue was resolved.')
    .max(2000, 'Keep the resolution within 2,000 characters.'),
});
export const replyDraftSchema = z.object({
  reply: z
    .string()
    .trim()
    .min(1, 'Enter a reply draft.')
    .max(2000, 'Keep the reply within 2,000 characters.'),
});
