import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'sonner';
import { QueryProvider } from '@/components/providers/QueryProvider';

export const metadata: Metadata = {
  title: 'Quizy - Trivia',
  description: 'Minimal, aesthetic trivia based on Vercel UX.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className} suppressHydrationWarning>
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster 
              position="top-right" 
              richColors
              toastOptions={{
                className: 'vercel-panel !shadow-lg !px-4 !py-3 !min-w-[300px] !bg-background !text-foreground !border-border',
              }}
            />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
