import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { LoginForm } from './LoginForm';

it('validates credentials locally, toggles visibility, and keeps sign-in unavailable', async () => {
  const user = userEvent.setup();
  render(<LoginForm />);
  await user.type(screen.getByLabelText('Enter Work Email'), 'invalid');
  expect(
    await screen.findByText('Enter a valid work email address.'),
  ).toBeVisible();
  await user.clear(screen.getByLabelText('Enter Work Email'));
  await user.type(
    screen.getByLabelText('Enter Work Email'),
    'admin@example.com',
  );
  const password = screen.getByLabelText('Enter Password');
  await user.type(password, 'local password');
  await user.click(screen.getByRole('button', { name: 'Show enter password' }));
  expect(password).toHaveAttribute('type', 'text');
  await user.click(screen.getByRole('button', { name: 'Hide enter password' }));
  expect(password).toHaveAttribute('type', 'password');
  await user.click(screen.getByRole('checkbox'));
  expect(screen.getByRole('checkbox')).toBeChecked();
  expect(screen.getByRole('button', { name: 'Proceed' })).toBeDisabled();
  expect(
    screen.getByRole('link', { name: 'Forgot Password?' }),
  ).toHaveAttribute('href', '/forgot-password');
});
