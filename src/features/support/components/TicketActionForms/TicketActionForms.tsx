'use client';
import { useForm } from 'react-hook-form';
import { DEMO_TEAMS } from '@/features/support/fixtures/ticketDetailFixtures';
import {
  escalationDraftSchema,
  resolutionDraftSchema,
} from '@/features/support/schemas/ticketActionSchemas';
import type {
  SupportTicket,
  TicketPriority,
} from '@/features/support/types/supportTypes';
export function TicketActionForms({
  action,
  ticket,
}: {
  action: 'escalate' | 'resolve';
  ticket: SupportTicket;
}) {
  const {
    register,
    formState: { errors },
  } = useForm<{ team: string; priority: TicketPriority; resolution: string }>({
    defaultValues: {
      team: DEMO_TEAMS[0],
      priority: ticket.priority,
      resolution: '',
    },
    mode: 'onChange',
  });
  const control =
    'mt-3 h-12 w-full min-w-0 rounded-xl border-0 bg-[#eeeeee] px-4 text-sm text-neutral-500 focus-visible:outline-2 focus-visible:outline-emerald-600';
  return (
    <form
      id="ticket-action-form"
      onSubmit={(event) => event.preventDefault()}
      className="border-t border-neutral-100 pt-6"
    >
      {action === 'escalate' ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-neutral-600">
            Assign to
            <select
              {...register('team', {
                validate: (value) =>
                  escalationDraftSchema.shape.team.safeParse(value).success ||
                  'Choose a sample team.',
              })}
              className={control}
            >
              {DEMO_TEAMS.map((team) => (
                <option key={team}>{team}</option>
              ))}
            </select>
          </label>
          <label className="text-sm text-neutral-600">
            Update Priority
            <select
              {...register('priority', {
                validate: (value) =>
                  escalationDraftSchema.shape.priority.safeParse(value)
                    .success || 'Choose a priority.',
              })}
              className={control}
            >
              {['Critical', 'High', 'Medium', 'Low'].map((priority) => (
                <option key={priority}>{priority}</option>
              ))}
            </select>
          </label>
        </div>
      ) : (
        <>
          <label htmlFor="ticket-resolution" className="sr-only">
            Resolution details
          </label>
          <textarea
            id="ticket-resolution"
            placeholder="Please state how you resolved the query"
            maxLength={2000}
            aria-invalid={!!errors.resolution}
            aria-describedby={
              errors.resolution ? 'ticket-resolution-error' : undefined
            }
            {...register('resolution', {
              validate: (value) => {
                const result = resolutionDraftSchema.safeParse({
                  resolution: value,
                });
                return (
                  result.success ||
                  result.error.issues[0]?.message ||
                  'Describe how the issue was resolved.'
                );
              },
            })}
            className="h-44 w-full resize-y rounded-xl border-0 bg-[#eeeeee] p-4 text-sm text-neutral-700 focus-visible:outline-2 focus-visible:outline-emerald-600"
          />
          {errors.resolution && (
            <p
              role="alert"
              id="ticket-resolution-error"
              className="mt-2 text-xs text-rose-600"
            >
              {errors.resolution.message}
            </p>
          )}
        </>
      )}
    </form>
  );
}
