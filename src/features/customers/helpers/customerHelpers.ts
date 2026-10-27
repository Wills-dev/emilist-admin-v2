import type { Customer } from '@/features/customers/types/customerTypes';
export function formatNaira(value: number) {
  return `₦${value.toLocaleString('en-NG')}`;
}
export function customerName(customer: Customer) {
  return customer.fullName || customer.username;
}
export function filterFixtureRows<T>(
  rows: readonly T[],
  search: string,
  status: string,
  searchText: (row: T) => string,
  rowStatus: (row: T) => string,
) {
  const term = search.trim().toLowerCase();
  return rows.filter(
    (row) =>
      (!term || searchText(row).toLowerCase().includes(term)) &&
      (status === 'all' || rowStatus(row) === status),
  );
}
export function fixturePage<T>(
  rows: readonly T[],
  requestedPage: number,
  pageSize: number,
) {
  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const page = Math.max(1, Math.min(requestedPage, pages));
  return {
    rows: rows.slice((page - 1) * pageSize, page * pageSize),
    page,
    pages,
    count: rows.length,
  };
}
export function statusTone(
  status: string,
): 'success' | 'warning' | 'danger' | 'neutral' {
  if (
    [
      'Active',
      'Listed',
      'Delivered',
      'Successful',
      'Paid',
      'Verified',
    ].includes(status)
  )
    return 'success';
  if (
    ['Suspended', 'Overdue', 'Failed', 'Cancelled', 'Out of Stock'].includes(
      status,
    )
  )
    return 'danger';
  if (
    [
      'Inactive',
      'Pending',
      'Draft',
      'In-review',
      'Paused',
      'Low Stock',
      'In Transit',
    ].includes(status)
  )
    return 'warning';
  return 'neutral';
}
