'use client';
import { useState } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Input } from '@/components/ui/Input/Input';
import { AuthField } from '@/features/auth/components/AuthField/AuthField';

export function PasswordField({
  id,
  label,
  registration,
  error,
  autoComplete = 'new-password',
  placeholder = '12+ characters',
  className,
}: {
  id: string;
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  autoComplete?: string;
  placeholder?: string;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <AuthField id={id} label={label} error={error}>
      <div className="relative">
        <Input
          id={id}
          {...registration}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn('pr-12', className)}
        />
        <button
          type="button"
          aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`}
          aria-pressed={visible}
          onClick={() => setVisible(!visible)}
          className="absolute inset-y-0 right-1 flex w-10 items-center justify-center rounded-lg text-slate-500 focus-visible:outline-2 focus-visible:outline-emerald-600"
        >
          {visible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
        </button>
      </div>
    </AuthField>
  );
}
