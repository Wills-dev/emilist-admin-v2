'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { SignOutDialog } from '@/features/auth/components/SignOutDialog/SignOutDialog';
export function AccountMenu({
  initials,
  fullName,
  email,
  role,
}: {
  initials: string;
  fullName?: string;
  email?: string;
  role?: string;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  useEffect(() => {
    function outside(event: PointerEvent) {
      if (
        !dialogOpen &&
        event.target instanceof Node &&
        !ref.current?.contains(event.target) &&
        ref.current
      )
        ref.current.open = false;
    }
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [dialogOpen]);
  function first() {
    requestAnimationFrame(() =>
      ref.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus(),
    );
  }
  return (
    <details
      ref={ref}
      className="relative z-30"
      onBlur={(event) => {
        if (
          !dialogOpen &&
          !event.currentTarget.contains(event.relatedTarget as Node | null)
        )
          event.currentTarget.open = false;
      }}
      onKeyDown={(event) => {
        if (dialogOpen || event.defaultPrevented) return;
        const items = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            '[role="menuitem"]',
          ),
        );
        const index = items.indexOf(document.activeElement as HTMLElement);
        if (event.key === 'Escape') {
          event.preventDefault();
          event.currentTarget.open = false;
          event.currentTarget.querySelector('summary')?.focus();
        } else if (
          ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)
        ) {
          event.preventDefault();
          event.currentTarget.open = true;
          const next =
            event.key === 'Home'
              ? 0
              : event.key === 'End'
                ? items.length - 1
                : event.key === 'ArrowDown'
                  ? (index + 1) % items.length
                  : index < 0
                    ? items.length - 1
                    : (index - 1 + items.length) % items.length;
          items[Math.max(0, next)]?.focus();
        }
      }}
    >
      <summary
        aria-label="Open profile menu"
        aria-haspopup="menu"
        onClick={first}
        className={
          fullName
            ? 'flex cursor-pointer list-none items-center gap-2 rounded text-left focus-visible:outline-2 focus-visible:outline-emerald-600 [&::-webkit-details-marker]:hidden'
            : 'flex size-8 cursor-pointer list-none items-center justify-center rounded-full bg-[#727987] text-xs text-white focus-visible:outline-2 focus-visible:outline-emerald-600 [&::-webkit-details-marker]:hidden'
        }
      >
        {fullName ? (
          <>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#727987] text-xs text-white">
              {initials}
            </span>
            <span className="hidden min-w-0 lg:block">
              <span className="block max-w-36 truncate text-xs font-medium text-neutral-800">
                {fullName}
              </span>
              <span className="mt-1 block max-w-36 truncate text-[10px] text-neutral-500">
                {role}
              </span>
            </span>
          </>
        ) : (
          initials
        )}
      </summary>
      <div
        role="menu"
        aria-label="Account menu"
        className="absolute top-11 right-0 w-48 rounded-xl border border-slate-100 bg-white p-2 shadow-lg motion-safe:animate-[overview-enter_200ms_ease-out]"
      >
        {fullName && (
          <div className="mb-1 border-b border-neutral-100 px-2 py-2">
            <p className="truncate text-xs font-medium text-neutral-800">
              {fullName}
            </p>
            <p
              className="mt-1 text-[10px] break-all text-neutral-500"
              title={email}
            >
              {email}
            </p>
          </div>
        )}
        {[
          { label: 'Profile', href: ROUTES.profile },
          { label: 'Change Password', href: ROUTES.changePassword },
        ].map((item) => (
          <Link
            key={item.href}
            role="menuitem"
            tabIndex={-1}
            href={item.href}
            onClick={() => {
              if (ref.current) ref.current.open = false;
            }}
            className="block rounded p-2 text-xs text-slate-700 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-600"
          >
            {item.label}
          </Link>
        ))}
        <SignOutDialog menuItem onOpenChange={setDialogOpen} />
      </div>
    </details>
  );
}
