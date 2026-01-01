'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="text-9xl mb-4">😵</div>
        <h1 className="text-3xl font-bold mb-4">Terjadi Kesalahan</h1>
        <p className="text-gray-300 mb-6">
          {error.message || 'Maaf, terjadi kesalahan yang tidak terduga.'}
        </p>
        
        <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-6 mb-8">
          <h2 className="font-bold mb-2">Detail Error:</h2>
          <code className="text-sm text-red-300 break-all">
            {error.digest || error.stack || 'Unknown error'}
          </code>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-bold hover:opacity-90 transition"
          >
            Coba Lagi
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition"
          >
            Kembali ke Beranda
          </Link>
          <Link
            href="/search"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition"
          >
            Cari Anime
          </Link>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          Jika error terus berlanjut, silakan laporkan masalah ini.
        </div>
      </div>
    </div>
  );
}
