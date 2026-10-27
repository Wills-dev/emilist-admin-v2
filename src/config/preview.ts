// Explicit opt-in, with an unconditional production/test lockout.
export function isDashboardPreviewEnabled(
  environment: string | undefined,
  flag: string | undefined,
): boolean {
  return environment === 'development' && flag === 'true';
}
