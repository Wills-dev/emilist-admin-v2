import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

const invitationSteps = [
  { label: 'Your details', href: '/accept-invite' },
  { label: 'Password', href: '/accept-invite/password' },
  { label: 'Authenticator', href: '/accept-invite/authenticator' },
];
const resetSteps = [
  { label: 'Verify code', href: '/reset-password/verify' },
  { label: 'Create new password', href: '/reset-password' },
];
export function AuthSteps({
  current,
  reset = false,
}: {
  current: number;
  reset?: boolean;
}) {
  const steps = reset ? resetSteps : invitationSteps;
  return (
    <nav
      aria-label="Account setup steps"
      className="mb-6 border-b border-neutral-100 pb-6"
    >
      <ol className="flex items-center gap-2">
        {steps.map((step, index) => (
          <li
            key={step.href}
            className="flex min-w-0 flex-1 items-center gap-2 last:flex-none"
          >
            <Link
              href={step.href}
              aria-current={index + 1 === current ? 'step' : undefined}
              className="flex min-w-0 items-center gap-2 rounded-sm text-[10px] text-slate-500 focus-visible:outline-2 focus-visible:outline-emerald-600 sm:text-xs"
            >
              <span
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-50 font-medium',
                  index + 1 === current &&
                    'bg-emerald-600 text-white ring-4 ring-emerald-100',
                )}
              >
                {index + 1}
              </span>
              <span>{step.label}</span>
            </Link>
            {index < steps.length - 1 && (
              <span aria-hidden="true" className="h-px flex-1 bg-neutral-200" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
