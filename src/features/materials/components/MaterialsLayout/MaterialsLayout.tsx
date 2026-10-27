'use client';
import type { ReactNode } from 'react';
import { Package, PackagePlus, Truck, RotateCcw, CircleX } from 'lucide-react';
import { SummaryMetrics } from '@/components/molecules/SummaryMetrics/SummaryMetrics';
const metrics = [
  { label: 'Total Active Listings', value: '152,130', icon: Package },
  { label: 'New Orders', value: '420', icon: PackagePlus },
  { label: 'Deliveries in Progress', value: '33', icon: Truck },
  { label: 'Returned Orders', value: '14', icon: RotateCcw },
  { label: 'Cancelled Orders', value: '10', icon: CircleX },
];
export function MaterialsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h1 className="sr-only">Materials</h1>
      <SummaryMetrics metrics={metrics} />
      <p role="note" className="text-[10px] text-slate-500">
        Static materials presentation data · 10 sample records per section ·
        Counts are design fixtures. Product images and backend actions
        unavailable.
      </p>
      {children}
    </div>
  );
}
