'use client';
import * as Dialog from '@radix-ui/react-dialog';
import { X, ImageOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { orderReturnSchema } from '@/features/materials/schemas/orderReturnSchema';
import { listingDeListSchema } from '@/features/materials/schemas/listingDeListSchema';
import type { MaterialProduct } from '@/features/materials/types/materialTypes';
import { formatNaira } from '@/lib/format/formatNaira';
export function MaterialActionDialog({
  product,
  variant,
  quantity,
  unit,
}: {
  product: MaterialProduct;
  variant: 'return' | 'delist';
  quantity: number;
  unit: string;
}) {
  const delist = variant === 'delist';
  const title = delist ? 'De-List Item' : 'Initiate Order Return';
  const reasonLabel = delist ? 'Reason for de-listing' : 'Reason for return';
  const reasonSchema = delist ? listingDeListSchema : orderReturnSchema;
  const {
    register,
    formState: { errors },
    reset,
  } = useForm<{ reason: string }>({
    defaultValues: { reason: '' },
    mode: 'onChange',
  });
  return (
    <Dialog.Root
      onOpenChange={(open) => {
        if (!open) reset();
      }}
    >
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="rounded-xl bg-[#20c46b] px-5 py-2 text-xs text-white transition-colors hover:bg-emerald-600 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none"
        >
          {delist ? 'De-List Item' : 'Initiate Return'}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="drawer-backdrop fixed inset-0 z-40 bg-black/25" />
        <Dialog.Content className="fixed inset-x-4 top-1/2 z-50 mx-auto max-h-[calc(100dvh_-_2rem)] max-w-sm -translate-y-1/2 overflow-y-auto rounded-xl bg-white p-4 shadow-2xl outline-none motion-safe:animate-[overview-enter_200ms_ease-out]">
          <div className="flex items-center justify-between gap-4">
            <Dialog.Title className="text-lg font-semibold text-[#4c554e]">
              {title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={
                  delist ? 'Close de-list dialog' : 'Close return dialog'
                }
                className="rounded p-1 text-neutral-500 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none"
              >
                <X className="size-5" />
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Description className="mt-2 text-sm leading-5 text-neutral-500">
            {delist
              ? 'Remove this product listing from the marketplace.'
              : 'Initiate a return of this order to the merchant per buyer’s request.'}
          </Dialog.Description>
          <div className="my-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-dashed border-neutral-200 bg-neutral-50 p-2 text-[10px]">
            <div className="flex min-w-0 items-center gap-2">
              <ImageOff className="size-8 shrink-0 text-neutral-400" />
              <div>
                <p className="text-xs text-slate-950">{product.name}</p>
                <p className="mt-1 break-all text-neutral-500">
                  {product.merchant} · Merchant
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-neutral-500 italic">
                {delist ? 'starts from' : 'costs'}{' '}
                <strong className="text-xs text-emerald-600 not-italic">
                  {formatNaira(
                    delist ? product.price : product.price * quantity,
                  )}
                  {delist && `/${unit.replace(/s$/, '')}`}
                </strong>
              </p>
              <p className="mt-1">
                {delist
                  ? `${product.stock} in stock`
                  : `Quantity: ${quantity.toLocaleString('en-NG')} ${unit}`}
              </p>
            </div>
          </div>
          <form
            onSubmit={(event) => event.preventDefault()}
            className="border-t border-neutral-100 pt-3"
          >
            <label htmlFor="material-action-reason" className="sr-only">
              {reasonLabel}
            </label>
            <textarea
              id="material-action-reason"
              placeholder="Please tell us why"
              maxLength={1000}
              aria-invalid={!!errors.reason}
              aria-describedby={
                errors.reason ? 'material-action-error' : undefined
              }
              {...register('reason', {
                validate: (value) => {
                  const parsed = reasonSchema.safeParse({ reason: value });
                  return (
                    parsed.success ||
                    parsed.error.issues[0]?.message ||
                    'Enter a reason for the return.'
                  );
                },
              })}
              className="h-36 w-full resize-y rounded-xl border-0 bg-[#eeeeee] p-3 text-sm text-neutral-700 focus-visible:outline-2 focus-visible:outline-emerald-600"
            />
            {errors.reason && (
              <p
                id="material-action-error"
                role="alert"
                className="mt-2 text-xs text-rose-600"
              >
                {errors.reason.message}
              </p>
            )}
            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-neutral-100 pt-4">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 transition-colors hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled
                title="Backend integration required; no changes will be submitted"
                className="rounded-lg bg-[#ff527c] px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                Submit
              </button>
            </div>
            <p
              role="note"
              className="mt-3 text-center text-[10px] text-slate-500"
            >
              Preview only. {delist ? 'De-listing' : 'Returns'} unavailable
              until backend integration.
            </p>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
