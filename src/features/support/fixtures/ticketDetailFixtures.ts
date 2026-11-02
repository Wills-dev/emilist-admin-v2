import { SUPPORT_TICKETS } from './supportFixtures';
import type { TicketDetail } from '@/features/support/types/ticketDetailTypes';
export const DEMO_TEAMS = [
  'Demo Finance Team',
  'Demo Support Team',
  'Demo Operations Team',
] as const;
export function getTicketDetail(id: string): TicketDetail | undefined {
  const ticket = SUPPORT_TICKETS.find((row) => row.id === id);
  if (!ticket) return undefined;
  const featured = ticket.id === 'demo-record-74-001';
  return {
    ticket,
    ...(featured ? { customerId: 'demo-customer-001' } : {}),
    openedTime: '11:49:40',
    team: featured ? 'Demo Finance Team' : 'Not supplied',
    notes: featured
      ? 'Synthetic admin note: review the supplied sample reference before updating the customer. No account or payment has been inspected by this preview.'
      : 'No admin note has been supplied for this sample.',
    attachments: featured
      ? [
          'Wallet screenshot',
          'Sample reference',
          'Conversation image',
          'Supporting document',
          'Additional screenshot',
          'Sample receipt',
        ]
      : [],
    messages: featured
      ? [
          {
            id: 'demo-message-001',
            sender: 'Customer',
            author: ticket.customer,
            initials: 'DC',
            time: '14:02',
            text: 'My sample wallet top-up of NGN 450,000 is not reflected in the demo balance.',
          },
          {
            id: 'demo-message-002',
            sender: 'Staff',
            author: ticket.assignee,
            initials: 'DS',
            time: '14:03',
            text: 'Please provide the sample transaction reference so we can illustrate the support review process.',
          },
          {
            id: 'demo-message-003',
            sender: 'Customer',
            author: ticket.customer,
            initials: 'DC',
            time: '14:04',
            text: 'The fictional reference is DEMO-TXN-450001.',
          },
          {
            id: 'demo-message-004',
            sender: 'Staff',
            author: ticket.assignee,
            initials: 'DS',
            time: '14:05',
            text: 'Thank you. This synthetic conversation demonstrates a pending review. No financial action has taken place.',
          },
          {
            id: 'demo-message-005',
            sender: 'Customer',
            author: ticket.customer,
            initials: 'DC',
            time: '14:06',
            text: 'Thank you for the update. I will wait for the next response.',
          },
        ]
      : [],
  };
}
