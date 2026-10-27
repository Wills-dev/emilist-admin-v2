export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h1>
      {description && (
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
