import { EmptyState } from '@/components/molecules/EmptyState/EmptyState';
export default function UnauthorizedPage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <EmptyState
        title="Administrator session required"
        description="An authenticated administrator session is required. Sign-in will be available after the authentication service is connected."
      />
    </main>
  );
}
