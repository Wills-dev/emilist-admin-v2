'use client';
import {
  BadgeCheck,
  MapPin,
  Clock,
  BriefcaseBusiness,
  Users,
} from 'lucide-react';
import { CopyValue } from '@/components/molecules/CopyValue/CopyValue';
import { StatusBadge } from '@/components/ui/StatusBadge/StatusBadge';
import { EmptyState } from '@/components/molecules/EmptyState/EmptyState';
import { JobPartyCard } from '@/features/jobs/components/JobPartyCard/JobPartyCard';
import { JobMediaGallery } from '@/features/jobs/components/JobMediaGallery/JobMediaGallery';
import { useJobApplicants } from '@/features/jobs/hooks/useJobApplicants/useJobApplicants';
import { formatJobDate } from '@/features/jobs/helpers/jobDetailHelpers';
import type { JobDetail } from '@/features/jobs/types/jobDetailTypes';
export function JobApplicantInspector({ detail }: { detail: JobDetail }) {
  const { selected } = useJobApplicants(detail);
  const hired = detail.applicants.find(
    (item) => item.id === detail.hiredApplicantId,
  );
  return (
    <aside
      aria-label="Application details"
      className="space-y-4 rounded-xl border border-slate-200 bg-neutral-50 p-3"
    >
      <section className="rounded-lg bg-white p-3 text-xs">
        <header className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <h2 className="font-medium">Application Details</h2>
          <StatusBadge tone={hired ? 'success' : 'neutral'}>
            {hired ? 'Hired' : 'Not supplied'}
          </StatusBadge>
        </header>
        <dl className="mt-3 space-y-2 text-neutral-500">
          <div className="flex gap-1">
            <dt>Applicant samples:</dt>
            <dd>{detail.applicants.length}</dd>
          </div>
          <div className="flex flex-wrap gap-1">
            <dt>Hired:</dt>
            <dd>{hired?.name || 'Not supplied'}</dd>
          </div>
          <div className="flex flex-wrap gap-1">
            <dt>Date:</dt>
            <dd>
              {detail.hiredOn ? formatJobDate(detail.hiredOn) : 'Not supplied'}
            </dd>
          </div>
        </dl>
      </section>
      {selected ? (
        <article
          aria-label="Selected applicant profile"
          className="space-y-4 rounded-xl border border-slate-100 bg-white p-3"
        >
          <header className="border-b border-slate-100 pb-4">
            <p className="text-[10px] text-neutral-500 italic">
              Offline · Synthetic profile
            </p>
            <h2 className="mt-2 text-lg font-semibold">
              {selected.name}{' '}
              <BadgeCheck className="inline size-4 fill-indigo-500 text-white" />
            </h2>
            <p className="mt-2 text-[10px] text-neutral-500">
              Expert ID: <CopyValue value={selected.id} label="expert ID" />
            </p>
            <p className="mt-2 text-right text-[10px] text-neutral-500 italic">
              starts from{' '}
              <strong className="text-sm text-emerald-600 not-italic">
                ₦15k/day
              </strong>
            </p>
          </header>
          <dl className="space-y-3 rounded-lg border border-slate-100 bg-neutral-50/50 p-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <MapPin className="size-3 text-indigo-500" />
              <dt className="sr-only">Location</dt>
              <dd className="text-indigo-500">{selected.location}</dd>
              <Clock className="size-3 text-neutral-500" />
              <dt className="sr-only">Availability</dt>
              <dd>3 days</dd>
            </div>
            <div className="flex items-center gap-1">
              <BriefcaseBusiness className="size-3 text-neutral-500" />
              <dt className="sr-only">Experience</dt>
              <dd>
                {selected.level}{' '}
                <span className="text-[9px] text-neutral-500">
                  ({selected.experience}+ years of experience)
                </span>
              </dd>
            </div>
            <div className="flex items-center gap-1">
              <Users className="size-3 text-neutral-500" />
              <dt className="sr-only">Jobs completed</dt>
              <dd>{selected.completed} completed jobs</dd>
            </div>
          </dl>
          <JobMediaGallery key={selected.id} variant="expert" />
          <JobPartyCard
            name={selected.name}
            username={selected.username}
            initials={selected.initials}
            role="Expert"
            rating={selected.rating}
            reviews={selected.reviews}
            verified
          />
          <p className="text-xs leading-5 text-neutral-500">
            {selected.description}
          </p>
          <p className="text-xs text-neutral-500">
            Profile inspection only. Hiring and messaging are unavailable.
          </p>
        </article>
      ) : (
        <EmptyState
          title="No applicant profile"
          description="No applicant presentation records have been supplied for this job."
        />
      )}
    </aside>
  );
}
