'use client';
import { useForm } from 'react-hook-form';
import { subscriptionPriceSchema } from '@/features/settings/schemas/adminDraftSchemas';
export function SubscriptionPriceForm() {
  const {
    register,
    formState: { errors },
  } = useForm<{
    basic: string;
    silver: string;
    gold: string;
    platinum: string;
  }>({
    defaultValues: {
      basic: '0',
      silver: '24000',
      gold: '32000',
      platinum: '48000',
    },
    mode: 'onChange',
  });
  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="grid gap-5 sm:grid-cols-2"
    >
      {(['basic', 'silver', 'gold', 'platinum'] as const).map((key) => (
        <label key={key} className="text-xs text-neutral-600">
          <span className="capitalize">{key} Plan</span>
          <span className="mt-2 flex items-center gap-2">
            <span
              aria-hidden="true"
              className="rounded-lg border-4 border-neutral-100 bg-white px-3 py-1 text-neutral-500"
            >
              ₦
            </span>
            <input
              aria-label={`${key[0]!.toUpperCase()}${key.slice(1)} Plan`}
              type="number"
              min={0}
              step="0.01"
              aria-invalid={!!errors[key]}
              aria-describedby={errors[key] ? `price-${key}-error` : undefined}
              {...register(key, {
                validate: (value) => {
                  const parsed =
                    subscriptionPriceSchema.shape[key].safeParse(value);
                  return (
                    parsed.success ||
                    parsed.error.issues[0]?.message ||
                    'Enter a valid amount.'
                  );
                },
              })}
              className="h-9 w-full min-w-0 rounded-lg border-0 bg-[#eeeeee] px-3 text-xs focus-visible:outline-2 focus-visible:outline-emerald-600"
            />
          </span>
          {errors[key] && (
            <span
              id={`price-${key}-error`}
              role="alert"
              className="mt-1 block text-[10px] text-rose-600"
            >
              {errors[key]?.message}
            </span>
          )}
        </label>
      ))}
    </form>
  );
}
