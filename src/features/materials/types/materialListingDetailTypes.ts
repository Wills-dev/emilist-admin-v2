import type { MaterialOrderDetail } from './materialOrderDetailTypes';
import type { MaterialProduct } from './materialTypes';
// Synthetic listing presentation; not an API response contract.
export interface MaterialListingDetail extends Omit<
  MaterialOrderDetail,
  'order'
> {
  product: MaterialProduct;
  location: string;
  brand: string;
}
