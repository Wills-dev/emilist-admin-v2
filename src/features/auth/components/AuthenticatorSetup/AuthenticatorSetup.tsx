import { QrCode } from 'lucide-react';
import { VerificationForm } from '@/features/auth/components/VerificationForm/VerificationForm';

export function AuthenticatorSetup() {
  return (
    <>
      <section
        aria-label="Authenticator setup"
        className="mb-5 overflow-hidden rounded-2xl border border-neutral-100 text-sm"
      >
        <div className="p-5">
          <h2 className="font-medium">1. Open your authenticator app</h2>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            Use your organization’s supported authenticator app.
          </p>
        </div>
        <div className="border-t border-neutral-100 p-5">
          <h2 className="font-medium">2. Scan your enrollment QR code</h2>
          <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div
              aria-label="Enrollment QR code unavailable"
              className="flex size-32 shrink-0 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-200 bg-neutral-50 text-neutral-400"
            >
              <QrCode aria-hidden="true" className="size-10" />
              <span className="text-[10px]">Not available</span>
            </div>
            <div className="min-w-0 space-y-2 text-xs text-slate-500">
              <p>Can’t scan? Enter the key manually.</p>
              <p className="rounded-lg bg-neutral-50 p-3">
                Enrollment key not available.
              </p>
              <button
                type="button"
                disabled
                className="text-emerald-700 opacity-50"
              >
                Copy Secret Key
              </button>
            </div>
          </div>
          <p className="mt-4 text-xs leading-5 text-slate-500">
            QR code and secret key require a verified invitation and secure
            enrollment session.
          </p>
        </div>
      </section>
      <VerificationForm enrollment />
    </>
  );
}
