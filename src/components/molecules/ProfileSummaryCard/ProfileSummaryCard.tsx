import Link from 'next/link';
import { BadgeCheck, Star } from 'lucide-react';
export function ProfileSummaryCard({
  name,
  username,
  initials,
  role,
  rating = '4.8',
  reviews = 51,
  href,
  verified = false,
  showRating = true,
}: {
  name: string;
  username: string;
  initials: string;
  role: string;
  rating?: string;
  reviews?: number;
  href?: string;
  verified?: boolean;
  showRating?: boolean;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-lg border border-slate-100 bg-gradient-to-br from-white to-neutral-50 p-3">
      <span
        aria-hidden="true"
        className="relative flex size-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-semibold text-emerald-600"
      >
        {initials}
        {verified && (
          <BadgeCheck className="absolute -top-1 -right-1 size-4 fill-indigo-500 text-white" />
        )}
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-medium text-[#4c554e]">{name}</p>
          <span className="rounded-full bg-slate-100 px-1.5 text-[9px] text-neutral-400">
            {role}
          </span>
        </div>
        {href ? (
          <Link
            href={href}
            className="text-[10px] break-all text-emerald-600 underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-emerald-600"
          >
            {username}
          </Link>
        ) : (
          <p className="text-[10px] break-all text-emerald-600">{username}</p>
        )}
        {showRating && (
          <div
            aria-label={`${rating} out of 5, ${reviews} sample reviews`}
            className="mt-1 flex flex-wrap items-center gap-1"
          >
            <span aria-hidden="true" className="inline-flex text-orange-400">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`size-3 ${i < 4 ? 'fill-current' : 'fill-neutral-300 text-neutral-300'}`}
                />
              ))}
            </span>
            <span className="text-[8px] text-neutral-500">
              ({reviews} reviews)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
