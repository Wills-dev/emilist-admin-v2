import type { PermissionKey } from '@/features/settings/types/settingsTypes';
// Display labels, not authoritative backend permissions.
export const PERMISSION_LABELS: Record<PermissionKey, string> = {
  fullAccess: 'Full Access',
  userManagement: 'User Management',
  billing: 'Billing',
  settings: 'Settings',
  subscriptions: 'Subscriptions',
  dataExport: 'Data Export',
  analytics: 'Analytics',
  ticketResolution: 'Ticket Resolution',
  knowledgeBase: 'Knowledge Base',
  customerCrm: 'Customer CRM',
  overviewRead: 'Overview (Read-Only)',
  crmRead: 'CRM (Read-Only)',
  reporting: 'Reporting',
};
