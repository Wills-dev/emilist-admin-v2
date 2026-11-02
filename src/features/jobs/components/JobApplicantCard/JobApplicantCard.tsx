import { BadgeCheck, Star, UserRound } from 'lucide-react';
import { compactJobBudget } from '@/features/jobs/helpers/jobDetailHelpers';
import type { JobApplicant } from '@/features/jobs/types/jobDetailTypes';
export function JobApplicantCard({
  applicant,
  selected,
  onSelect,
}: {
  applicant: JobApplicant;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <article
      className={`overview-card min-w-0 space-y-4 rounded-2xl border bg-neutral-50 p-4 ${selected ? 'border-emerald-200' : 'border-slate-100'}`}
    >
      <header className="flex min-w-0 items-center gap-3 border-b border-neutral-200 pb-4">
        <span
          aria-hidden="true"
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-neutral-300"
        >
          <UserRound className="size-8" />
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold">
            {applicant.name}{' '}
            {applicant.verified && (
              <BadgeCheck
                aria-label="Sample verified profile"
                className="inline size-4 fill-indigo-500 text-white"
              />
            )}
          </h3>
          <p className="mt-1 text-[10px] text-neutral-500 italic">
            budget price{' '}
            <strong className="text-xs text-emerald-600 not-italic">
              {compactJobBudget(applicant.budget)}
            </strong>
          </p>
          <p
            aria-label={`${applicant.rating} out of 5, ${applicant.reviews} sample reviews`}
            className="mt-2 flex flex-wrap items-center gap-1"
          >
            <span aria-hidden="true" className="flex text-orange-400">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`size-3 ${i < 4 ? 'fill-current' : 'fill-neutral-300 text-neutral-300'}`}
                />
              ))}
            </span>
            <span className="text-[8px] text-neutral-500">
              ({applicant.reviews} reviews)
            </span>
          </p>
        </div>
      </header>
      <dl className="grid gap-2 rounded-lg border border-slate-100 bg-white p-3 text-[9px] text-neutral-500 sm:grid-cols-2">
        <div className="text-indigo-500">
          <dt className="sr-only">Location</dt>
          <dd>• {applicant.location}</dd>
        </div>
        <div>
          <dt className="sr-only">Completed jobs</dt>
          <dd>• {applicant.completed} jobs completed</dd>
        </div>
        <div>
          <dt className="sr-only">Level</dt>
          <dd>• {applicant.level}</dd>
        </div>
        <div>
          <dt className="sr-only">Experience</dt>
          <dd>• {applicant.experience}+ years of experience</dd>
        </div>
        <div>
          <dt className="sr-only">Profession</dt>
          <dd>• Carpenter</dd>
        </div>
      </dl>
      <button
        type="button"
        aria-pressed={selected}
        aria-label={`View profile: ${applicant.name}`}
        onClick={onSelect}
        className="w-full rounded-lg border border-neutral-200 bg-[#fcfff8] px-3 py-2 text-[10px] text-neutral-600 transition-colors hover:border-emerald-400 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none"
      >
        View Profile
      </button>
    </article>
  );
}
