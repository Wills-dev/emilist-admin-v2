// Provisional presentation models; integrate only with supplied backend contracts.
export interface MaterialProduct {
  id: string;
  date: string;
  name: string;
  merchant: string;
  customerId: string;
  category: string;
  price: number;
  stock: string;
  sold: number;
  status: 'Listed' | 'Low Stock' | 'Out of Stock';
}
export interface MaterialOrder {
  id: string;
  date: string;
  product: MaterialProduct;
  buyer: string;
  buyerId: string;
  quantity: number;
  price: number;
  payment: 'Paid' | 'Pending';
  delivery: 'In Transit' | 'Delivered' | 'Cancelled' | 'Returned';
}
