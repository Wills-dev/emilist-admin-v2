import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { DataTable } from './DataTable';
it('exposes semantic headers and an honest empty result', () => {
  render(
    <DataTable
      rows={[] as { id: string }[]}
      columns={[{ id: 'id', header: 'Record ID', cell: (row) => row.id }]}
      rowKey={(row) => row.id}
      caption="Sample customers"
    />,
  );
  expect(screen.getByRole('columnheader', { name: 'Record ID' })).toBeVisible();
  expect(
    screen.getByRole('region', { name: 'Sample customers table scroll area' }),
  ).toHaveAttribute('tabindex', '0');
  expect(
    screen.getByText('No records match your search or filters.'),
  ).toBeVisible();
});
