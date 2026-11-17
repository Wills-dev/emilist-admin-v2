import { expect, it } from 'vitest';
import { suspensionDraftSchema } from './suspensionSchema';
it('requires an explicit suspension type and reason without inventing a backend duration', () => {
  expect(
    suspensionDraftSchema.safeParse({
      type: 'Temporary',
      reason: 'Policy review',
      context: '',
    }).success,
  ).toBe(true);
  expect(
    suspensionDraftSchema.safeParse({
      type: 'Forever',
      reason: '',
      context: '',
    }).success,
  ).toBe(false);
});
