import { formatElapsedTime } from '@/features/support/helpers/supportHelpers';
export function TicketElapsed({ seconds }: { seconds: number }) {
  const formatted = formatElapsedTime(seconds);
  return (
    <span
      aria-label={`${formatted}, static elapsed-time sample`}
      title="Static elapsed-time fixture, not a live SLA"
      className="inline-flex items-center gap-1 whitespace-nowrap"
    >
      {formatted.split(':').map((part, index) => (
        <span key={index} className="inline-flex items-center gap-1">
          {index > 0 && <span aria-hidden="true">:</span>}
          <span className="rounded bg-neutral-100 p-1 tabular-nums">
            {part}
          </span>
        </span>
      ))}
    </span>
  );
}
