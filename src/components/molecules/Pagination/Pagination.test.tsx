import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { Pagination } from './Pagination';
it('keeps large page ranges compact and announces the current page', async () => {
  const change = vi.fn();
  render(
    <Pagination
      page={5000}
      pages={10000}
      count={100000}
      onPageChange={change}
    />,
  );
  expect(screen.getByRole('button', { name: 'Page 5000' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  expect(screen.getAllByRole('button').length).toBeLessThanOrEqual(7);
  await userEvent.setup().click(screen.getByRole('button', { name: 'Next' }));
  expect(change).toHaveBeenCalledWith(5001);
});
it('disables previous and next for an empty one-page result', () => {
  render(<Pagination page={1} pages={1} count={0} onPageChange={() => {}} />);
  expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
});
