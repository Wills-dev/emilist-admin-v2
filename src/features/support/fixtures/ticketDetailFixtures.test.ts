import { expect, it } from 'vitest';
import { getTicketDetail, DEMO_TEAMS } from './ticketDetailFixtures';
import {
  escalationDraftSchema,
  resolutionDraftSchema,
  replyDraftSchema,
} from '@/features/support/schemas/ticketActionSchemas';
import { SUPPORT_ROUTES } from '@/constants/routes';
it('retains the selected ticket identity without borrowing another conversation', () => {
  const detail = getTicketDetail('demo-record-74-001')!;
  expect(detail.ticket.status).toBe('Pending');
  expect(detail.messages).toHaveLength(5);
  expect(new Set(detail.messages.map((row) => row.id)).size).toBe(5);
  expect(detail.messages.every((row) => row.author.startsWith('Demo '))).toBe(
    true,
  );
  expect(detail.ticket.elapsedSeconds).toBe(5100);
  expect(getTicketDetail('demo-record-74-002')?.messages).toEqual([]);
  expect(getTicketDetail('demo-record-74-002')?.ticket.status).toBe('Resolved');
  expect(getTicketDetail('missing')).toBeUndefined();
  expect(SUPPORT_ROUTES.details('a/b')).toBe('/support/a%2Fb');
});
it('validates local ticket drafts without implying an API contract', () => {
  expect(
    escalationDraftSchema.safeParse({ team: DEMO_TEAMS[0], priority: 'High' })
      .success,
  ).toBe(true);
  expect(
    escalationDraftSchema.safeParse({
      team: 'Administrator',
      priority: 'Urgent',
    }).success,
  ).toBe(false);
  expect(resolutionDraftSchema.safeParse({ resolution: '  ' }).success).toBe(
    false,
  );
  expect(
    resolutionDraftSchema.safeParse({ resolution: 'Synthetic explanation' })
      .success,
  ).toBe(true);
  expect(replyDraftSchema.safeParse({ reply: 'a'.repeat(2001) }).success).toBe(
    false,
  );
});
