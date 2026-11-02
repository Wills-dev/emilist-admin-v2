'use client';
import { useForm } from 'react-hook-form';
import { ChevronRight, Paperclip } from 'lucide-react';
import { replyDraftSchema } from '@/features/support/schemas/ticketActionSchemas';
export function TicketReplyDraft({ resolved }: { resolved: boolean }) {
  const {
    register,
    formState: { errors },
  } = useForm<{ reply: string }>({
    defaultValues: { reply: '' },
    mode: 'onChange',
  });
  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="border-t border-slate-100 p-4"
    >
      <div className="flex items-end gap-2">
        <button
          type="button"
          disabled
          aria-label="Attach file"
          title="Attachments require backend integration"
          className="rounded-lg bg-neutral-50 p-3 text-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Paperclip className="size-4" />
        </button>
        <label className="sr-only" htmlFor="ticket-reply-draft">
          Reply draft
        </label>
        <textarea
          id="ticket-reply-draft"
          rows={1}
          maxLength={2000}
          disabled={resolved}
          placeholder={
            resolved ? 'This sample ticket is resolved' : 'Type a reply...'
          }
          aria-invalid={!!errors.reply}
          aria-describedby={
            errors.reply ? 'ticket-reply-error' : 'ticket-reply-note'
          }
          {...register('reply', {
            validate: (value) => {
              const result = replyDraftSchema.safeParse({ reply: value });
              return (
                result.success ||
                result.error.issues[0]?.message ||
                'Enter a reply draft.'
              );
            },
          })}
          className="min-h-11 min-w-0 flex-1 resize-y rounded-xl border border-slate-100 bg-neutral-50 p-3 text-xs text-slate-700 focus-visible:outline-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <button
          type="submit"
          disabled
          aria-label="Send reply"
          title="Messaging requires backend integration; drafts are never sent"
          className="rounded-xl bg-emerald-500 p-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
      {errors.reply && (
        <p
          role="alert"
          id="ticket-reply-error"
          className="mt-2 text-xs text-rose-600"
        >
          {errors.reply.message}
        </p>
      )}
      <p id="ticket-reply-note" className="mt-2 text-[10px] text-slate-400">
        Local draft only. Sending and attachments are unavailable.
      </p>
    </form>
  );
}
