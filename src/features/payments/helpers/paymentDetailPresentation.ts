import type { Payment } from '@/features/payments/types/paymentTypes';
// Status and direction are independent. A pending/failed credit is not received money.
export function paymentDetailPresentation(payment: Payment) {
  return {
    direction: payment.direction === 'Inflow' ? 'Credit' : 'Debit',
    badge:
      payment.status === 'Pending'
        ? 'Transaction Processing'
        : payment.status === 'Successful'
          ? 'Transaction Successful'
          : 'Failed',
    tone:
      payment.status === 'Pending'
        ? 'warning'
        : payment.status === 'Successful'
          ? 'success'
          : 'danger',
    status: payment.status === 'Successful' ? 'Completed' : payment.status,
    amountLabel:
      payment.status === 'Successful'
        ? payment.direction === 'Inflow'
          ? 'AMOUNT RECEIVED'
          : 'AMOUNT SENT'
        : 'AMOUNT',
  } as const;
}
export function paymentDateLabel(payment: Pick<Payment, 'date' | 'time'>) {
  const [day, month, year] = payment.date.split('/');
  const date = new Date(`${year}-${month}-${day}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return `${payment.date} at ${payment.time}`;
  return `${new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date)} at ${payment.time}`;
}
