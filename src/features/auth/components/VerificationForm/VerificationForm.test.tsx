import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { VerificationForm } from './VerificationForm';

it('never treats a complete local code as verified', async () => {
  const user = userEvent.setup();
  render(<VerificationForm />);
  await user.click(screen.getByLabelText('Verification digit 1'));
  await user.paste('123456');
  expect(
    screen.getByRole('button', { name: 'Complete Sign In' }),
  ).toBeDisabled();
  expect(screen.getByRole('note')).toHaveTextContent(
    'verification is unavailable',
  );
  expect(
    screen.queryByRole('link', { name: /dashboard/i }),
  ).not.toBeInTheDocument();
});
