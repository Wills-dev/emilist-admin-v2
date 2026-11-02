import { MaterialActionDialog } from '@/features/materials/components/MaterialActionDialog/MaterialActionDialog';
import type { MaterialOrderDetail } from '@/features/materials/types/materialOrderDetailTypes';
export function OrderReturnDialog({ detail }: { detail: MaterialOrderDetail }) {
  return (
    <MaterialActionDialog
      product={detail.order.product}
      variant="return"
      quantity={detail.order.quantity}
      unit={detail.unit}
    />
  );
}
