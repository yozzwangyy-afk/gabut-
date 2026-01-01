import Link from 'next/link';
import SearchBar from '@/components/ui/SearchBar';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="text-9xl font-bold mb-4 text-gradient bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          404
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Halaman Tidak Ditemukan</h1>
        <p className="text-gray-300 text-lg mb-8">
          Anime yang Anda cari mungkin belum tersedia atau telah dipindahkan.
        </p>
        
        <div className="mb-8 max-w-md mx-auto">
          <SearchBar />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
            <div className="text-3xl mb-2">🔍</div>
            <h3 className="font-bold mb-2">Cari Anime</h3>
            <p className="text-sm text-gray-400">
              Gunakan fitur pencarian untuk menemukan anime favorit Anda
            </p>
          </div>
          <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
            <div className="text-3xl mb-2">🏠</div>
            <h3 className="font-bold mb-2">Kembali ke Beranda</h3>
            <p className="text-sm text-gray-400">
              Jelajahi koleksi anime terbaru dan populer
            </p>
          </div>
          <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
            <div className="text-3xl mb-2">📺</div>
            <h3 className="font-bold mb-2">Sedang Tayang</h3>
            <p className="text-sm text-gray-400">
              Lihat anime yang sedang tayang di musim ini
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-bold hover:opacity-90 transition"
          >
            🏠 Kembali ke Beranda
          </Link>
          <Link
            href="/ongoing"
            className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition"
          >
            🔥 Sedang Tayang
          </Link>
          <Link
            href="/latest"
            className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition"
          >
            🆕 Anime Terbaru
          </Link>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          Jika Anda yakin ini adalah kesalahan, silakan laporkan masalah.
        </div>
      </div>
    </div>
  );
}
