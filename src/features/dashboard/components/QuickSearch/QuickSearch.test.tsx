import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { QuickSearch } from './QuickSearch';
it('accepts search text without pretending to query customer records', async () => {
  render(<QuickSearch />);
  const user = userEvent.setup();
  await user.type(
    screen.getByRole('textbox', { name: 'Search customers' }),
    'customer{Enter}',
  );
  expect(screen.getByRole('status')).toHaveTextContent(
    'requires a connected service',
  );
  expect(screen.getByRole('textbox')).toHaveValue('customer');
});
