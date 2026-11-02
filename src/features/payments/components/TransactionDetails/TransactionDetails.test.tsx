import { expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionDetails } from './TransactionDetails';
import { getPayment } from '@/features/payments/fixtures/paymentFixtures';
const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));
it('copies the selected ID, keeps receipts unavailable and exits on Escape', async () => {
  const user = userEvent.setup();
  const copy = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
  render(<TransactionDetails payment={getPayment('demo-record-64-002')!} />);
  expect(screen.getByText('Debit')).toBeInTheDocument();
  expect(screen.getByText('Outflow')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Download PDF' })).toBeDisabled();
  await user.click(screen.getByRole('button', { name: 'Copy transaction ID' }));
  expect(copy).toHaveBeenCalledWith('demo-record-64-002');
  await user.keyboard('{Escape}');
  expect(push).toHaveBeenCalledWith('/payments');
});
