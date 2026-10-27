import type { ReactNode } from 'react';
export function SettingsSection({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="overview-enter min-w-0 bg-white p-3">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="min-w-0">
          <h2 className="text-[10px] font-medium tracking-widest text-emerald-600">
            {title.toUpperCase()}
          </h2>
          <p className="mt-3 text-xs text-[#788096]">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
