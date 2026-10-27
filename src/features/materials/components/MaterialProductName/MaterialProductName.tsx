import { ImageOff } from 'lucide-react';
export function MaterialProductName({ name }: { name: string }) {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <span
        role="img"
        aria-label={`${name} image unavailable`}
        title="Product image not supplied"
        className="flex size-7 shrink-0 items-center justify-center rounded bg-stone-100 text-stone-400"
      >
        <ImageOff aria-hidden="true" className="size-4" />
      </span>
      <span className="truncate text-slate-950" title={name}>
        {name}
      </span>
    </span>
  );
}
