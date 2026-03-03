import type { Metadata } from "next";
import { setRequestLocale } from 'next-intl/server';
import { getMessages } from 'next-intl/server';
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vyu - Personal Finance",
  description: "Your modern personal finance companion.",
};

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'sv' }];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  // Load messages for client-side use
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <Providers locale={locale} messages={messages}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
