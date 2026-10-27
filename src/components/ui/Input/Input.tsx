import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils/cn';

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      data-slot="input"
      className={cn(
        'h-12 w-full min-w-0 rounded-xl border border-transparent bg-neutral-50 px-4 text-sm text-slate-950 transition-colors duration-150 outline-none placeholder:text-slate-500 focus-visible:border-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-600/20 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-red-600 motion-reduce:transition-none',
        className,
      )}
      {...props}
    />
  );
}
