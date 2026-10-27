import { DashboardLayout } from '@/components/templates/DashboardLayout/DashboardLayout';
// Public foundation only. Enforce the real server session here before connecting admin data.
export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
