import 'server-only';
import { isDashboardPreviewEnabled } from '@/config/preview';
export function dashboardPreviewEnabled(): boolean {
  return isDashboardPreviewEnabled(
    process.env.NODE_ENV,
    process.env.DASHBOARD_UI_PREVIEW,
  );
}
