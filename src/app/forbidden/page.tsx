import { EmptyState } from '@/components/molecules/EmptyState/EmptyState';
export default function ForbiddenPage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <EmptyState
        title="Access denied"
        description="You do not have permission to access this resource. Contact your administrator if you need access."
      />
    </main>
  );
}
