import Link from 'next/link';
import { Button } from '@/components/ui/Button/Button';
export default function NotFound() {
  return (
    <main className="mx-auto max-w-lg space-y-4 p-8">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-muted-foreground">
        The requested page is unavailable.
      </p>
      <Button asChild>
        <Link href="/dashboard">Return to overview</Link>
      </Button>
    </main>
  );
}
