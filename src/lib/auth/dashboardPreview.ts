import 'server-only';
import { cache } from 'react';
import { headers } from 'next/headers';
import { isDashboardPreviewEnabled } from '@/config/preview';
import { deploymentBinding } from '@/config/deploymentPolicy';
import { verifyVercelIdentity } from '@/lib/deployment/verifyVercelIdentity';

export const dashboardAccess = cache(
  async (): Promise<'demo' | 'development' | 'denied'> => {
    if (process.env.EMILIST_BUILD_TARGET === 'demo') {
      try {
        const binding = deploymentBinding('demo', process.env);
        if (
          binding.projectId !== process.env.EMILIST_BOUND_PROJECT ||
          binding.teamId !== process.env.EMILIST_BOUND_TEAM ||
          binding.teamSlug !== process.env.EMILIST_BOUND_SLUG ||
          binding.environment !== process.env.EMILIST_BOUND_ENVIRONMENT ||
          binding.demoHosts.join(',') !==
            process.env.EMILIST_BOUND_DEMO_HOSTS ||
          binding.adminHosts.join(',') !== process.env.EMILIST_BOUND_ADMIN_HOSTS
        )
          return 'denied';
        const requestHeaders = await headers();
        const host = (requestHeaders.get('host') || '').toLowerCase();
        if (
          !binding.demoHosts.includes(host) ||
          binding.adminHosts.includes(host)
        )
          return 'denied';
        const token = requestHeaders.get('x-vercel-oidc-token');
        if (!token) return 'denied';
        await verifyVercelIdentity(token, binding);
        return 'demo';
      } catch {
        return 'denied';
      }
    }
    if (
      !process.env.VERCEL &&
      isDashboardPreviewEnabled(
        process.env.NODE_ENV,
        process.env.DASHBOARD_UI_PREVIEW,
      )
    )
      return 'development';
    return 'denied';
  },
);
export async function dashboardPreviewEnabled(): Promise<boolean> {
  return (await dashboardAccess()) !== 'denied';
}
