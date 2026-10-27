import { mkdirSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { exportJWK, generateKeyPair, SignJWT } from 'jose';
const { privateKey, publicKey } = await generateKeyPair('RS256');
const jwk = {
  ...(await exportJWK(publicKey)),
  kid: 'test-key',
  alg: 'RS256',
  use: 'sig',
};
const env = {
  EMILIST_OUTPUT_DIRECTORY: '.next-demo',
  DEMO_ALLOWED_HOSTS: '127.0.0.1:4318',
  ADMIN_ALLOWED_HOSTS: '127.0.0.1:4317',
  VERCEL: '1',
  VERCEL_ENV: 'production',
  APP_DEPLOYMENT_MODE: 'demo',
  DEMO_VERCEL_PROJECT_ID: `prj_${randomUUID()}`,
  ADMIN_VERCEL_PROJECT_ID: `prj_${randomUUID()}`,
  EMILIST_VERCEL_TEAM_ID: `team_${randomUUID()}`,
  EMILIST_VERCEL_TEAM_SLUG: 'emilist-test',
  DASHBOARD_UI_PREVIEW: 'false',
  NEXT_PUBLIC_API_BASE_URL: '',
  API_BASE_URL: '',
  ADMIN_API_BASE_URL: '',
};
env.VERCEL_PROJECT_ID = env.DEMO_VERCEL_PROJECT_ID;
const token = await new SignJWT({
  project: 'emilist-admin-demo',
  project_id: env.DEMO_VERCEL_PROJECT_ID,
  owner: env.EMILIST_VERCEL_TEAM_SLUG,
  owner_id: env.EMILIST_VERCEL_TEAM_ID,
  environment: 'production',
})
  .setProtectedHeader({ alg: 'RS256', kid: 'test-key', typ: 'JWT' })
  .setIssuer(`https://oidc.vercel.com/${env.EMILIST_VERCEL_TEAM_SLUG}`)
  .setAudience(`https://vercel.com/${env.EMILIST_VERCEL_TEAM_SLUG}`)
  .setSubject(
    'owner:emilist-test:project:emilist-admin-demo:environment:production',
  )
  .setIssuedAt()
  .setNotBefore('0s')
  .setExpirationTime('1h')
  .sign(privateKey);
mkdirSync('.test-deployment', { recursive: true });
writeFileSync(
  '.test-deployment/identity.json',
  JSON.stringify({ env, jwk, token }),
);
const build = spawnSync(
  process.execPath,
  ['scripts/build.mjs', 'demo', '--webpack'],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      ...env,
      VERCEL_OIDC_TOKEN: token,
      NODE_OPTIONS: `--import ${resolve('e2e/helpers/mockVercel.mjs')}`,
    },
  },
);
if (build.status !== 0) process.exit(build.status ?? 1);
const tests = spawnSync(
  process.execPath,
  ['node_modules/@playwright/test/cli.js', 'test', ...process.argv.slice(2)],
  { stdio: 'inherit' },
);
process.exit(tests.status ?? 1);
