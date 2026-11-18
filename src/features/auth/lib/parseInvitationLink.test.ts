import { expect, it } from 'vitest';
import { parseInvitationLink } from './parseInvitationLink';

it('extracts once-decoded display fields and preserves plus addressing', () => {
  const query = new URLSearchParams(
    'token=synthetic-token&fullName=Jane+Doe&email=jane%2Binvited%40example.invalid&role=admin&invitedBy=John+Tom',
  );
  expect(parseInvitationLink(Object.fromEntries(query))).toEqual({
    token: 'synthetic-token',
    invalidToken: false,
    account: {
      fullName: 'Jane Doe',
      email: 'jane+invited@example.invalid',
      role: 'admin',
      invitedBy: 'John Tom',
    },
  });
});

it('rejects ambiguous tokens and does not coerce arrays into display values', () => {
  expect(
    parseInvitationLink({ token: ['first', 'second'], fullName: ['a', 'b'] }),
  ).toMatchObject({
    token: undefined,
    invalidToken: true,
    account: { fullName: undefined },
  });
  expect(
    parseInvitationLink({ token: 'first', invite: 'second' }).invalidToken,
  ).toBe(true);
  expect(parseInvitationLink({ token: ' ' }).invalidToken).toBe(true);
  expect(parseInvitationLink({ token: '..' }).invalidToken).toBe(true);
  expect(parseInvitationLink({}).invalidToken).toBe(false);
});
