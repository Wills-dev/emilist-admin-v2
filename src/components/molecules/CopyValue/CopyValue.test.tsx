import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { CopyValue } from './CopyValue';
it('copies the actual selected customer value and announces the result', async () => {
  const user = userEvent.setup();
  const write = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
  render(<CopyValue value="different-customer" label="customer ID" />);
  await user.click(screen.getByRole('button', { name: 'Copy customer ID' }));
  expect(write).toHaveBeenCalledWith('different-customer');
  expect(screen.getByRole('status')).toHaveTextContent('customer ID copied');
});
