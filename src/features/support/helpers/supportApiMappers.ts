import type { SupportTicket } from '@/features/support/types/supportTypes';
import type {
  TicketDetail,
  TicketMessage,
} from '@/features/support/types/ticketDetailTypes';

const record = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
const text = (value: unknown, fallback = '') =>
  typeof value === 'string' ? value : fallback;
const number = (value: unknown, fallback = 0) =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

export function normalizeTicket(value: unknown): SupportTicket {
  const row = record(value);
  const priorityRaw = text(
    row.priority || row.priorityLevel,
    'normal',
  ).toLowerCase();
  const priority =
    priorityRaw === 'critical' || priorityRaw === 'urgent'
      ? 'Critical'
      : priorityRaw === 'high'
        ? 'High'
        : priorityRaw === 'medium' || priorityRaw === 'normal'
          ? 'Medium'
          : 'Low';
  const workflowStatus = text(row.status, 'open');
  const displayStatus = text(row.displayStatus).toLowerCase();
  const status =
    displayStatus === 'resolved' || workflowStatus === 'resolved'
      ? 'Resolved'
      : displayStatus === 'overdue' ||
          row.isOverdue === true ||
          workflowStatus === 'overdue'
        ? 'Overdue'
        : workflowStatus === 'in_progress' ||
            workflowStatus === 'pending_customer' ||
            workflowStatus === 'pending_resolution'
          ? 'Pending'
          : 'Pending';
  const assignee = record(row.assignedAdmin);
  const requester = record(row.requesterId || row.requester);
  return {
    id: text(row._id || row.requestId),
    ticketCode: text(row.ticketCode),
    workflowStatus,
    displayStatus,
    updated: text(row.updatedAt || row.updated, '—'),
    customer: text(
      row.customerName ||
        record(row.customer).name ||
        record(row.customer).fullName ||
        [requester.firstName, requester.lastName].filter(Boolean).join(' ') ||
        requester.email,
      'Unknown customer',
    ),
    subject: text(row.subject || row.title, 'Support request'),
    category: text(row.category, 'Other'),
    priority,
    assignee: text(
      row.assignedAdminName ||
        assignee.name ||
        assignee.fullName ||
        row.assignedAdminId,
      'Unassigned',
    ),
    elapsedSeconds: number(
      row.elapsedSeconds ||
        row.queueTimeSeconds ||
        row.queueSeconds ||
        row.queueTime,
    ),
    status,
  };
}

export function normalizeTicketList(value: unknown): {
  rows: SupportTicket[];
  count: number;
  pages: number;
  summary: Record<string, unknown>;
} {
  const outer = record(value);
  const unwrapped = outer.data ?? value;
  const data = record(unwrapped);
  const rawRows = Array.isArray(unwrapped)
    ? unwrapped
    : Array.isArray(data.requests)
      ? data.requests
      : Array.isArray(data.tickets)
        ? data.tickets
        : Array.isArray(data.data)
          ? data.data
          : [];
  const pagination = record(data.pagination);
  const count = number(pagination.total, number(data.total, rawRows.length));
  const pages = number(
    pagination.pages,
    number(data.pages, Math.max(1, Math.ceil(count / 10))),
  );
  return {
    rows: rawRows.map(normalizeTicket),
    count,
    pages,
    summary: normalizeSummary(data),
  };
}

export function normalizeSummary(value: unknown): Record<string, unknown> {
  const data = record(value);
  const counts = record(data.counts);
  const cards = record(data.cards);
  const card = (key: string) => record(cards[key]);
  const workflowCounts = [
    counts.open,
    counts.inProgress,
    counts.pendingCustomer,
    counts.pendingResolution,
    counts.resolved,
  ];
  return {
    ...data,
    totalTickets:
      number(card('totalTickets').value, -1) >= 0
        ? number(card('totalTickets').value)
        : counts.open !== undefined
          ? workflowCounts.reduce<number>(
              (total, count) => total + number(count),
              0,
            )
          : data.totalTickets,
    unassignedTickets: number(
      card('unassignedTickets').value,
      number(data.unassignedTickets),
    ),
    highPriorityTickets: number(
      card('highPriorityTickets').value,
      number(data.highPriorityTickets),
    ),
    overdueTickets: number(
      card('overdueTickets').value,
      number(counts.overdue, number(data.overdueTickets)),
    ),
    pendingCustomer: number(
      card('awaitingCustomerResponse').value,
      number(counts.pendingCustomer),
    ),
    counts,
  };
}

export function normalizeAssignees(value: unknown): {
  admins: unknown[];
  teams: string[];
} {
  const data = record(
    record(value).assignees ? record(value).assignees : value,
  );
  return {
    admins: Array.isArray(data.admins) ? data.admins : [],
    teams: Array.isArray(data.teams)
      ? data.teams.filter((team): team is string => typeof team === 'string')
      : [],
  };
}

export function normalizeTicketDetail(value: unknown): TicketDetail {
  const raw = record(value);
  const detail = record(
    raw.ticket ? raw.ticket : raw.request ? raw.request : raw,
  );
  const ticket = normalizeTicket(detail);
  const customer = record(detail.customer || detail.requesterId);
  const messagesRaw = Array.isArray(detail.messages)
    ? detail.messages
    : Array.isArray(detail.conversation)
      ? detail.conversation
      : [];
  const messages: TicketMessage[] = messagesRaw.map((item, index) => {
    const message = record(item);
    const senderUser = record(message.senderUserId);
    const senderRaw = text(
      message.senderType || message.sender || message.role,
    ).toLowerCase();
    const sender =
      senderRaw === 'admin' || senderRaw === 'staff'
        ? ('Staff' as const)
        : ('Customer' as const);
    const author = text(
      message.authorName ||
        message.author ||
        (sender === 'Staff'
          ? 'Support staff'
          : [
              senderUser.firstName || customer.firstName,
              senderUser.lastName || customer.lastName,
            ]
              .filter(Boolean)
              .join(' ') ||
            senderUser.email ||
            customer.email),
      sender,
    );
    return {
      id: text(message._id || message.id, `message-${index}`),
      sender,
      author,
      initials:
        author
          .split(/\s+/)
          .map((part) => part[0])
          .join('')
          .slice(0, 2)
          .toUpperCase() || 'S',
      time: text(message.createdAt || message.time, '—'),
      text: text(message.content || message.message || message.text),
    };
  });
  const notesRaw = Array.isArray(detail.adminNotes) ? detail.adminNotes : [];
  const noteText =
    notesRaw
      .map((note) => text(record(note).content))
      .filter(Boolean)
      .join('\n') || text(detail.notes, 'No admin notes yet.');
  const attachmentsRaw = Array.isArray(detail.attachments)
    ? detail.attachments
    : [];
  const history = Array.isArray(detail.history) ? detail.history : [];
  const resolutionHistory = history
    .map((item) => record(item))
    .find((item) => text(item.action).toLowerCase() === 'resolved');
  const resolvingAdmin = record(resolutionHistory?.adminId);
  const resolvedBy = text(
    resolvingAdmin.fullName ||
      [resolvingAdmin.firstName, resolvingAdmin.lastName]
        .filter(Boolean)
        .join(' ') ||
      resolvingAdmin.email,
  );
  return {
    ticket,
    description: text(detail.description),
    customerId:
      text(detail.customerId || customer._id || customer.id) || undefined,
    openedTime: text(detail.createdAt, '—'),
    team: text(detail.assignedTeam || detail.team, 'Unassigned'),
    notes: noteText,
    resolution: text(detail.resolution || resolutionHistory?.note) || undefined,
    resolvedAt:
      text(detail.resolvedAt || resolutionHistory?.createdAt) || undefined,
    resolvedBy: resolvedBy || undefined,
    attachments: attachmentsRaw.map((item) =>
      typeof item === 'string'
        ? item
        : text(record(item).url || record(item).name),
    ),
    messages,
  };
}
