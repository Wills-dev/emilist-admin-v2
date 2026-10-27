// Provisional UI model, not an operational SLA or backend contract.
export type TicketPriority = 'Critical' | 'High' | 'Medium' | 'Low';
export type TicketStatus = 'Pending' | 'Resolved' | 'Overdue';
export interface SupportTicket {
  id: string;
  updated: string;
  customer: string;
  subject: string;
  category: string;
  priority: TicketPriority;
  assignee: string;
  elapsedSeconds: number;
  status: TicketStatus;
}
