import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { NewPasswordForm } from './NewPasswordForm';

it('updates requirements and confirmation errors without claiming a password was saved', async () => {
  const user = userEvent.setup();
  render(<NewPasswordForm />);
  await user.type(screen.getByLabelText('Create Password'), 'LongPassword12!');
  expect(screen.getByText('12+ characters').textContent).toContain(': met');
  await user.type(screen.getByLabelText('Confirm Password'), 'different');
  expect(await screen.findByText('Passwords do not match.')).toBeVisible();
  await user.clear(screen.getByLabelText('Confirm Password'));
  await user.type(screen.getByLabelText('Confirm Password'), 'LongPassword12!');
  expect(screen.queryByText('Passwords do not match.')).not.toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: 'Create Password' }),
  ).toBeDisabled();
});
