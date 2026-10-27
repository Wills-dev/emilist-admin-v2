import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';

export function AuthActions({
  backHref,
  backLabel = 'Back to Sign In',
  submitLabel,
  unavailable,
}: {
  backHref?: string;
  backLabel?: string;
  submitLabel?: string;
  unavailable?: string;
}) {
  return (
    <div className="mt-7 border-t border-neutral-100 pt-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        {backHref && (
          <Button
            asChild
            variant="outline"
            className="flex-1 border-emerald-500 text-xs text-emerald-700 hover:bg-emerald-50"
          >
            <Link href={backHref}>
              <ChevronLeft />
              {backLabel}
            </Link>
          </Button>
        )}
        {submitLabel && (
          <Button
            type="submit"
            disabled
            aria-describedby="auth-unavailable"
            className="flex-1 bg-[#109f52] text-xs text-white disabled:opacity-50"
          >
            {submitLabel}
            <ChevronRight />
          </Button>
        )}
      </div>
      {unavailable && (
        <p
          id="auth-unavailable"
          role="note"
          className="mt-4 text-center text-xs leading-5 text-slate-500"
        >
          {unavailable}
        </p>
      )}
    </div>
  );
}
