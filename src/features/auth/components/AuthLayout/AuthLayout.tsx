import Image from 'next/image';
import type { ReactNode } from 'react';
import { AuthIllustration } from '@/features/auth/components/AuthIllustration/AuthIllustration';
import type { AuthVariant } from '@/features/auth/types/authTypes';

export function AuthLayout({
  variant,
  children,
}: {
  variant: AuthVariant;
  children: ReactNode;
}) {
  return (
    <div
      data-testid="auth-shell"
      className="relative flex h-dvh max-h-dvh flex-col overflow-hidden bg-white text-slate-950"
    >
      <a
        href="#auth-content"
        className="sr-only z-50 rounded-md bg-white p-3 text-emerald-700 focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to form
      </a>
      <header className="flex h-22 shrink-0 items-center justify-between border-b border-neutral-100 px-6 sm:px-10 md:h-28 md:px-[6.8%]">
        <Image
          src="/images/branding/emilist-logo.svg"
          alt="Emilist"
          width={163}
          height={38}
          priority
          className="h-auto w-32 md:w-41"
        />
        <span
          aria-hidden="true"
          className="relative size-11 overflow-hidden rounded-full bg-gray-100"
        >
          <span className="absolute top-2 left-1/2 size-4 -translate-x-1/2 rounded-full bg-gray-300" />
          <span className="absolute -bottom-1 left-1/2 h-5 w-9 -translate-x-1/2 rounded-t-full bg-gray-300" />
        </span>
      </header>
      <div className="grid min-h-0 flex-1 overflow-hidden md:grid-cols-[43.4%_56.6%]">
        <AuthIllustration variant={variant} />
        <main
          id="auth-content"
          tabIndex={0}
          aria-label="Authentication form"
          className="relative min-h-0 min-w-0 overflow-y-auto overscroll-contain px-5 py-10 sm:px-10 md:px-[12.8%] md:py-16 lg:py-20"
        >
          <div className="mx-auto w-full max-w-160">{children}</div>
        </main>
      </div>
    </div>
  );
}
