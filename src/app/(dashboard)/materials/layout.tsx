import type { ReactNode } from 'react';
import { MaterialsLayout } from '@/features/materials/components/MaterialsLayout/MaterialsLayout';
export default function Layout({ children }: { children: ReactNode }) {
  return <MaterialsLayout>{children}</MaterialsLayout>;
}
