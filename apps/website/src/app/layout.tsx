import type { Metadata } from 'next';
import './global.css';
import AppToaster from '@/components/AppToaster';

export const metadata: Metadata = {
  title: 'Twikka',
  description: 'Twikka - The relationship app for couples who want to thrive together',
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;

  return (
    <html lang={locale ?? 'en'} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        <AppToaster />
        {children}
      </body>
    </html>
  );
}
