import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google';

import { QueryProvider } from '@/components/providers/query-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import './globals.css';

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans', display: 'swap' });
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? process.env.BETTER_AUTH_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: 'ReviewRay | AI code review for every pull request',
    template: '%s | ReviewRay',
  },
  description:
    'ReviewRay reviews every pull request with codebase context. Precise findings, severity tags and ready-to-paste fixes, posted straight to GitHub.',
  applicationName: 'ReviewRay',
  icons: { icon: '/logo.svg' },
  openGraph: {
    type: 'website',
    siteName: 'ReviewRay',
    title: 'ReviewRay | AI code review for every pull request',
    description:
      'Precise, codebase-aware pull request reviews with ready-to-paste fixes, posted straight to GitHub.',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fdfdfd' },
    { media: '(prefers-color-scheme: dark)', color: '#16171a' },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(geistSans.variable, geistMono.variable, instrumentSerif.variable, 'h-full')}
    >
      <head>
        <noscript>
          <style>
            {'[data-reveal]{opacity:1!important;transform:none!important;filter:none!important}'}
          </style>
        </noscript>
      </head>
      <body className="min-h-full bg-background font-sans text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>{children}</QueryProvider>
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
