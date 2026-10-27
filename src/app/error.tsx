'use client';
import { Button } from '@/components/ui/Button/Button';
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section role="alert" className="mx-auto max-w-lg space-y-4 p-8">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="text-sm text-muted-foreground">
        This view could not be loaded. Please try again.
      </p>
      <Button onClick={reset}>Try again</Button>
    </section>
  );
}
