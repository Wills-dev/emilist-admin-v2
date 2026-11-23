import { z } from 'zod';
export const escalationDraftSchema = z.object({
  team: z.string().trim().min(1, 'Choose a team.'),
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
