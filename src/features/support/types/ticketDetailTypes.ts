import type { SupportTicket } from './supportTypes';
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
  description: string;
  customerId?: string;
  openedTime: string;
  team: string;
  notes: string;
  resolution?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  attachments: readonly string[];
  messages: readonly TicketMessage[];
}
