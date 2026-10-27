// Static UI preview only: this policy never establishes an authenticated session.
export function isDashboardPreviewEnabled(
  environment: string | undefined,
  flag: string | undefined,
): boolean {
  if (environment === 'production')
    return flag === undefined || flag === 'true';
  return environment === 'development' && flag === 'true';
}
