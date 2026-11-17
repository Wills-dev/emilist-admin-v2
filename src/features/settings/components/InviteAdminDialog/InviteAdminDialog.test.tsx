import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { InviteAdminDialog } from './InviteAdminDialog';
it('validates an invitation draft and never enables delivery', async () => {
  const user = userEvent.setup();
  render(<InviteAdminDialog />);
  await user.click(screen.getByRole('button', { name: '+ Invite new admin' }));
  await user.type(
    screen.getByRole('textbox', { name: 'Email address' }),
    'invalid',
  );
  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Enter a valid email address.',
  );
  await user.clear(screen.getByRole('textbox', { name: 'Email address' }));
  await user.type(
    screen.getByRole('textbox', { name: 'Email address' }),
    'demo@example.test',
  );
  expect(screen.getByRole('button', { name: 'Invite Admin' })).toBeDisabled();
  await user.keyboard('{Escape}');
  await user.click(screen.getByRole('button', { name: '+ Invite new admin' }));
  expect(screen.getByRole('textbox', { name: 'Email address' })).toHaveValue(
    '',
  );
});
