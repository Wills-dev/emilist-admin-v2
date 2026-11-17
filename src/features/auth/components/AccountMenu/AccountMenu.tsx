'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { SignOutDialog } from '@/features/auth/components/SignOutDialog/SignOutDialog';
export function AccountMenu({ initials }: { initials: string }) {
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
        className="flex size-8 cursor-pointer list-none items-center justify-center rounded-full bg-[#727987] text-xs text-white focus-visible:outline-2 focus-visible:outline-emerald-600 [&::-webkit-details-marker]:hidden"
      >
        {initials}
      </summary>
      <div
        role="menu"
        aria-label="Account menu"
        className="absolute top-11 right-0 w-48 rounded-xl border border-slate-100 bg-white p-2 shadow-lg motion-safe:animate-[overview-enter_200ms_ease-out]"
      >
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
