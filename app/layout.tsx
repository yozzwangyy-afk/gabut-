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
        <meta name="google-site-verification" content="your-verification-code" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-gray-900`}>
        {/* Skip to main content */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-purple-600 focus:text-white focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to main content
        </a>

        <div className="min-h-screen flex flex-col">
          <Header />
          
          <main id="main-content" className="flex-1">
            {children}
          </main>
          
          <Footer />
        </div>

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('Service Worker registered with scope:', registration.scope);
                    },
                    function(err) {
                      console.log('Service Worker registration failed:', err);
                    }
                  );
                });
              }
            `,
          }}
        />

        {/* PWA Install Prompt */}
        <div id="install-prompt" className="hidden fixed bottom-4 right-4 bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-2xl z-50 max-w-sm">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white">Install ANONIME</h3>
              <p className="text-sm text-gray-400 mt-1">
                Install aplikasi untuk pengalaman yang lebih baik
              </p>
              <div className="flex space-x-2 mt-3">
                <button id="install-btn" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition">
                  Install
                </button>
                <button id="dismiss-install" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition">
                  Nanti
                </button>
              </div>
            </div>
            <button id="close-install" className="text-gray-400 hover:text-white">
              ✕
            </button>
          </div>
        </div>

        {/* Back to Top Button */}
        <button
          id="back-to-top"
          className="fixed bottom-4 left-4 w-12 h-12 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-full flex items-center justify-center opacity-0 transition-opacity duration-300 z-40"
          aria-label="Back to top"
        >
          ↑
        </button>

        {/* Offline Indicator */}
        <div id="offline-indicator" className="hidden fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg z-50">
          ⚠️ Anda sedang offline
        </div>

        {/* Script for interactive elements */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Back to top button
              const backToTop = document.getElementById('back-to-top');
              window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                  backToTop.classList.remove('opacity-0');
                } else {
                  backToTop.classList.add('opacity-0');
                }
              });
              
              backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              });
              
              // Offline detection
              window.addEventListener('online', () => {
                document.getElementById('offline-indicator').classList.add('hidden');
              });
              
              window.addEventListener('offline', () => {
                document.getElementById('offline-indicator').classList.remove('hidden');
              });
              
              // PWA install prompt
              let deferredPrompt;
              const installPrompt = document.getElementById('install-prompt');
              const installBtn = document.getElementById('install-btn');
              const dismissBtn = document.getElementById('dismiss-install');
              const closeBtn = document.getElementById('close-install');
              
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                deferredPrompt = e;
                installPrompt.classList.remove('hidden');
              });
              
              if (installBtn) {
                installBtn.addEventListener('click', async () => {
                  if (!deferredPrompt) return;
                  deferredPrompt.prompt();
                  const { outcome } = await deferredPrompt.userChoice;
                  if (outcome === 'accepted') {
                    installPrompt.classList.add('hidden');
                  }
                  deferredPrompt = null;
                });
              }
              
              if (dismissBtn) {
                dismissBtn.addEventListener('click', () => {
                  installPrompt.classList.add('hidden');
                });
              }
              
              if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                  installPrompt.classList.add('hidden');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
