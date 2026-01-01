import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ANONIME - Streaming Anime Gratis & Anonim',
  description: 'Streaming anime terbaru secara gratis, aman, dan anonim. Tanpa iklan mengganggu, tanpa registrasi. Tonton anime HD dengan subtitle Indonesia.',
  keywords: 'anime, streaming anime, nonton anime, anime subtitle Indonesia, anime terbaru',
  authors: [{ name: 'Anonime Team' }],
  creator: 'Anonime',
  publisher: 'Anonime',
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#1f2937',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://anonime.vercel.app',
    title: 'ANONIME - Streaming Anime Gratis & Anonim',
    description: 'Streaming anime terbaru secara gratis, aman, dan anonim.',
    siteName: 'ANONIME',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ANONIME',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ANONIME',
    description: 'Streaming anime terbaru secara gratis, aman, dan anonim.',
    images: ['/twitter-image.png'],
    creator: '@anonime',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="google-site-
