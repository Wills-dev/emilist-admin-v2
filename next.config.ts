import type { NextConfig } from 'next';
import { PHASE_PRODUCTION_BUILD } from 'next/constants';
import { deploymentBinding } from './src/config/deploymentPolicy.ts';
import { verifyVercelIdentity } from './src/lib/deployment/verifyVercelIdentity.ts';

export default async function configure(phase: string): Promise<NextConfig> {
  const demo = process.env.EMILIST_BUILD_TARGET === 'demo';
  if (
    phase === PHASE_PRODUCTION_BUILD &&
    !demo &&
    process.env.APP_DEPLOYMENT_MODE &&
    process.env.APP_DEPLOYMENT_MODE !== 'production'
  )
    throw new Error(
      'A normal production artifact cannot use demo runtime configuration.',
    );
  let binding;
  if (
    phase === PHASE_PRODUCTION_BUILD &&
    (demo || process.env.VERCEL === '1')
  ) {
    binding = deploymentBinding(demo ? 'demo' : 'production', process.env);
    const token = process.env.VERCEL_OIDC_TOKEN;
    if (!token) throw new Error('A Vercel-signed build identity is required.');
    await verifyVercelIdentity(token, binding);
  }
  return {
    poweredByHeader: false,
    // Non-secret artifact binding, compiled into the output. Runtime flags cannot change it.
    env: {
      EMILIST_BUILD_TARGET:
        phase === PHASE_PRODUCTION_BUILD && demo ? 'demo' : 'production',
      EMILIST_BOUND_PROJECT: binding?.projectId || '',
      EMILIST_BOUND_TEAM: binding?.teamId || '',
      EMILIST_BOUND_SLUG: binding?.teamSlug || '',
      EMILIST_BOUND_ENVIRONMENT: binding?.environment || '',
      EMILIST_BOUND_DEMO_HOSTS: binding?.demoHosts.join(',') || '',
      EMILIST_BOUND_ADMIN_HOSTS: binding?.adminHosts.join(',') || '',
    },
    devIndicators:
      process.env.PLAYWRIGHT_PREVIEW === 'true' ? false : undefined,
    // Keep the browser-test dev server separate from a running development session.
    distDir:
      process.env.NODE_ENV === 'development' &&
      process.env.PLAYWRIGHT_PREVIEW === 'true'
        ? '.next-playwright'
        : process.env.EMILIST_OUTPUT_DIRECTORY === '.next-demo'
          ? '.next-demo'
          : '.next',
    async headers() {
      return [
        {
          source: '/:path*',
          headers: [
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            {
              key: 'Referrer-Policy',
              value: 'strict-origin-when-cross-origin',
            },
            { key: 'X-Frame-Options', value: 'DENY' },
            {
              key: 'Permissions-Policy',
              value: 'camera=(), microphone=(), geolocation=()',
            },
          ],
        },
      ];
    },
  };
}
