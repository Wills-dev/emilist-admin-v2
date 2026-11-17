import * as Dialog from '@radix-ui/react-dialog';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { DatePicker } from './DatePicker';
it('dismisses only the nested calendar and returns focus to the date control', async () => {
  const user = userEvent.setup();
  render(
    <Dialog.Root defaultOpen>
      <Dialog.Portal>
        <Dialog.Content>
          <Dialog.Title>Schedule draft</Dialog.Title>
          <Dialog.Description>Choose draft dates.</Dialog.Description>
          <DatePicker
            label="Start date"
            value="2036-10-18"
            onChange={vi.fn()}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>,
  );
  const trigger = screen.getByRole('button', { name: 'Choose start date' });
  await user.click(trigger);
  expect(
    screen.getByRole('dialog', { name: 'Choose start date' }),
  ).toBeInTheDocument();
  await user.keyboard('{Escape}');
  expect(
    screen.getByRole('dialog', { name: 'Schedule draft' }),
  ).toBeInTheDocument();
  expect(trigger).toHaveFocus();
});
