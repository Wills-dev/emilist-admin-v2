import type { Metadata } from 'next';
import { AppProviders } from '@/providers/AppProviders/AppProviders';
import './globals.css';
export const metadata: Metadata = {
  title: { default: 'Emilist Admin', template: '%s | Emilist Admin' },
  description: 'Emilist marketplace administration workspace',
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
