import { describe, expect, it } from 'vitest';
import {
  getJobDetail,
  FEATURED_JOB_ID,
} from '@/features/jobs/fixtures/jobDetailFixtures';
import { invoiceSummary, paymentSummary } from './jobDetailHelpers';
import { JOB_STATUS_ACTIONS } from '@/features/jobs/constants/jobActions';
import {
  jobReasonSchema,
  recurringJobSchema,
} from '@/features/jobs/schemas/jobActionSchemas';
import { JOB_ROUTES } from '@/constants/routes';
describe('job detail contracts', () => {
  it('derives consistent totals from synthetic records', () => {
    const detail = getJobDetail(FEATURED_JOB_ID)!;
    expect(invoiceSummary(detail.invoices)).toEqual({
      total: 4,
      milestone: 3,
      additional: 1,
      paid: 1,
      pending: 3,
      amount: 600000,
    });
    expect(paymentSummary(detail.payments)).toEqual({
      total: 3,
      paid: 1,
      pending: 1,
      upcoming: 1,
      completedAmount: 150000,
      upcomingAmount: 300000,
    });
    expect(
      detail.invoices
        .filter((row) => row.milestoneId)
        .every((row) =>
          detail.milestones.some((m) => m.id === row.milestoneId),
        ),
    ).toBe(true);
    expect(getJobDetail('missing')).toBeUndefined();
    expect(getJobDetail('demo-record-50-002')?.invoices).toEqual([]);
  });
  it('maps every state to its permitted preview dialogs', () => {
    expect(JOB_STATUS_ACTIONS).toEqual({
      Draft: ['remove'],
      Listed: ['reject', 'approve'],
      'In-review': ['remove'],
      Active: ['cancel', 'pause'],
      Paused: ['resume'],
      Overdue: ['cancel'],
      Completed: ['recurring'],
    });
  });
  it('validates drafts without accepting invalid recurring budgets or dates', () => {
    expect(jobReasonSchema.safeParse({ reason: '  ' }).success).toBe(false);
    const draft = {
      frequency: 'Weekly',
      period: 'Weekly',
      amount: '150000',
      startDate: '2026-11-02',
      endDate: '2026-12-02',
    };
    expect(recurringJobSchema.safeParse(draft).success).toBe(true);
    expect(recurringJobSchema.safeParse({ ...draft, amount: 0 }).success).toBe(
      false,
    );
    expect(
      recurringJobSchema.safeParse({ ...draft, endDate: '2026-10-01' }).success,
    ).toBe(false);
    expect(JOB_ROUTES.details('a/b')).toContain('a%2Fb');
  });
});
