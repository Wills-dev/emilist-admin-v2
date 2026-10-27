// Presentation roles only. These values are never used for authorization.
export type RoleStatus = 'Active' | 'Inactive' | 'Revoked';
export type PermissionKey =
  | 'fullAccess'
  | 'userManagement'
  | 'billing'
  | 'settings'
  | 'subscriptions'
  | 'dataExport'
  | 'analytics'
  | 'ticketResolution'
  | 'knowledgeBase'
  | 'customerCrm'
  | 'overviewRead'
  | 'crmRead'
  | 'reporting';
export interface AdminRole {
  id: string;
  date: string;
  time: string;
  name: string;
  access: string;
  permissions: readonly PermissionKey[];
  users: readonly string[];
  status: RoleStatus;
}
export interface SpotlightCandidate {
  id: string;
  name: string;
  username: string;
  rating: string;
  completion: number;
  category: 'expert' | 'merchant';
}
