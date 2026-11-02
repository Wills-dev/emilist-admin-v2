export function materialReviewSummary(counts: readonly number[]) {
  const total = counts.reduce((sum, count) => sum + count, 0);
  const average = total
    ? counts.reduce((sum, count, index) => sum + count * (5 - index), 0) / total
    : 0;
  return { total, average };
}
