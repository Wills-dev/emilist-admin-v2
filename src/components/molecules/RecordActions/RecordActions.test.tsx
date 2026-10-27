import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { RecordActions } from './RecordActions';
it('opens disabled backend actions and closes on Escape with focus restored', async () => {
  const user = userEvent.setup();
  render(<RecordActions name="Sample job" actions={['Pause job']} />);
  const summary = screen.getByLabelText('Actions for Sample job');
  await user.click(summary);
  expect(
    screen.getByRole('button', { name: 'Pause job — unavailable' }),
  ).toBeDisabled();
  await user.keyboard('{Escape}');
  expect(summary.closest('details')).not.toHaveAttribute('open');
  expect(summary).toHaveFocus();
});
