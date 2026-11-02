import { expect, it } from 'vitest';
import {
  getMaterialOrderDetail,
  getMaterialListingDetail,
} from './materialOrderDetailFixtures';
import { materialReviewSummary } from '@/features/materials/helpers/materialOrderDetailHelpers';
import { orderReturnSchema } from '@/features/materials/schemas/orderReturnSchema';
import { MATERIAL_ROUTES } from '@/constants/routes';
it('retains selected order identity and derives consistent review statistics', () => {
  const detail = getMaterialOrderDetail('order-demo-record-60-004')!;
  expect(detail.order.quantity).toBe(255);
  expect(detail.order.product.price * detail.order.quantity).toBe(2295000);
  const summary = materialReviewSummary(detail.reviewCounts);
  expect(summary.total).toBe(51);
  expect(summary.average.toFixed(1)).toBe('4.0');
  expect(
    detail.comments.every((comment) => comment.name.startsWith('Demo ')),
  ).toBe(true);
  expect(getMaterialOrderDetail('missing')).toBeUndefined();
  expect(getMaterialOrderDetail('order-demo-record-60-001')?.comments).toEqual(
    [],
  );
  expect(materialReviewSummary([0, 0, 0, 0, 0])).toEqual({
    total: 0,
    average: 0,
  });
});
it('validates return drafts and encodes selected route segments', () => {
  expect(orderReturnSchema.safeParse({ reason: '  ' }).success).toBe(false);
  expect(
    orderReturnSchema.safeParse({ reason: 'A fictional return request.' })
      .success,
  ).toBe(true);
  expect(
    orderReturnSchema.safeParse({ reason: 'a'.repeat(1001) }).success,
  ).toBe(false);
  expect(MATERIAL_ROUTES.order('a/b')).toBe('/materials/orders/a%2Fb');
  expect(MATERIAL_ROUTES.stock('a&b')).toBe('/materials?search=a%26b');
});

it('keeps listing stock distinct from orders and validates de-list drafts', () => {
  const listing = getMaterialListingDetail('demo-record-60-004')!;
  expect(listing.product.stock).toBe('100,000 bags');
  expect(listing.product.sold).toBe(255);
  expect(listing.product.status).toBe('Listed');
  expect(
    listing.specifications.some((field) => field.label === 'Ordered quantity'),
  ).toBe(false);
  expect(getMaterialListingDetail('missing')).toBeUndefined();
  expect(getMaterialListingDetail('demo-record-60-001')?.comments).toEqual([]);
  expect(MATERIAL_ROUTES.listing('a/b')).toBe('/materials/listings/a%2Fb');
  expect(MATERIAL_ROUTES.productOrders('a&b')).toBe(
    '/materials/orders?search=a%26b',
  );
});
