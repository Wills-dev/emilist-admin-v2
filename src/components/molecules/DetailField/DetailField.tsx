import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
export function DetailField({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'min-w-0 rounded-xl border border-slate-100 px-3 py-3.5',
        className,
      )}
    >
      <dt className="text-[10px] text-[#7a849a]">{label}</dt>
      <dd className="mt-1 text-xs leading-5 font-medium break-words text-slate-950">
        {children || 'Not provided'}
      </dd>
    </div>
  );
}
