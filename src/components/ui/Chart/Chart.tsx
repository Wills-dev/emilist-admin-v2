'use client';

import {
  createContext,
  useContext,
  useId,
  type ComponentProps,
  type ReactNode,
} from 'react';
import { ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils/cn';

export type ChartConfig = Record<string, { label: string; color: string }>;
const ChartContext = createContext<ChartConfig | null>(null);

// shadcn-style chart container adapted to PascalCase source ownership and fixed
// semantic height utilities. Recharts handles SVG geometry and resize measurement.
export function ChartContainer({
  config,
  children,
  className,
  ...props
}: ComponentProps<'div'> & {
  config: ChartConfig;
  children: ComponentProps<typeof ResponsiveContainer>['children'];
}) {
  const id = useId();
  return (
    <ChartContext.Provider value={config}>
      <div
        data-chart={id.replace(/:/g, '')}
        data-slot="chart"
        className={cn(
          'min-w-0 text-xs [&_.recharts-cartesian-grid_line]:stroke-slate-100 [&_.recharts-surface]:outline-none',
          className,
        )}
        {...props}
      >
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          {children}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

export function ChartTooltipContent({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: readonly {
    value?: string | number | readonly (string | number)[];
    dataKey?: string | number;
    name?: string | number;
  }[];
  label?: ReactNode;
}) {
  const config = useContext(ChartContext);
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-white px-3 py-2 text-xs shadow-md">
      <p className="font-medium">{label}</p>
      {payload.map((item) => (
        <p
          key={String(item.dataKey || item.name)}
          className="mt-1 text-slate-600"
        >
          {config?.[String(item.dataKey)]?.label || item.name}:{' '}
          {String(item.value)}
        </p>
      ))}
    </div>
  );
}
