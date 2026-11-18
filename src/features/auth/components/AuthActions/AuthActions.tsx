import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';

export function AuthActions({
  backHref,
  onBack,
  backLabel = 'Back to Sign In',
  backDisabled = false,
  submitLabel,
  unavailable,
  disabled = true,
}: {
  backHref?: string;
  onBack?: () => void;
  backLabel?: string;
  backDisabled?: boolean;
  submitLabel?: string;
  unavailable?: string;
  disabled?: boolean;
}) {
  return (
    <div className="mt-7 border-t border-neutral-100 pt-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        {(backHref || onBack) && (
          <Button
            asChild={!!backHref && !onBack}
            type="button"
            onClick={onBack}
            disabled={backDisabled}
            variant="outline"
            className="flex-1 border-emerald-500 text-xs text-emerald-700 transition-colors duration-200 ease-out hover:border-emerald-600 hover:bg-emerald-50 focus-visible:ring-emerald-600 motion-reduce:transition-none"
          >
            {backHref && !onBack ? (
              <Link href={backHref}>
                <ChevronLeft />
                {backLabel}
              </Link>
            ) : (
              <>
                <ChevronLeft />
                {backLabel}
              </>
            )}
          </Button>
        )}
        {submitLabel && (
          <Button
            type="submit"
            disabled={disabled}
            aria-describedby={unavailable ? 'auth-unavailable' : undefined}
            className="flex-1 bg-[#109f52] text-xs text-white transition-colors duration-200 ease-out hover:bg-[#0e8f4a] focus-visible:ring-emerald-600 disabled:opacity-50 motion-reduce:transition-none"
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
