import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { OtpInput } from './OtpInput';

function ControlledOtp() {
  const [value, setValue] = useState('');
  return <OtpInput value={value} onChange={setValue} />;
}
it('distributes pasted digits and supports keyboard correction', async () => {
  const user = userEvent.setup();
  render(<ControlledOtp />);
  await user.click(
    screen.getByRole('textbox', { name: 'Verification digit 1' }),
  );
  await user.paste('123-456');
  for (let index = 1; index <= 6; index++)
    expect(
      screen.getByRole('textbox', { name: `Verification digit ${index}` }),
    ).toHaveValue(String(index));
  expect(
    screen.getByRole('textbox', { name: 'Verification digit 6' }),
  ).toHaveFocus();
  await user.keyboard('{Backspace}{Backspace}');
  expect(
    screen.getByRole('textbox', { name: 'Verification digit 5' }),
  ).toHaveFocus();
  expect(
    screen.getByRole('textbox', { name: 'Verification digit 5' }),
  ).toHaveValue('');
  await user.keyboard('{ArrowLeft}');
  expect(
    screen.getByRole('textbox', { name: 'Verification digit 4' }),
  ).toHaveFocus();
});
