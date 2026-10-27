// Static presentation preview never establishes a session and cannot enable production access.
export function isDashboardPreviewEnabled(
  environment: string | undefined,
  flag: string | undefined,
): boolean {
  return environment === 'development' && flag === 'true';
}
