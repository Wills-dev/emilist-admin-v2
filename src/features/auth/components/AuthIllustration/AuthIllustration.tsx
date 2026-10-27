import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import type { AuthVariant } from '@/features/auth/types/authTypes';

const illustrations = {
  login: {
    src: '/images/auth/login-illustration.svg',
    width: 360,
    height: 659,
  },
  signup: {
    src: '/images/auth/signup-illustration.svg',
    width: 540,
    height: 665,
  },
  forgotPassword: {
    src: '/images/auth/forgot-password-illustration.svg',
    width: 599,
    height: 692,
  },
} satisfies Record<AuthVariant, { src: string; width: number; height: number }>;

export function AuthIllustration({ variant }: { variant: AuthVariant }) {
  const illustration = illustrations[variant];
  return (
    <div
      data-testid="auth-illustration"
      aria-hidden="true"
      className={cn(
        'relative hidden h-full min-h-0 overflow-hidden bg-linear-to-b from-[#24c768] to-[#0d5530] md:block',
        variant === 'forgotPassword' && 'from-[#167858] to-[#214f42]',
      )}
    >
      <Image
        src="/images/auth/auth-background-logo.svg"
        alt=""
        width={543}
        height={677}
        className="pointer-events-none absolute top-0 left-0 h-4/5 w-full object-contain object-left-top"
      />
      {/* Clip the exported pattern’s thin top repeat seam without changing the supplied SVG. */}
      <div className="absolute inset-x-0 bottom-0 flex h-4/5 items-end justify-center px-4 lg:px-8">
        <Image
          src={illustration.src}
          alt=""
          width={illustration.width}
          height={illustration.height}
          loading="eager"
          className={cn(
            'h-auto max-h-full w-auto max-w-full object-contain object-bottom',
            variant === 'login'
              ? '[clip-path:inset(4%_0_0_0)]'
              : '[clip-path:inset(6%_0_0_0)]',
          )}
        />
      </div>
    </div>
  );
}
