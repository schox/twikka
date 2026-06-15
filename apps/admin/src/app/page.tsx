import { redirect } from 'next/navigation';

/**
 * Root page - redirects to the private landing page
 * Unauthenticated users see the private app screen
 * Authenticated users will be redirected to the appropriate page from there
 */
export default function RootPage() {
  redirect('/private');
}
