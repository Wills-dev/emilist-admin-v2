export function filterFixtureRows<T>(
  rows: readonly T[],
  search: string,
  status: string,
  searchText: (row: T) => string,
  rowStatus: (row: T) => string,
) {
  const term = search.trim().toLowerCase();
  return rows.filter(
    (row) =>
      (!term || searchText(row).toLowerCase().includes(term)) &&
      (status === 'all' || rowStatus(row) === status),
  );
}
export function fixturePage<T>(
  rows: readonly T[],
  requestedPage: number,
  pageSize: number,
) {
  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const page = Math.max(1, Math.min(requestedPage, pages));
  return {
    rows: rows.slice((page - 1) * pageSize, page * pageSize),
    page,
    pages,
    count: rows.length,
  };
}
