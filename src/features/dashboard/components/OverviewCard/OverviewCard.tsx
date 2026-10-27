import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function OverviewCard({
  title,
  description,
  icon: Icon,
  children,
  className,
}: {
  title: string;
  description?: string;
  icon: LucideIcon;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      aria-label={title}
      className={cn(
        'overview-card min-w-0 rounded-lg border border-white bg-white p-3',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="rounded-md bg-[#f7f8f7] p-1 text-[#535b56]"
        >
          <Icon className="size-3.5" strokeWidth={1.5} />
        </span>
        <h2 className="text-[13px] font-medium text-[#343b36]">{title}</h2>
      </div>
      {description && (
        <p className="mt-1 text-xs leading-4 text-[#788096]">{description}</p>
      )}
      {children}
    </section>
  );
}
