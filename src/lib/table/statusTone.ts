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
