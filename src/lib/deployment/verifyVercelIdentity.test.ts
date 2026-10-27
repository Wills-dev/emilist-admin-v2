// @vitest-environment node
import { beforeAll, expect, it } from 'vitest';
import { generateKeyPair, exportJWK, createLocalJWKSet, SignJWT } from 'jose';
import { verifyVercelIdentity } from './verifyVercelIdentity';
import type { DeploymentBinding } from '@/config/deploymentPolicy';
const binding: DeploymentBinding = {
  target: 'demo',
  projectId: 'prj_demo_test',
  teamId: 'team_test',
  teamSlug: 'test-team',
  environment: 'production',
  demoHosts: ['demo.example.invalid'],
  adminHosts: ['admin.example.invalid'],
};
let pair: Awaited<ReturnType<typeof generateKeyPair>>;
let keys: ReturnType<typeof createLocalJWKSet>;
beforeAll(async () => {
  pair = await generateKeyPair('RS256');
  keys = createLocalJWKSet({
    keys: [
      { ...(await exportJWK(pair.publicKey)), kid: 'unit-key', alg: 'RS256' },
    ],
  });
});
async function sign(
  overrides: Record<string, unknown> = {},
  expiration = '1h',
) {
  return new SignJWT({
    project: 'emilist-admin-demo',
    project_id: binding.projectId,
    owner_id: binding.teamId,
    owner: binding.teamSlug,
    environment: 'production',
    ...overrides,
  })
    .setProtectedHeader({ alg: 'RS256', kid: 'unit-key' })
    .setIssuer('https://oidc.vercel.com/test-team')
    .setAudience('https://vercel.com/test-team')
    .setSubject(
      'owner:test-team:project:emilist-admin-demo:environment:production',
    )
    .setIssuedAt()
    .setNotBefore('0s')
    .setExpirationTime(expiration)
    .sign(pair.privateKey);
}
it('accepts only signed identity matching the bound demo project', async () => {
  await expect(
    verifyVercelIdentity(await sign(), binding, keys),
  ).resolves.toBeUndefined();
  for (const claims of [
    { project: 'emilist-admin' },
    { project_id: 'prj_admin_test' },
    { owner_id: 'team_other' },
    { environment: 'preview' },
  ])
    await expect(
      verifyVercelIdentity(await sign(claims), binding, keys),
    ).rejects.toThrow();
});
it('rejects unsigned, expired, wrong-audience and wrong-signature tokens', async () => {
  await expect(
    verifyVercelIdentity('ey.fake.token', binding, keys),
  ).rejects.toThrow();
  await expect(
    verifyVercelIdentity(await sign({}, '0s'), binding, keys),
  ).rejects.toMatchObject({ code: 'ERR_JWT_EXPIRED' });
  const other = await generateKeyPair('RS256');
  const otherKeys = createLocalJWKSet({
    keys: [
      { ...(await exportJWK(other.publicKey)), kid: 'unit-key', alg: 'RS256' },
    ],
  });
  await expect(
    verifyVercelIdentity(await sign(), binding, otherKeys),
  ).rejects.toThrow();
  await expect(
    verifyVercelIdentity(
      await sign(),
      { ...binding, teamSlug: 'wrong-team' },
      keys,
    ),
  ).rejects.toThrow();
});
