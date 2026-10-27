'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto max-w-lg space-y-4 p-8">
          <h1 className="text-xl font-semibold">
            Unable to load the application
          </h1>
          <p>Please try again.</p>
          <button
            type="button"
            className="rounded-md border px-4 py-2 focus-visible:outline-2"
            onClick={reset}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
