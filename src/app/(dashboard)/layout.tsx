import { redirect } from 'next/navigation';

// Fail closed until the backend-backed SessionAdapter is implemented. Replace
// this redirect with server session validation before enabling dashboard access.
export default function Layout() {
  redirect('/login');
}
