import type { CustomerTab } from '@/constants/routes';
export const CUSTOMER_TABS: readonly { key: CustomerTab; label: string }[] = [
  { key: 'details', label: 'User Details' },
  { key: 'services', label: 'Services' },
  { key: 'jobs', label: 'Jobs' },
  { key: 'listedItems', label: 'Listed Items' },
  { key: 'orders', label: 'Orders' },
  { key: 'sales', label: 'Sales' },
  { key: 'transactions', label: 'Transactions' },
  { key: 'subscriptions', label: 'Subscriptions' },
];
