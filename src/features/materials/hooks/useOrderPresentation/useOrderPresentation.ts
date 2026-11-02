'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import type { MaterialComment } from '@/features/materials/types/materialOrderDetailTypes';
export function useOrderPresentation(comments: readonly MaterialComment[]) {
  const pathname = usePathname();
  const params = useSearchParams();
  const search = (params.get('comments') || '').slice(0, 200);
  const section =
    params.get('section') === 'specifications'
      ? 'specifications'
      : 'description';
  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    window.history.replaceState(
      null,
      '',
      `${pathname}${next.size ? `?${next}` : ''}`,
    );
  }
  return {
    search,
    section,
    setSearch: (value: string) => update('comments', value),
    setSection: (value: 'description' | 'specifications') =>
      update('section', value === 'description' ? '' : value),
    comments: comments.filter((row) =>
      `${row.name} ${row.text}`
        .toLowerCase()
        .includes(search.trim().toLowerCase()),
    ),
  };
}
