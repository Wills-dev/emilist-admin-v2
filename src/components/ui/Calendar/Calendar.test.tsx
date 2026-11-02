import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { Calendar } from './Calendar';
it('supports month/year selectors and keyboard navigation with one day tab stop', async () => {
  const user = userEvent.setup();
  function Harness() {
    const [value, setValue] = useState('2036-10-18');
    return <Calendar value={value} onSelect={setValue} />;
  }
  render(<Harness />);
  await user.click(screen.getByRole('button', { name: '18 October 2036' }));
  await user.keyboard('{ArrowRight}');
  expect(screen.getByRole('button', { name: '19 October 2036' })).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(
    screen.getByRole('button', { name: '19 October 2036' }),
  ).toHaveAttribute('aria-pressed', 'true');
  await user.selectOptions(
    screen.getByRole('combobox', { name: 'Calendar month' }),
    '1',
  );
  await user.selectOptions(
    screen.getByRole('combobox', { name: 'Calendar year' }),
    '2028',
  );
  expect(
    screen.getByRole('button', { name: '29 February 2028' }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('grid').querySelectorAll('button[tabindex="0"]'),
  ).toHaveLength(1);
});
