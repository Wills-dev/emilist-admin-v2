import { PageHeader } from '@/components/molecules/PageHeader/PageHeader';
import { EmptyState } from '@/components/molecules/EmptyState/EmptyState';
export function DashboardOverview() {
  return (
    <>
      <PageHeader
        title="Overview"
        description="A central workspace for Emilist marketplace administration."
      />
      <section className="rounded-xl border bg-card p-6">
        <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
          Project foundation
        </p>
        <h2 className="mt-3 text-lg font-semibold">
          Ready for backend integration
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          The application shell is in place. Marketplace data and administrative
          actions will become available as backend contracts and access controls
          are connected.
        </p>
      </section>
      <EmptyState
        title="No live data connected"
        description="Dashboard metrics will appear after the reporting API and administrator session integration are configured."
      />
    </>
  );
}
