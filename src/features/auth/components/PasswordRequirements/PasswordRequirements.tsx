import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { PASSWORD_REQUIREMENTS } from '@/features/auth/schemas/authSchemas';

export function PasswordRequirements({ password }: { password: string }) {
  return (
    <ul
      aria-label="Password requirements"
      className="grid grid-cols-2 gap-2 text-[11px] sm:grid-cols-4"
    >
      {PASSWORD_REQUIREMENTS.map((rule) => {
        const met = rule.test(password);
        return (
          <li
            key={rule.label}
            className={cn(
              'border-t-3 border-neutral-100 pt-2 text-slate-500',
              met && 'border-green-500 text-emerald-700',
            )}
          >
            <span className="flex items-center gap-1">
              <Check aria-hidden="true" className="size-3 shrink-0" />
              <span>
                {rule.label}
                <span className="sr-only">: {met ? 'met' : 'not met'}</span>
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
