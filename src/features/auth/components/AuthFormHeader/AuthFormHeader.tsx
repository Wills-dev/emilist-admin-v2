import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function AuthFormHeader({
  title,
  description,
  step = 1,
  total = 3,
}: {
  title: string;
  description: string;
  step?: number;
  total?: number;
}) {
  return (
    <div className="mb-7 border-b border-neutral-200 pb-5">
      <div className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50/60 text-emerald-600"
        >
          <Shield className="size-5" strokeWidth={1.5} />
        </span>
        <h1 className="text-2xl leading-tight font-bold tracking-tight text-[#080f0b] lg:text-[30px]">
          {title}
        </h1>
      </div>
      <div className="mt-5 flex items-end gap-3">
        <p className="min-w-0 flex-1 text-sm leading-6 text-neutral-500 lg:text-base">
          {description}
        </p>
        <span
          aria-label={`Step ${step} of ${total}`}
          className="flex shrink-0 gap-1.5 rounded-lg bg-neutral-50 p-2"
        >
          {Array.from({ length: total }, (_, index) => (
            <span
              key={index}
              className={cn(
                'size-2.5 rounded-full bg-neutral-300',
                index + 1 === step && 'bg-green-500',
              )}
            />
          ))}
        </span>
      </div>
    </div>
  );
}
