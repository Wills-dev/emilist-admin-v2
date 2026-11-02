'use client';
import Link from 'next/link';
import { ChevronLeft, Minus, Plus } from 'lucide-react';
import { ROUTES, MATERIAL_ROUTES, CUSTOMER_ROUTES } from '@/constants/routes';
import { CopyValue } from '@/components/molecules/CopyValue/CopyValue';
import { ProfileSummaryCard } from '@/components/molecules/ProfileSummaryCard/ProfileSummaryCard';
import { RecordStatus } from '@/components/molecules/RecordStatus/RecordStatus';
import { MediaGallery } from '@/components/organisms/MediaGallery/MediaGallery';
import { OrderReturnDialog } from '@/features/materials/components/OrderReturnDialog/OrderReturnDialog';
import { OrderReviews } from '@/features/materials/components/OrderReviews/OrderReviews';
import { MaterialProductInformation } from '@/features/materials/components/MaterialProductInformation/MaterialProductInformation';
import { materialReviewSummary } from '@/features/materials/helpers/materialOrderDetailHelpers';
import { formatNaira } from '@/lib/format/formatNaira';
import type { MaterialOrderDetail } from '@/features/materials/types/materialOrderDetailTypes';
export function MaterialOrderDetails({
  detail,
}: {
  detail: MaterialOrderDetail;
}) {
  const { order } = detail;
  const reviews = materialReviewSummary(detail.reviewCounts);
  const link =
    'rounded-lg bg-white px-3 py-2 text-xs text-slate-700 transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none';
  return (
    <div className="min-w-0 space-y-3">
      <h1 className="sr-only">{order.product.name} — Order Details</h1>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={ROUTES.materialOrders}
          className={`${link} inline-flex items-center gap-1 text-neutral-500`}
        >
          <ChevronLeft className="size-4" />
          Back to Orders
        </Link>
        <div className="flex flex-wrap gap-3">
          <Link href={MATERIAL_ROUTES.stock(order.product.id)} className={link}>
            View Product Stock
          </Link>
          <OrderReturnDialog detail={detail} />
        </div>
      </div>
      <div className="grid min-w-0 items-start gap-4 min-[75rem]:grid-cols-[minmax(0,1.8fr)_minmax(16rem,1fr)]">
        <article className="overview-enter min-w-0 space-y-4 rounded-2xl bg-white p-4">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="min-w-0">
              <p className="text-[10px] text-neutral-500 italic">
                {order.date}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold">{order.product.name}</h2>
                <span className="min-w-0 rounded-full bg-neutral-50 px-2 py-1 text-[10px] text-neutral-500">
                  Order ID: <CopyValue value={order.id} label="order ID" />
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-500 italic">
                costs{' '}
                <strong className="text-lg text-emerald-600 not-italic">
                  {formatNaira(order.product.price * order.quantity)}
                </strong>
              </p>
              <div className="mt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled
                  aria-label="Decrease order quantity"
                  title="Order quantities are read-only"
                  className="text-neutral-300 disabled:cursor-not-allowed"
                >
                  <Minus className="size-4 rounded-full border" />
                </button>
                <span
                  aria-label={`Ordered quantity: ${order.quantity} ${detail.unit}`}
                  className="rounded bg-neutral-50 px-2 text-sm text-slate-600"
                >
                  {order.quantity.toLocaleString('en-NG')}
                </span>
                <button
                  type="button"
                  disabled
                  aria-label="Increase order quantity"
                  title="Order quantities are read-only"
                  className="text-neutral-300 disabled:cursor-not-allowed"
                >
                  <Plus className="size-4 rounded-full border" />
                </button>
              </div>
            </div>
          </header>
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
            <ProfileSummaryCard
              name="Demo Merchant"
              username={order.product.merchant}
              initials="DM"
              role="Merchant"
              rating={reviews.average.toFixed(1)}
              reviews={reviews.total}
              showRating={reviews.total > 0}
              href={CUSTOMER_ROUTES.details(order.product.customerId)}
            />
            <RecordStatus status={order.payment} />
          </div>
          <MediaGallery
            label="product"
            items={[
              `${order.product.name} overview`,
              'Packaging details',
              'Product detail',
            ]}
            wide
          />
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 pb-4">
            <ProfileSummaryCard
              name="Demo Buyer"
              username={order.buyer}
              initials="DB"
              role="Buyer"
              href={CUSTOMER_ROUTES.details(order.buyerId)}
              showRating={false}
            />
            <RecordStatus status={order.delivery} />
          </div>
          <MaterialProductInformation detail={detail} />
        </article>
        <OrderReviews detail={detail} />
      </div>
    </div>
  );
}
