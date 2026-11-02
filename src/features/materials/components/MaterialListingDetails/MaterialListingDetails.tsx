'use client';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { ROUTES, MATERIAL_ROUTES, CUSTOMER_ROUTES } from '@/constants/routes';
import { CopyValue } from '@/components/molecules/CopyValue/CopyValue';
import { ProfileSummaryCard } from '@/components/molecules/ProfileSummaryCard/ProfileSummaryCard';
import { RecordStatus } from '@/components/molecules/RecordStatus/RecordStatus';
import { MediaGallery } from '@/components/organisms/MediaGallery/MediaGallery';
import { OrderReviews } from '@/features/materials/components/OrderReviews/OrderReviews';
import { MaterialProductInformation } from '@/features/materials/components/MaterialProductInformation/MaterialProductInformation';
import { MaterialActionDialog } from '@/features/materials/components/MaterialActionDialog/MaterialActionDialog';
import { materialReviewSummary } from '@/features/materials/helpers/materialOrderDetailHelpers';
import { formatNaira } from '@/lib/format/formatNaira';
import type { MaterialListingDetail } from '@/features/materials/types/materialListingDetailTypes';
export function MaterialListingDetails({
  detail,
}: {
  detail: MaterialListingDetail;
}) {
  const { product } = detail;
  const reviews = materialReviewSummary(detail.reviewCounts);
  const link =
    'rounded-lg bg-white px-3 py-2 text-xs text-slate-700 transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none';
  return (
    <div className="min-w-0 space-y-3">
      <h1 className="sr-only">{product.name} — Listing Details</h1>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={ROUTES.materials}
          className={`${link} inline-flex items-center gap-1 text-neutral-500`}
        >
          <ChevronLeft className="size-4" />
          Back to Product Catalog
        </Link>
        <div className="flex flex-wrap gap-3">
          <Link
            href={MATERIAL_ROUTES.productOrders(product.id)}
            className={link}
          >
            View Product Orders
          </Link>
          <MaterialActionDialog
            product={product}
            variant="delist"
            quantity={0}
            unit={detail.unit.replace(/s$/, '')}
          />
        </div>
      </div>
      <div className="grid min-w-0 items-start gap-4 min-[75rem]:grid-cols-[minmax(0,1.8fr)_minmax(16rem,1fr)]">
        <article className="overview-enter min-w-0 space-y-4 rounded-xl bg-white p-4">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="min-w-0">
              <p className="text-[10px] text-neutral-500 italic">
                {product.date}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <span className="min-w-0 rounded-full bg-neutral-50 px-2 py-1 text-[10px] text-neutral-500">
                  Listing ID:{' '}
                  <CopyValue value={product.id} label="listing ID" />
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-500 italic">
                starts from{' '}
                <strong className="text-lg text-emerald-600 not-italic">
                  {formatNaira(product.price)}/{detail.unit}
                </strong>
              </p>
              <p className="mt-2 rounded bg-neutral-50 px-2 text-xs text-slate-500">
                {product.stock} in stock
              </p>
            </div>
          </header>
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
            <dl className="grid gap-3 rounded-lg border border-slate-100 bg-gradient-to-br from-white to-neutral-50 p-3 text-xs sm:grid-cols-2">
              <div className="flex flex-wrap gap-1 text-indigo-500">
                <dt>Location:</dt>
                <dd>{detail.location}</dd>
              </div>
              <div className="flex flex-wrap gap-1">
                <dt className="text-neutral-500">Brand:</dt>
                <dd>{detail.brand}</dd>
              </div>
              <div className="flex flex-wrap gap-1 sm:col-span-2">
                <dt className="text-neutral-500">Category:</dt>
                <dd>{product.category}</dd>
              </div>
              <div className="flex flex-wrap gap-1 sm:col-span-2">
                <dt className="text-neutral-500">Quantity sold:</dt>
                <dd>
                  {product.sold.toLocaleString('en-NG')} {detail.unit} sold
                </dd>
              </div>
            </dl>
            <RecordStatus status={product.status} />
          </div>
          <MediaGallery
            label="product"
            items={[
              `${product.name} overview`,
              'Packaging details',
              'Product detail',
            ]}
            wide
          />
          <div className="border-b border-slate-100 pb-4">
            <ProfileSummaryCard
              name="Demo Merchant"
              username={product.merchant}
              initials="DM"
              role="Merchant"
              href={CUSTOMER_ROUTES.details(product.customerId)}
              rating={reviews.average.toFixed(1)}
              reviews={reviews.total}
              showRating={reviews.total > 0}
            />
          </div>
          <MaterialProductInformation detail={detail} />
        </article>
        <OrderReviews detail={detail} />
      </div>
    </div>
  );
}
