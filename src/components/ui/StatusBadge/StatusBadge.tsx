import { cn } from '@/lib/utils/cn';
export function StatusBadge({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode;
  tone?: 'success' | 'warning' | 'danger' | 'neutral';
}) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2 py-0.5 text-[10px] leading-4',
        tone === 'success'
          ? 'bg-emerald-50 text-emerald-700'
          : tone === 'warning'
            ? 'bg-amber-50 text-amber-600'
            : tone === 'danger'
              ? 'bg-rose-50 text-rose-500'
              : 'bg-neutral-100 text-neutral-500',
      )}
    >
      {children}
    </span>
  );
}
