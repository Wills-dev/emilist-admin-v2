import { MATERIAL_ORDERS, MATERIAL_PRODUCTS } from './materialFixtures';
import type { MaterialOrderDetail } from '@/features/materials/types/materialOrderDetailTypes';
import type { MaterialProduct } from '@/features/materials/types/materialTypes';
import type { MaterialListingDetail } from '@/features/materials/types/materialListingDetailTypes';
// Synthetic presentation records only; no operational accounts or API contracts.
function productPresentation(product: MaterialProduct) {
  const featured = product.id === 'demo-record-60-004';
  return {
    unit: product.stock.split(' ').slice(1).join(' '),
    description: [
      `Synthetic ${product.name.toLowerCase()} for a fictional building project. The product and merchant are shown for interface demonstration.`,
      'Delivery and payment labels are static sample records. No stock or financial updates can be performed.',
    ],
    specifications: [
      { label: 'Category', value: product.category },
      {
        label: 'Unit price',
        value: `NGN ${product.price.toLocaleString('en-NG')}`,
      },
      { label: 'Stock sample', value: product.stock },
    ],
    reviewCounts: featured ? [15, 25, 8, 3, 0] : [0, 0, 0, 0, 0],
    comments: featured
      ? [
          {
            id: 'demo-comment-001',
            name: 'Demo Reviewer One',
            initials: 'D1',
            rating: 5,
            text: 'This synthetic review demonstrates the product feedback layout, including longer comments and readable spacing.',
            date: '4 April 2026',
          },
          {
            id: 'demo-comment-002',
            name: 'Demo Reviewer Two',
            initials: 'D2',
            rating: 4,
            text: 'A fictional review of the sample material order. Delivery and quality details are illustrative only.',
            date: '3 April 2026',
          },
          {
            id: 'demo-comment-003',
            name: 'Demo Reviewer Three',
            initials: 'D3',
            rating: 3,
            text: 'Sample feedback for testing comment search and empty results.',
            date: '2 April 2026',
          },
        ]
      : [],
  };
}

export function getMaterialOrderDetail(
  id: string,
): MaterialOrderDetail | undefined {
  const order = MATERIAL_ORDERS.find((row) => row.id === id);
  if (!order) return undefined;
  const presentation = productPresentation(order.product);
  return {
    ...presentation,
    order,
    specifications: [
      ...presentation.specifications,
      { label: 'Ordered quantity', value: String(order.quantity) },
    ],
  };
}
export function getMaterialListingDetail(
  id: string,
): MaterialListingDetail | undefined {
  const product = MATERIAL_PRODUCTS.find((row) => row.id === id);
  if (!product) return undefined;
  return {
    ...productPresentation(product),
    product,
    location: 'Demo District, Fictional Avenue',
    brand: product.id === 'demo-record-60-004' ? 'Dangote' : 'Not supplied',
  };
}
