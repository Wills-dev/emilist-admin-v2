import { expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MaterialActionDialog } from './MaterialActionDialog';
import { getMaterialListingDetail } from '@/features/materials/fixtures/materialOrderDetailFixtures';
it('validates a de-list draft, blocks submission and resets it on dismissal', async () => {
  const user = userEvent.setup();
  const detail = getMaterialListingDetail('demo-record-60-004')!;
  render(
    <MaterialActionDialog
      product={detail.product}
      variant="delist"
      quantity={0}
      unit={detail.unit}
    />,
  );
  const trigger = screen.getByRole('button', { name: 'De-List Item' });
  await user.click(trigger);
  await user.type(
    screen.getByRole('textbox', { name: 'Reason for de-listing' }),
    ' ',
  );
  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Enter a reason for de-listing.',
  );
  await user.type(screen.getByRole('textbox'), 'Synthetic listing review');
  expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  await user.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(trigger).toHaveFocus();
  await user.click(trigger);
  expect(screen.getByRole('textbox')).toHaveValue('');
});
