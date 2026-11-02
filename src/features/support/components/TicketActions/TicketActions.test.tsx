import { expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TicketActions } from './TicketActions';
import { getTicketDetail } from '@/features/support/fixtures/ticketDetailFixtures';
it('keeps resolution and escalation drafts unavailable and restores trigger focus', async () => {
  const user = userEvent.setup();
  render(
    <TicketActions ticket={getTicketDetail('demo-record-74-001')!.ticket} />,
  );
  const resolve = screen.getByRole('button', { name: 'Resolve Ticket' });
  await user.click(resolve);
  let dialog = screen.getByRole('dialog');
  await user.type(
    within(dialog).getByRole('textbox', { name: 'Resolution details' }),
    ' ',
  );
  expect(await within(dialog).findByRole('alert')).toHaveTextContent(
    'Describe how the issue was resolved.',
  );
  await user.type(within(dialog).getByRole('textbox'), 'Synthetic review');
  expect(
    within(dialog).getByRole('button', { name: 'Resolve Ticket' }),
  ).toBeDisabled();
  await user.keyboard('{Escape}');
  expect(resolve).toHaveFocus();
  await user.click(
    screen.getByRole('button', { name: 'Escalate/Re-assign Ticket' }),
  );
  dialog = screen.getByRole('dialog');
  await user.selectOptions(
    within(dialog).getByRole('combobox', { name: 'Update Priority' }),
    'High',
  );
  expect(within(dialog).getByRole('button', { name: 'Submit' })).toBeDisabled();
  await user.keyboard('{Escape}');
  await user.click(
    screen.getByRole('button', { name: 'Escalate/Re-assign Ticket' }),
  );
  expect(screen.getByRole('combobox', { name: 'Update Priority' })).toHaveValue(
    'Critical',
  );
});
