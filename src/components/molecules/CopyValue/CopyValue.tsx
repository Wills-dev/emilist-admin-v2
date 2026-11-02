'use client';
import { useState } from 'react';
import { Copy } from 'lucide-react';
export function CopyValue({ value, label }: { value: string; label: string }) {
  const [message, setMessage] = useState('');
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setMessage(`${label} copied`);
    } catch {
      setMessage('Clipboard unavailable. Select and copy the displayed value.');
    }
  }
  return (
    <span className="inline-flex min-w-0 items-center gap-1">
      <span className="break-all">{value}</span>
      <button
        type="button"
        aria-label={`Copy ${label}`}
        onClick={copy}
        className="rounded text-indigo-400 focus-visible:outline-2 focus-visible:outline-emerald-600"
      >
        <Copy className="size-2.5" />
      </button>
      <span role="status" className="sr-only">
        {message}
      </span>
    </span>
  );
}
