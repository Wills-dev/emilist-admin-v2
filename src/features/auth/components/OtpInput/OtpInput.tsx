'use client';
import { useId, useRef } from 'react';
import { cn } from '@/lib/utils/cn';

export function OtpInput({
  value,
  onChange,
  onBlur,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
}) {
  const id = useId();
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  function distribute(raw: string, start: number) {
    const digits = raw.replace(/\D/g, '').slice(0, 6 - start);
    if (!digits) return;
    const next = Array.from({ length: 6 }, (_, index) => value[index] || ' ');
    for (let index = 0; index < digits.length; index++)
      next[start + index] = digits[index] || ' ';
    onChange(next.join('').trimEnd());
    refs.current[Math.min(start + digits.length, 5)]?.focus();
  }
  return (
    <fieldset className="min-w-0">
      <legend className="mb-5 w-full text-center text-sm text-neutral-800">
        Enter Verification Code
      </legend>
      <div className="flex justify-center gap-1.5 sm:gap-2.5">
        {Array.from({ length: 6 }, (_, index) => (
          <input
            key={index}
            ref={(node) => {
              refs.current[index] = node;
            }}
            aria-label={`Verification digit ${index + 1}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            value={value[index]?.trim() || ''}
            maxLength={6}
            onFocus={(event) => event.target.select()}
            onBlur={onBlur}
            onChange={(event) => {
              if (!event.target.value) {
                const next = value.padEnd(6, ' ').split('');
                next[index] = ' ';
                onChange(next.join('').trimEnd());
              } else distribute(event.target.value, index);
            }}
            onPaste={(event) => {
              event.preventDefault();
              distribute(event.clipboardData.getData('text'), index);
            }}
            onKeyDown={(event) => {
              if (
                event.key === 'Backspace' &&
                !value[index]?.trim() &&
                index > 0
              ) {
                event.preventDefault();
                const next = value.padEnd(6, ' ').split('');
                next[index - 1] = ' ';
                onChange(next.join('').trimEnd());
                refs.current[index - 1]?.focus();
              }
              if (event.key === 'ArrowLeft' && index > 0) {
                event.preventDefault();
                refs.current[index - 1]?.focus();
              }
              if (event.key === 'ArrowRight' && index < 5) {
                event.preventDefault();
                refs.current[index + 1]?.focus();
              }
            }}
            className={cn(
              'h-12 w-full max-w-12 min-w-0 rounded-xl border border-transparent bg-white text-center text-xl font-medium outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 aria-invalid:border-red-600',
              value[index]?.trim() && 'border-green-500',
              index === 3 && 'ml-2 sm:ml-4',
            )}
          />
        ))}
      </div>
      {error && (
        <p
          role="alert"
          id={`${id}-error`}
          className="mt-3 text-center text-xs text-red-700"
        >
          {error}
        </p>
      )}
    </fieldset>
  );
}
