import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { AuthIllustration } from './AuthIllustration';

it.each([
  ['login', 'login-illustration.svg'],
  ['signup', 'signup-illustration.svg'],
  ['forgotPassword', 'forgot-password-illustration.svg'],
] as const)(
  'selects the %s artwork without duplicating its background symbol',
  (variant, filename) => {
    const { container } = render(<AuthIllustration variant={variant} />);
    const sources = Array.from(container.querySelectorAll('img'), (element) =>
      element.getAttribute('src'),
    );
    expect(sources).toEqual([
      '/images/auth/auth-background-logo.svg',
      `/images/auth/${filename}`,
    ]);
    expect(
      container.querySelectorAll(
        'img[src="/images/auth/auth-background-logo.svg"]',
      ),
    ).toHaveLength(1);
    expect(container.querySelectorAll('img:not([alt=""])')).toHaveLength(0);
  },
);
