'use client';
import { useEffect } from 'react';
// The innermost controlled dialog owns Escape, including nested date pickers.
const activeDialogs: symbol[] = [];
export function useDialogEscape(
  open: boolean,
  setOpen: (open: boolean) => void,
) {
  useEffect(() => {
    if (!open) return;
    const token = Symbol();
    activeDialogs.push(token);
    function dismiss(event: KeyboardEvent) {
      if (event.key !== 'Escape' || activeDialogs.at(-1) !== token) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      setOpen(false);
    }
    window.addEventListener('keydown', dismiss, true);
    return () => {
      window.removeEventListener('keydown', dismiss, true);
      const index = activeDialogs.indexOf(token);
      if (index >= 0) activeDialogs.splice(index, 1);
    };
  }, [open, setOpen]);
}
