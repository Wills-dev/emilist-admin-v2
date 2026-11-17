'use client';

import { QrCode } from 'lucide-react';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';
import { AdminMfaForm } from '@/features/auth/components/AdminMfaForm/AdminMfaForm';
import { Button } from '@/components/ui/Button/Button';
import type { AdminMfaEnrollment } from '@/features/auth/schemas/adminLoginResponseSchema';
import { VerificationForm } from '@/features/auth/components/VerificationForm/VerificationForm';

export function AuthenticatorSetup({
  enrollment,
  onRestart,
}: {
  enrollment?: AdminMfaEnrollment;
  onRestart?: () => void;
}) {
  if (enrollment) {
    const { authenticator } = enrollment;
    async function copySecret() {
      try {
        await navigator.clipboard.writeText(authenticator.secret);
        toast.success('Secret key copied');
      } catch {
        toast.error('Unable to copy the key. Enter it manually.');
      }
    }

    return (
      <section aria-label="Authenticator setup" className="space-y-5">
        <p className="text-sm leading-6 text-neutral-600">
          Scan the QR code with your authenticator app, or add a time-based
          account using the manual setup key below. Keep the setup key private.
        </p>
        <div
          role="img"
          aria-label="Scan to set up your authenticator"
          className="w-fit max-w-full rounded-lg bg-white p-4"
        >
          <QRCode
            value={authenticator.otpauthUri}
            size={200}
            className="h-auto max-w-full"
            aria-hidden="true"
          />
        </div>
        <dl className="space-y-3 rounded-xl border border-neutral-200 p-4 text-sm">
          <div>
            <dt className="text-neutral-500">Issuer</dt>
            <dd className="font-medium break-all">{authenticator.issuer}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Account</dt>
            <dd className="font-medium break-all">
              {authenticator.accountName}
            </dd>
          </div>
          <div>
            <dt className="text-neutral-500">Setup key</dt>
            <dd className="mt-1 font-mono break-all">{authenticator.secret}</dd>
          </div>
        </dl>
        <Button type="button" variant="outline" onClick={copySecret}>
          Copy Secret Key
        </Button>
        <p role="note" className="text-sm leading-6 text-neutral-600">
          Enter the six-digit code from your authenticator app below. Refreshing
          or leaving clears these enrollment details.
        </p>
        <AdminMfaForm
          mode="enrollment"
          token={enrollment.enrollmentToken}
          onRestart={onRestart}
        />
      </section>
    );
  }

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
