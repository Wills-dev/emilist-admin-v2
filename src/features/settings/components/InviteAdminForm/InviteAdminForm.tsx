'use client';
import { useForm } from 'react-hook-form';
import { inviteAdminSchema } from '@/features/settings/schemas/adminDraftSchemas';
export function InviteAdminForm() {
  const {
    register,
    formState: { errors },
  } = useForm<{
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    department: string;
  }>({
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      role: '',
      department: 'Operations',
    },
    mode: 'onChange',
  });
  const fields = [
    { key: 'email', label: 'Email address', placeholder: 'admin@example.test' },
    { key: 'firstName', label: 'First name', placeholder: 'First name' },
    { key: 'lastName', label: 'Last name', placeholder: 'Last name' },
    { key: 'role', label: 'Role', placeholder: 'Role label' },
  ] as const;
  const control =
    'mt-2 h-10 w-full min-w-0 rounded-xl border-0 bg-[#eeeeee] px-3 text-xs text-neutral-600 focus-visible:outline-2 focus-visible:outline-emerald-600';
  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="grid gap-4 sm:grid-cols-2"
    >
      {fields.map((field) => (
        <label
          key={field.key}
          className={`min-w-0 text-xs text-neutral-600 ${field.key === 'email' ? 'sm:col-span-2' : ''}`}
        >
          {field.label}
          <input
            aria-label={field.label}
            type={field.key === 'email' ? 'email' : 'text'}
            autoComplete="off"
            maxLength={field.key === 'email' ? 254 : 80}
            placeholder={field.placeholder}
            aria-invalid={!!errors[field.key]}
            aria-describedby={
              errors[field.key] ? `invite-${field.key}-error` : undefined
            }
            {...register(field.key, {
              validate: (value) => {
                const parsed =
                  inviteAdminSchema.shape[field.key].safeParse(value);
                return (
                  parsed.success ||
                  parsed.error.issues[0]?.message ||
                  'Enter a valid value.'
                );
              },
            })}
            className={control}
          />
          {errors[field.key] && (
            <span
              role="alert"
              id={`invite-${field.key}-error`}
              className="mt-1 block text-[10px] text-rose-600"
            >
              {errors[field.key]?.message}
            </span>
          )}
        </label>
      ))}
      <label className="text-xs text-neutral-600">
        Department
        <select {...register('department')} className={control}>
          {['Operations', 'Product', 'Finance', 'Support'].map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </label>
    </form>
  );
}
