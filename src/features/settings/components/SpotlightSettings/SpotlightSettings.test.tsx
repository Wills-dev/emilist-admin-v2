import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { SpotlightSettings } from './SpotlightSettings';
it('keeps one independent selection per category without enabling publication', async () => {
  const user = userEvent.setup();
  render(<SpotlightSettings />);
  const first = screen.getByLabelText(
    'Select Tokunbo Ajibade Williams expert-tokunbo',
  );
  const second = screen.getByLabelText('Select Isaac Okonkwo expert-isaac', {
    exact: true,
  });
  await user.click(second);
  expect(second).toBeChecked();
  expect(first).not.toBeChecked();
  expect(
    screen.getByLabelText('Select Isaac Okonkwo merchant-isaac'),
  ).toBeChecked();
  expect(screen.getByRole('button', { name: 'Publish' })).toBeDisabled();
  await user.type(
    screen.getByRole('textbox', { name: 'Search spotlight candidates' }),
    'missing',
  );
  expect(screen.getAllByText('No candidates match your filters.')).toHaveLength(
    2,
  );
});
