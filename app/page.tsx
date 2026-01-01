import AnimeGrid from '@/components/anime/AnimeGrid';
import { scraper } from '@/lib/scraper/kurama';
import Header from '@/components/ui/Header';
import SearchBar from '@/components/ui/SearchBar';

export default async function Home() {
  const homepageData = await scraper.getHomepage();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              ANONIME
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Streaming anime terbaru secara gratis, aman, dan anonim. 
            Tanpa iklan mengganggu, tanpa registrasi.
          </p>
          
          <div className="max-w-2xl mx-auto mb-12">
            <SearchBar />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-gray-800/30 rounded-2xl border border-gray-700/50">
              <div className="text-3xl mb-2">📺</div>
              <div className="font-bold">10K+</div>
              <div className="text-sm text-gray-400">Episode Anime</div>
            </div>
            <div className="text-center p-6 bg-gray-800/30 rounded-2xl border border-gray-700/50">
              <div className="text-3xl mb-2">⚡</div>
              <div className="font-bold">HD</div>
              <div className="text-sm text-gray-400">Kualitas Streaming</div>
            </div>
            <div className="text-center p-6 bg-gray-800/30 rounded-2xl border border-gray-700/50">
              <div className="text-3xl mb-2">🔒</div>
              <div className="font-bold">100%</div>
              <div className="text-sm text-gray-400">Anonim & Aman</div>
            </div>
            <div className="text-center p-6 bg-gray-800/30 rounded-2xl border border-gray-700/50">
              <div className="text-3xl mb-2">🚀</div>
              <div className="font-bold">Fast</div>
              <div className="text-sm text-gray-400">Server Cepat</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Content Sections */}
      <div className="container mx-auto max-w-6xl px-4 py-12">
        {homepageData.success ? (
          <>
            <section className="mb-16">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold mb-2">🔥 Sedang Tayang</h2>
                  <p className="text-gray-400">Anime musim ini yang sedang berlangsung</p>
                </div>
                <a 
                  href="/ongoing" 
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition"
                >
                  Lihat Semua
                </a>
              </div>
              <AnimeGrid animeList={homepageData.data.ongoing} />
            </section>
            
            <section className="mb-16">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold mb-2">🎬 Anime Terbaru</h2>
                  <p className="text-gray-400">Rilis episode terbaru setiap hari</p>
                </div>
                <a 
                  href="/latest" 
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition"
                >
                  Lihat Semua
                </a>
              </div>
              <AnimeGrid animeList={homepageData.data.latest} />
            </section>
            
            <section className="mb-16">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold mb-2">🏆 Populer Minggu Ini</h2>
                  <p className="text-gray-400">Anime paling banyak ditonton</p>
                </div>
                <a 
                  href="/popular" 
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition"
                >
                  Lihat Semua
                </a>
              </div>
              <AnimeGrid animeList={homepageData.data.popular} />
            </section>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😢</div>
            <h2 className="text-2xl font-bold mb-2">Gagal Memuat Data</h2>
            <p className="text-gray-400">Silakan coba lagi nanti</p>
          </div>
        )}
      </div>
    </div>
  );
}
