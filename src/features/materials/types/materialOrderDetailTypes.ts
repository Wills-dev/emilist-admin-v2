import type { MaterialOrder } from './materialTypes';
export interface MaterialComment {
  id: string;
  name: string;
  initials: string;
  rating: number;
  text: string;
  date: string;
}
export interface MaterialOrderDetail {
  order: MaterialOrder;
  unit: string;
  description: readonly string[];
  specifications: readonly { label: string; value: string }[];
  reviewCounts: readonly number[];
  comments: readonly MaterialComment[];
}
