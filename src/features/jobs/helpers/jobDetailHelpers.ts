import { formatNaira } from '@/lib/format/formatNaira';
import type {
  JobInvoice,
  JobPayment,
} from '@/features/jobs/types/jobDetailTypes';
export function formatJobDate(value: string) {
  const date = /^\d{2}\/\d{2}\/\d{4}$/.test(value)
    ? `${value.slice(6)}-${value.slice(3, 5)}-${value.slice(0, 2)}`
    : value;
  const parsed = new Date(`${date}T12:00:00Z`);
  return Number.isNaN(parsed.getTime())
    ? 'Not supplied'
    : new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(parsed);
}
export function compactJobBudget(amount: number) {
  return amount >= 1000
    ? `₦${(amount / 1000).toLocaleString('en-NG', { maximumFractionDigits: 1 })}k`
    : formatNaira(amount);
}
export function invoiceSummary(rows: readonly JobInvoice[]) {
  return {
    total: rows.length,
    milestone: rows.filter((row) => row.milestoneId).length,
    additional: rows.filter((row) => !row.milestoneId).length,
    paid: rows.filter((row) => row.status === 'Paid').length,
    pending: rows.filter((row) => row.status === 'Unpaid').length,
    amount: rows.reduce((sum, row) => sum + row.amount, 0),
  };
}
export function paymentSummary(rows: readonly JobPayment[]) {
  return {
    total: rows.length,
    paid: rows.filter((row) => row.status === 'Paid').length,
    pending: rows.filter((row) => row.status === 'Pending').length,
    upcoming: rows.filter((row) => row.status === 'Upcoming').length,
    completedAmount: rows
      .filter((row) => row.status === 'Paid')
      .reduce((sum, row) => sum + row.amount, 0),
    upcomingAmount: rows
      .filter((row) => row.status !== 'Paid')
      .reduce((sum, row) => sum + row.amount, 0),
  };
}
