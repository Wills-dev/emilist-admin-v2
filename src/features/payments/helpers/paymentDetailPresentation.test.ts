import { expect, it } from 'vitest';
import {
  getPayment,
  PAYMENTS,
} from '@/features/payments/fixtures/paymentFixtures';
import {
  paymentDetailPresentation,
  paymentDateLabel,
} from './paymentDetailPresentation';
import { PAYMENT_ROUTES } from '@/constants/routes';
it('derives independent status and direction labels without claiming pending or failed settlement', () => {
  const base = PAYMENTS[0]!;
  for (const direction of ['Inflow', 'Outflow'] as const)
    for (const status of ['Pending', 'Successful', 'Failed'] as const) {
      const view = paymentDetailPresentation({ ...base, direction, status });
      expect(view.direction).toBe(direction === 'Inflow' ? 'Credit' : 'Debit');
      expect(view.amountLabel).toBe(
        status === 'Successful'
          ? direction === 'Inflow'
            ? 'AMOUNT RECEIVED'
            : 'AMOUNT SENT'
          : 'AMOUNT',
      );
      expect(view.status).toBe(status === 'Successful' ? 'Completed' : status);
    }
  expect(paymentDateLabel(base)).toBe('3 Apr 2026 at 14:30:45');
});
it('looks up actual selected fixtures and encodes individual transaction IDs', () => {
  expect(getPayment('demo-record-64-002')?.direction).toBe('Outflow');
  expect(getPayment('sample-payment-9')?.status).toBe('Successful');
  expect(getPayment('missing')).toBeUndefined();
  expect(PAYMENT_ROUTES.details('a/b')).toBe('/payments/a%2Fb');
  expect(new Set(PAYMENTS.map((row) => row.id)).size).toBe(PAYMENTS.length);
});
