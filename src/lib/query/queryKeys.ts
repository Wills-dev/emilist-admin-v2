// Domain modules extend their root with list/detail keys and serializable filters.
// Invalidate the domain root after mutations; never put credentials in a key.
export const queryKeys = {
  domain: (domain: string) => [domain] as const,
  list: (
    domain: string,
    filters: Readonly<Record<string, string | number | boolean | null>>,
  ) => [domain, 'list', filters] as const,
  detail: (domain: string, id: string) => [domain, 'detail', id] as const,
};
