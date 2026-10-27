import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { Button } from './Button';
it('prevents duplicate actions while disabled', async () => {
  const onClick = vi.fn();
  render(
    <Button disabled onClick={onClick}>
      Saving
    </Button>,
  );
  await userEvent.setup().click(screen.getByRole('button', { name: 'Saving' }));
  expect(onClick).not.toHaveBeenCalled();
});
it('preserves link semantics when composed', () => {
  render(
    <Button asChild>
      <a href="/dashboard">Overview</a>
    </Button>,
  );
  expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute(
    'href',
    '/dashboard',
  );
});
