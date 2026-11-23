'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ChevronRight, Paperclip } from 'lucide-react';
import { toast } from 'sonner';
import { replyDraftSchema } from '@/features/support/schemas/ticketActionSchemas';
const MAX_ATTACHMENTS = 10;
const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;
const ACCEPTED_ATTACHMENT_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);
export function TicketReplyDraft({
  resolved,
  onReply,
  pending,
}: {
  resolved: boolean;
  onReply?: (body: FormData) => Promise<unknown>;
  pending?: boolean;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ reply: string }>({
    defaultValues: { reply: '' },
    mode: 'onChange',
  });
  const [attachments, setAttachments] = useState<File[]>([]);

  const selectAttachments = (files: FileList | null) => {
    if (!files) return;
    const next = [...attachments, ...Array.from(files)];
    if (next.length > MAX_ATTACHMENTS) {
      toast.error(`You can attach up to ${MAX_ATTACHMENTS} images.`);
      return;
    }
    const invalid = next.find(
      (file) =>
        !ACCEPTED_ATTACHMENT_TYPES.has(file.type) ||
        file.size > MAX_ATTACHMENT_BYTES,
    );
    if (invalid) {
      toast.error('Attachments must be JPG, PNG, or WEBP images up to 10 MB.');
      return;
    }
    setAttachments(next);
  };
  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        if (!onReply) return;
        const formData = new FormData();
        formData.append('message', values.reply);
        attachments.forEach((file) => formData.append('attachments', file));
        try {
          await onReply(formData);
          reset();
          setAttachments([]);
          toast.success('Reply sent.');
        } catch {
          toast.error('Unable to send the reply. Please try again.');
        }
      })}
      className="border-t border-slate-100 p-4"
    >
      <div className="flex items-end gap-2">
        <label
          className="cursor-pointer rounded-lg bg-neutral-50 p-3 text-indigo-500 transition-colors focus-within:outline-2 focus-within:outline-emerald-600 hover:bg-indigo-50 disabled:cursor-not-allowed"
          aria-label="Attach file"
        >
          <Paperclip className="size-4" />
          <input
            className="sr-only"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            disabled={resolved || pending}
            onChange={(event) => {
              selectAttachments(event.target.files);
              event.target.value = '';
            }}
          />
        </label>
        <label className="sr-only" htmlFor="ticket-reply-draft">
          Reply draft
        </label>
        <textarea
          id="ticket-reply-draft"
          rows={1}
          maxLength={2000}
          disabled={resolved || pending}
          placeholder={resolved ? 'This ticket is resolved' : 'Type a reply...'}
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
          disabled={resolved || pending || !onReply}
          aria-label="Send reply"
          title={
            resolved
              ? 'Resolved tickets cannot receive replies'
              : 'Send reply to customer'
          }
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
        JPG, PNG, or WEBP · up to 10 images · 10 MB each
        {attachments.length ? ` · ${attachments.length} selected` : ''}
      </p>
    </form>
  );
}
