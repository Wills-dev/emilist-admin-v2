export type CustomerStatus = 'Active' | 'Inactive' | 'Suspended';
export interface Customer {
  id: string;
  joined: string;
  listName: string;
  fullName: string;
  username: string;
  email: string;
  phone?: string;
  address?: string;
  complete: boolean;
  status: CustomerStatus;
  wallet?: number;
  rating?: string;
  verified?: boolean;
  professions?: string[];
  details?: {
    registered: string;
    gender: string;
    language: string;
    firstName: string;
    middleName: string;
    lastName: string;
    city: string;
    state: string;
    country: string;
    businessPhone: string;
    mobilePhone: string;
    whatsapp?: string;
  };
}
export interface JobRecord {
  id: string;
  date: string;
  title: string;
  role: string;
  duration: string;
  budget: number;
  status: string;
}
export interface ListingRecord {
  id: string;
  date: string;
  product: string;
  category: string;
  price: number;
  stock: string;
  sold: number;
  status: string;
}
export interface OrderRecord {
  id: string;
  date: string;
  product: string;
  category: string;
  price: number;
  quantity: number;
  payment: string;
  status: string;
}
export interface SaleRecord {
  id: string;
  date: string;
  buyer: string;
  product: string;
  quantity: number;
  price: number;
  address: string;
  status: string;
}
export interface TransactionRecord {
  id: string;
  date: string;
  counterparty: string;
  type: 'Inflow' | 'Outflow';
  amount: number;
  method: string;
  status: string;
}
export interface SubscriptionRecord {
  id: string;
  date: string;
  amount: number;
  description: string;
  receipt: string;
  status: string;
  paid: string;
}
export interface ServiceRecord {
  id: string;
  name: string;
  category: string;
  location: string;
  description: string;
  metrics: readonly (readonly [string, string])[];
  coverage: readonly string[];
  locations: readonly string[];
}
