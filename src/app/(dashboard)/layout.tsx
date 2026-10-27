import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/templates/DashboardLayout/DashboardLayout';
import { dashboardPreviewEnabled } from '@/lib/auth/dashboardPreview';
import { OVERVIEW_FIXTURES } from '@/features/dashboard/fixtures/overviewFixtures';
import { ROUTES } from '@/constants/routes';
// The preview never establishes a session. No protected backend data or actions
// may be added here until real server authentication replaces this development gate.
export default function Layout({ children }: { children: ReactNode }) {
  if (!dashboardPreviewEnabled()) redirect(ROUTES.login);
  return (
    <DashboardLayout date={OVERVIEW_FIXTURES.date} profile={OVERVIEW_FIXTURES}>
      {children}
    </DashboardLayout>
  );
}
