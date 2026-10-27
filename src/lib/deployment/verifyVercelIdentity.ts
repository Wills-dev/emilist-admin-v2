import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from 'jose';
import type { DeploymentBinding } from '../../config/deploymentPolicy.ts';

// The trust root is fixed; environment variables and request headers cannot choose signing keys.
const VERCEL_KEYS = createRemoteJWKSet(
  new URL('https://oidc.vercel.com/.well-known/jwks'),
  { timeoutDuration: 5000 },
);
export async function verifyVercelIdentity(
  token: string,
  binding: DeploymentBinding,
  keys: JWTVerifyGetKey = VERCEL_KEYS,
): Promise<void> {
  const project =
    binding.target === 'demo' ? 'emilist-admin-demo' : 'emilist-admin';
  const { payload } = await jwtVerify(token, keys, {
    issuer: `https://oidc.vercel.com/${binding.teamSlug}`,
    audience: `https://vercel.com/${binding.teamSlug}`,
    subject: `owner:${binding.teamSlug}:project:${project}:environment:${binding.environment}`,
    algorithms: ['RS256'],
    requiredClaims: [
      'exp',
      'iat',
      'nbf',
      'project_id',
      'owner_id',
      'project',
      'environment',
    ],
  });
  if (
    payload.project_id !== binding.projectId ||
    payload.owner_id !== binding.teamId ||
    payload.owner !== binding.teamSlug ||
    payload.project !== project ||
    payload.environment !== binding.environment
  )
    throw new Error(
      'Signed Vercel deployment identity does not match this artifact.',
    );
}
