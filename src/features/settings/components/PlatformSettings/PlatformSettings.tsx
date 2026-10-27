'use client';
import { SettingsSection } from '@/features/settings/components/SettingsSection/SettingsSection';
import { usePlatformDraft } from '@/features/settings/hooks/usePlatformDraft/usePlatformDraft';
import { Input } from '@/components/ui/Input/Input';
const editClass =
  'rounded-lg bg-[#20c46b] px-3 py-2 text-xs text-white transition-colors hover:bg-emerald-600 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none';
export function PlatformSettings() {
  const draft = usePlatformDraft();
  return (
    <SettingsSection
      title="Platform Settings"
      description="Manage platform rules, roles, staff access and security policies"
      action={
        draft.editing ? (
          <button type="button" onClick={draft.cancel} className={editClass}>
            Cancel edits
          </button>
        ) : (
          <button
            type="button"
            aria-label="Edit platform settings"
            onClick={draft.begin}
            className={editClass}
          >
            Edit
          </button>
        )
      }
    >
      <form onSubmit={(event) => event.preventDefault()}>
        <div className="grid min-w-0 gap-4 md:grid-cols-[1fr_2fr_1.3fr]">
          <label className="min-w-0 text-xs">
            Platform Commission (%)
            <span className="mt-2 flex min-w-0 gap-2">
              <span className="flex w-16 shrink-0 items-center justify-center rounded-lg border-4 border-neutral-100 bg-white text-neutral-500">
                %
              </span>
              <Input
                aria-label="Platform Commission (%)"
                aria-invalid={
                  draft.editing &&
                  draft.issues.some((issue) => issue.path[0] === 'commission')
                }
                aria-describedby={
                  draft.editing &&
                  draft.issues.some((issue) => issue.path[0] === 'commission')
                    ? 'platform-commission-error'
                    : undefined
                }
                type="number"
                min={0}
                max={100}
                readOnly={!draft.editing}
                className="min-w-0 bg-neutral-100"
                {...draft.form.register('commission', { valueAsNumber: true })}
              />
            </span>
          </label>
          <fieldset className="min-w-0">
            <legend className="text-xs">Withdrawal Limits</legend>
            <div className="mt-2 grid grid-cols-[3rem_1fr_1fr] gap-2">
              <span className="flex items-center justify-center rounded-lg border-4 border-neutral-100 bg-white text-sm text-neutral-500">
                ₦
              </span>
              <Input
                aria-label="Minimum withdrawal"
                aria-invalid={
                  draft.editing &&
                  draft.issues.some(
                    (issue) => issue.path[0] === 'withdrawalMin',
                  )
                }
                aria-describedby={
                  draft.editing &&
                  draft.issues.some(
                    (issue) => issue.path[0] === 'withdrawalMin',
                  )
                    ? 'platform-withdrawalMin-error'
                    : undefined
                }
                type="number"
                min={0}
                readOnly={!draft.editing}
                className="min-w-0 bg-neutral-100"
                {...draft.form.register('withdrawalMin', {
                  valueAsNumber: true,
                })}
              />
              <Input
                aria-label="Maximum withdrawal"
                aria-invalid={
                  draft.editing &&
                  draft.issues.some(
                    (issue) => issue.path[0] === 'withdrawalMax',
                  )
                }
                aria-describedby={
                  draft.editing &&
                  draft.issues.some(
                    (issue) => issue.path[0] === 'withdrawalMax',
                  )
                    ? 'platform-withdrawalMax-error'
                    : undefined
                }
                type="number"
                min={0}
                readOnly={!draft.editing}
                className="min-w-0 bg-neutral-100"
                {...draft.form.register('withdrawalMax', {
                  valueAsNumber: true,
                })}
              />
            </div>
          </fieldset>
          <label className="min-w-0 text-xs">
            Minimum Deposit Limit
            <span className="mt-2 flex min-w-0 gap-2">
              <span className="flex w-16 shrink-0 items-center justify-center rounded-lg border-4 border-neutral-100 bg-white text-neutral-500">
                ₦
              </span>
              <Input
                aria-label="Minimum Deposit Limit"
                aria-invalid={
                  draft.editing &&
                  draft.issues.some((issue) => issue.path[0] === 'depositMin')
                }
                aria-describedby={
                  draft.editing &&
                  draft.issues.some((issue) => issue.path[0] === 'depositMin')
                    ? 'platform-depositMin-error'
                    : undefined
                }
                type="number"
                min={0}
                readOnly={!draft.editing}
                className="min-w-0 bg-neutral-100"
                {...draft.form.register('depositMin', { valueAsNumber: true })}
              />
            </span>
          </label>
        </div>
        {draft.editing && (
          <div className="mt-4 space-y-2">
            <p role="note" className="text-xs text-slate-500">
              Local draft only. Saving financial configuration requires backend
              integration.
            </p>
            {draft.issues.map((issue) => (
              <p
                role="alert"
                id={`platform-${String(issue.path[0])}-error`}
                key={issue.path.join('.')}
                className="text-xs text-rose-600"
              >
                {issue.path.join('.')}: {issue.message}
              </p>
            ))}
            <button
              type="submit"
              disabled
              title="Backend integration required"
              className={`${editClass} disabled:opacity-50`}
            >
              Save changes — unavailable
            </button>
          </div>
        )}
      </form>
    </SettingsSection>
  );
}
