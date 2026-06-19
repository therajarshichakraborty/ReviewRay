import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Oxanium } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { QueryProvider } from "@/components/providers/query-provider";

const oxanium = Oxanium({
  subsets: ['latin'],
  variable: '--font-sans'
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans'
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReviewRay",
  description: "AI Powered Code Reviewing Engine for Developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", oxanium.variable, geistSans.variable, geistMono.variable, "font-sans", inter.variable)}>
      <head />
      <body>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange>
            <AnimatedThemeToggler />
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
