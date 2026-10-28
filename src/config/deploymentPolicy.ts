export type DeploymentTarget = 'production' | 'demo';
export interface DeploymentBinding {
  target: DeploymentTarget;
  projectId: string;
  teamId: string;
  teamSlug: string;
  environment: string;
  demoHosts: readonly string[];
  adminHosts: readonly string[];
}
export type DeploymentEnvironment = Readonly<
  Record<string, string | undefined>
>;

export function deploymentHosts(value: string | undefined): string[] {
  const hosts = [
    ...new Set(
      (value || '')
        .split(',')
        .map((host) => host.trim().toLowerCase())
        .filter(Boolean),
    ),
  ].sort();
  if (
    !hosts.length ||
    hosts.some(
      (host) =>
        !/^[a-z0-9][a-z0-9.-]*(?::[0-9]{1,5})?$/.test(host) ||
        host.includes('..'),
    )
  )
    throw new Error(
      'Explicit deployment hostnames are required; URLs and wildcards are not allowed.',
    );
  return hosts;
}

// Configuration is an allowlist, never proof of deployment identity.
export function deploymentBinding(
  target: DeploymentTarget,
  env: DeploymentEnvironment,
): DeploymentBinding {
  const {
    DEMO_VERCEL_PROJECT_ID: demoId,
    ADMIN_VERCEL_PROJECT_ID: adminId,
    EMILIST_VERCEL_TEAM_ID: teamId,
    EMILIST_VERCEL_TEAM_SLUG: teamSlug,
  } = env;
  const invalidSettings: string[] = [];
  if (!demoId?.startsWith('prj_'))
    invalidSettings.push('DEMO_VERCEL_PROJECT_ID (expected a prj_ project ID)');
  if (!adminId?.startsWith('prj_'))
    invalidSettings.push(
      'ADMIN_VERCEL_PROJECT_ID (expected a prj_ project ID)',
    );
  if (demoId && demoId === adminId)
    invalidSettings.push(
      'DEMO_VERCEL_PROJECT_ID and ADMIN_VERCEL_PROJECT_ID (must be different)',
    );
  if (!teamId?.startsWith('team_'))
    invalidSettings.push('EMILIST_VERCEL_TEAM_ID (expected a team_ ID)');
  if (!teamSlug || !/^[a-z0-9][a-z0-9-]*$/.test(teamSlug))
    invalidSettings.push(
      'EMILIST_VERCEL_TEAM_SLUG (expected the team slug, not its display name)',
    );
  if (invalidSettings.length)
    throw new Error(
      `Deployment identity allowlist is missing or inconsistent. Check these Vercel project environment variables: ${invalidSettings.join('; ')}. Set them for the deployment environment and redeploy. Configuration values are intentionally omitted.`,
    );
  // Keep the narrowed allowlist explicit after collecting diagnostics.
  if (!demoId || !adminId || !teamId || !teamSlug)
    throw new Error('Deployment identity configuration is incomplete.');
  const demoHosts = deploymentHosts(env.DEMO_ALLOWED_HOSTS);
  const adminHosts = deploymentHosts(env.ADMIN_ALLOWED_HOSTS);
  if (demoHosts.some((host) => adminHosts.includes(host)))
    throw new Error('Demo and production hostnames must be separate.');
  const projectId = target === 'demo' ? demoId : adminId;
  if (
    env.VERCEL !== '1' ||
    env.VERCEL_PROJECT_ID !== projectId ||
    env.APP_DEPLOYMENT_MODE !== target ||
    !['production', 'preview'].includes(env.VERCEL_ENV || '')
  )
    throw new Error(
      'Deployment target does not match the Vercel project configuration.',
    );
  if (
    target === 'demo' &&
    (env.NEXT_PUBLIC_API_BASE_URL || env.ADMIN_API_BASE_URL || env.API_BASE_URL)
  )
    throw new Error('Demo deployments cannot configure administrative APIs.');
  if (env.DASHBOARD_UI_PREVIEW === 'true')
    throw new Error(
      'Local development preview must not be configured on Vercel.',
    );
  return {
    target,
    projectId,
    teamId,
    teamSlug,
    environment: env.VERCEL_ENV!,
    demoHosts,
    adminHosts,
  };
}
