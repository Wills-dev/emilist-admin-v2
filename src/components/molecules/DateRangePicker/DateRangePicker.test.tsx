import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { DateRangePicker } from './DateRangePicker';
it('keeps range edits local until Apply and restores focus on dismissal', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(
    <DateRangePicker
      value={{ from: '2036-10-01', to: '2036-10-31' }}
      onChange={change}
      caption="October 2036"
    />,
  );
  const trigger = screen.getByRole('button', { name: 'Select dates' });
  await user.click(trigger);
  await user.click(screen.getByRole('button', { name: '18 October 2036' }));
  expect(screen.getByRole('button', { name: 'Apply dates' })).toBeDisabled();
  await user.click(screen.getByRole('button', { name: '26 October 2036' }));
  expect(change).not.toHaveBeenCalled();
  expect(screen.getAllByRole('gridcell', { selected: true })).toHaveLength(9);
  await user.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(change).not.toHaveBeenCalled();
  expect(trigger).toHaveFocus();
  await user.click(trigger);
  await user.click(screen.getByRole('button', { name: '18 October 2036' }));
  await user.click(screen.getByRole('button', { name: '26 October 2036' }));
  await user.click(screen.getByRole('button', { name: 'Apply dates' }));
  expect(change).toHaveBeenCalledWith({ from: '2036-10-18', to: '2036-10-26' });
});
