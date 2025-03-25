import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { NavigationHeader } from '@/components/layout/navigation-header';
import { AuthProvider } from '@/lib/auth-context';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Queens Puzzle',
  description: 'Multiplayer Queens puzzle game',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <NavigationHeader />
          <main className="min-h-screen">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
