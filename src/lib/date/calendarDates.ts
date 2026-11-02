export interface DateRange {
  from: string;
  to: string;
}
export function parseCalendarDate(value: string): Date | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
    ? undefined
    : date;
}
export function calendarDate(date: Date) {
  return date.toISOString().slice(0, 10);
}
export function addCalendarDays(value: string, days: number) {
  const date = parseCalendarDate(value)!;
  date.setUTCDate(date.getUTCDate() + days);
  return calendarDate(date);
}
export function calendarMonth(value: string, offset: number) {
  const date = parseCalendarDate(value)!;
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + offset);
  const last = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0, 12),
  ).getUTCDate();
  date.setUTCDate(Math.min(day, last));
  return calendarDate(date);
}
export function monthDays(value: string) {
  const date = parseCalendarDate(value)!;
  date.setUTCDate(1);
  const first = calendarDate(date);
  const offset = (date.getUTCDay() + 6) % 7;
  const daysInMonth = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0, 12),
  ).getUTCDate();
  const cells = Math.ceil((offset + daysInMonth) / 7) * 7;
  return Array.from({ length: cells }, (_, index) =>
    addCalendarDays(first, index - offset),
  );
}
export function dateName(value: string) {
  const date = parseCalendarDate(value);
  return date
    ? new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(date)
    : value;
}
export function validDateRange(value: DateRange) {
  return (
    !!parseCalendarDate(value.from) &&
    !!parseCalendarDate(value.to) &&
    value.from <= value.to
  );
}
