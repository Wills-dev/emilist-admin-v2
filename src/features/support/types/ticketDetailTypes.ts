import type { SupportTicket } from './supportTypes';
// Synthetic presentation records only, not live messages or backend contracts.
export interface TicketMessage {
  id: string;
  sender: 'Customer' | 'Staff';
  author: string;
  initials: string;
  time: string;
  text: string;
}
export interface TicketDetail {
  ticket: SupportTicket;
  customerId?: string;
  openedTime: string;
  team: string;
  notes: string;
  attachments: readonly string[];
  messages: readonly TicketMessage[];
}
