import { MapPin, Clock, Layers, Users, BriefcaseBusiness } from 'lucide-react';
import { CUSTOMER_ROUTES } from '@/constants/routes';
import { CopyValue } from '@/components/molecules/CopyValue/CopyValue';
import { RecordStatus } from '@/components/molecules/RecordStatus/RecordStatus';
import { ProfileSummaryCard } from '@/components/molecules/ProfileSummaryCard/ProfileSummaryCard';
import { MediaGallery } from '@/components/organisms/MediaGallery/MediaGallery';
import {
  compactJobBudget,
  formatJobDate,
} from '@/features/jobs/helpers/jobDetailHelpers';
import type { JobDetail } from '@/features/jobs/types/jobDetailTypes';
export function JobOverview({ detail }: { detail: JobDetail }) {
  const { job } = detail;
  const expert = detail.applicants.find(
    (row) => row.id === detail.hiredApplicantId,
  );
  return (
    <article className="overview-enter min-w-0 space-y-4 rounded-xl bg-white p-4">
      <header className="flex flex-wrap justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="min-w-0">
          <p className="text-[10px] text-neutral-500 italic">
            Listed on {formatJobDate(job.date)}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold">{job.title}</h2>
            <span className="min-w-0 rounded-full bg-neutral-50 px-2 py-1 text-[10px] text-neutral-500">
              Job ID: <CopyValue value={job.id} label="job ID" />
            </span>
          </div>
        </div>
        <div className="text-right">
          <RecordStatus status={job.status} />
          <p className="mt-2 text-xs text-neutral-500 italic">
            budget starts from{' '}
            <strong className="text-emerald-600 not-italic">
              {compactJobBudget(job.budget)}
            </strong>
          </p>
        </div>
      </header>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <dl className="grid gap-3 rounded-lg border border-slate-100 bg-gradient-to-br from-white to-neutral-50 p-3 text-xs sm:grid-cols-2">
          <div className="flex items-center gap-1 text-indigo-500">
            <MapPin className="size-3" />
            <dt className="sr-only">Location</dt>
            <dd>{detail.location}</dd>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="size-3 text-neutral-500" />
            <dt className="sr-only">Duration</dt>
            <dd>{job.duration}</dd>
          </div>
          <div className="flex items-center gap-1">
            <BriefcaseBusiness className="size-3 text-neutral-500" />
            <dt className="sr-only">Experience level</dt>
            <dd>{detail.level}</dd>
          </div>
          <div className="flex items-center gap-1">
            <Layers className="size-3 text-neutral-500" />
            <dt className="sr-only">Milestones</dt>
            <dd>{detail.milestones.length} milestones</dd>
          </div>
          <div className="flex items-center gap-1">
            <Users className="size-3 text-neutral-500" />
            <dt className="sr-only">Applicants</dt>
            <dd>{job.applicants} applicants</dd>
          </div>
        </dl>
        <ProfileSummaryCard
          name={
            job.postedBy === 'demo-user-001'
              ? 'Demo Customer One'
              : job.postedBy
          }
          username={job.postedBy}
          initials="DO"
          role="Job Owner"
          href={CUSTOMER_ROUTES.details(job.customerId)}
        />
      </div>
      <MediaGallery
        label="job"
        items={['Room overview', 'Cabinet repairs', 'Door repairs']}
        wide
      />
      {expert && (
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 pb-4">
          <ProfileSummaryCard
            name={expert.name}
            username={expert.username}
            initials={expert.initials}
            role="Expert"
            rating={expert.rating}
            reviews={expert.reviews}
            verified={expert.verified}
          />
          <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] text-emerald-700">
            Milestone 2
          </span>
        </div>
      )}
      <section
        aria-label="Job description"
        className="space-y-4 rounded-lg bg-neutral-50 p-4 text-xs leading-5 text-neutral-500"
      >
        <h3 className="w-fit rounded-full bg-white px-3 py-1 text-[10px] text-slate-950">
          Job Description
        </h3>
        {detail.description.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>
    </article>
  );
}
