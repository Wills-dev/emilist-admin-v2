import { expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OrderReturnDialog } from './OrderReturnDialog';
import { getMaterialOrderDetail } from '@/features/materials/fixtures/materialOrderDetailFixtures';
it('validates a draft without enabling submission and restores trigger focus', async () => {
  const user = userEvent.setup();
  render(
    <OrderReturnDialog
      detail={getMaterialOrderDetail('order-demo-record-60-004')!}
    />,
  );
  const trigger = screen.getByRole('button', { name: 'Initiate Return' });
  await user.click(trigger);
  expect(
    screen.getByRole('dialog', { name: 'Initiate Order Return' }),
  ).toBeInTheDocument();
  await user.type(
    screen.getByRole('textbox', { name: 'Reason for return' }),
    '  ',
  );
  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Enter a reason for the return.',
  );
  await user.clear(screen.getByRole('textbox'));
  await user.type(screen.getByRole('textbox'), 'Synthetic damaged packaging');
  expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  await user.keyboard('{Escape}');
  expect(trigger).toHaveFocus();
  await user.click(trigger);
  expect(screen.getByRole('textbox')).toHaveValue('');
});
