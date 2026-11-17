import { DEMO_PROFILE } from '@/constants/demoProfile';
export const PROFILE_FIXTURES = {
  ...DEMO_PROFILE,
  jobTitle: 'Product Designer',
  department: 'Product',
  email: 'demo.operator@example.test',
  lastLogin: '12 Oct 2026, 11:49',
  location: 'Demo District',
  accountStatus: 'Active (sample)',
  onlineStatus: 'Not connected',
} as const;
// TEST-NET addresses and .test email domains are documentation-only fixtures.
export const PROFILE_ACTIVITY = Array.from({ length: 15 }, (_, index) => ({
  id: `demo-event-${index + 1}`,
  date: '2026-10-12',
  time: `11:${String(49 - index).padStart(2, '0')}:40`,
  ip: '198.51.100.24',
  description: `Sample sign-in event for demo.operator@example.test with MFA from 198.51.100.24.`,
  status: 'Success',
}));
