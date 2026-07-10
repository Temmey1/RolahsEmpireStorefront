import type { Metadata } from 'next';

import { Providers } from './providers';
import './globals.css';

import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'ROLAHS EMPIRE — Premium Men\'s Collection',
  description: 'Clothes, Sneakers, Watches, Accessories. Everything a King wears.',
  keywords: 'menswear, fashion, Lagos, Nigeria, sneakers, watches, accessories',
  openGraph: {
    title: 'ROLAHS EMPIRE',
    description: 'Premium Men\'s Fashion & Accessories',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Bebas+Neue&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
