import { describe, expect, it } from 'vitest';
import { normalizeTicketList } from './supportApiMappers';

describe('normalizeTicketList', () => {
  it('renders every support request supplied by the backend', () => {
    const result = normalizeTicketList({
      message: 'success',
      data: {
        requests: [
          {
            _id: '6afe2d692d769e9e41d323bb',
            ticketCode: 'TKT-D323BB',
            requesterId: {
              firstName: 'Blackman',
              lastName: 'Varis',
              email: 'ejioguvictor830@gmail.com',
            },
            subject: 'Wallet funding.',
            category: 'financial',
            priority: 'critical',
            status: 'open',
            isOverdue: true,
            queueSeconds: 377156,
          },
        ],
        counts: { open: 1, overdue: 1 },
        pagination: { total: 1, pages: 1 },
      },
    });

    expect(result.count).toBe(1);
    expect(result.rows).toEqual([
      expect.objectContaining({
        ticketCode: 'TKT-D323BB',
        customer: 'Blackman Varis',
        subject: 'Wallet funding.',
        priority: 'Critical',
        status: 'Overdue',
      }),
    ]);
  });
});
