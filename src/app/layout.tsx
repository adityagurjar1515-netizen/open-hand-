import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'FACTVERSE AI - Every Fact Comes Alive',
    template: '%s | FACTVERSE AI',
  },
  description:
    'Discover the strange, fascinating and unbelievable facts hiding inside our universe. AI-powered facts platform with cinematic 3D animations.',
  keywords: [
    'facts',
    'AI',
    'science',
    'space',
    'history',
    'technology',
    'interesting facts',
    'knowledge',
    'education',
  ],
  authors: [{ name: 'FACTVERSE AI' }],
  creator: 'FACTVERSE AI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://factverse.ai',
    siteName: 'FACTVERSE AI',
    title: 'FACTVERSE AI - Every Fact Comes Alive',
    description:
      'Discover the strange, fascinating and unbelievable facts hiding inside our universe.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FACTVERSE AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FACTVERSE AI - Every Fact Comes Alive',
    description:
      'Discover the strange, fascinating and unbelievable facts hiding inside our universe.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#030712',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
