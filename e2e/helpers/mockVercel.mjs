// Test-process-only JWKS transport. Never imported by application or deployment scripts.
import { readFileSync } from 'node:fs';
const { jwk } = JSON.parse(
  readFileSync(
    new URL('../../.test-deployment/identity.json', import.meta.url),
  ),
);
const originalFetch = globalThis.fetch;
globalThis.fetch = (url, options) => {
  if (String(url) === 'https://oidc.vercel.com/.well-known/jwks')
    return Promise.resolve(
      new Response(JSON.stringify({ keys: [jwk] }), {
        headers: { 'content-type': 'application/json' },
      }),
    );
  return originalFetch(url, options);
};
