import type { NextConfig } from 'next';

// Public fixture preview on every deployment; no deployment identity is required.
export default function configure(): NextConfig {
  return {
    poweredByHeader: false,
    devIndicators:
      process.env.PLAYWRIGHT_PREVIEW === 'true' ? false : undefined,
    // Keep the browser-test dev server separate from a running development session.
    distDir:
      process.env.NODE_ENV === 'development' &&
      process.env.PLAYWRIGHT_PREVIEW === 'true'
        ? '.next-playwright'
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
