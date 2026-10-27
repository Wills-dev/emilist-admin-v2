// Internal static presentation model, not an API contract.
export type PaymentStatus = 'Pending' | 'Successful' | 'Failed';
export interface Payment {
  id: string;
  date: string;
  time: string;
  counterparty: string;
  direction: 'Inflow' | 'Outflow';
  description: string;
  amount: number;
  method: 'Bank Transfer' | 'Wallet';
  status: PaymentStatus;
}
