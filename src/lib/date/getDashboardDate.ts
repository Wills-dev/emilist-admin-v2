export const DASHBOARD_TIME_ZONE = 'Africa/Lagos';

export interface DashboardDate {
  label: string;
  dateTime: string;
}

export function getDashboardDate(now = new Date()): DashboardDate {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: DASHBOARD_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const part = (type: string) =>
    parts.find((value) => value.type === type)?.value;
  return {
    label: new Intl.DateTimeFormat('en-NG', {
      timeZone: DASHBOARD_TIME_ZONE,
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(now),
    dateTime: `${part('year')}-${part('month')}-${part('day')}`,
  };
}
