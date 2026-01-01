import AnimeGrid from '@/components/anime/AnimeGrid';
import { scraper } from '@/lib/scraper/kurama';

export default async function OngoingPage() {
  const homepageData = await scraper.getHomepage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">🔥 Sedang Tayang</h1>
          <p className="text-gray-400">
            Kumpulan anime yang sedang tayang di musim ini. Update episode baru setiap minggu.
          </p>
        </div>

        {/* Content */}
        {homepageData.success ? (
          homepageData.data.ongoing.length > 0 ? (
            <div className="space-y-8">
              {/* All Ongoing */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Semua Anime Sedang Tayang</h2>
                <AnimeGrid animeList={homepageData.data.ongoing} />
              </div>

              {/* Recently Updated */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Baru Diupdate</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {homepageData.data.ongoing.slice(0, 6).map((anime) => (
                    <div
                      key={anime.id}
                      className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50"
                    >
                      <div className="flex space-x-4">
                        <div className="flex-shrink-0 w-24 h-32 bg-gray-700 rounded-xl overflow-hidden">
                          <img
                            src={anime.poster}
                            alt={anime.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">{anime.title}</h3>
                          <div className="flex items-center space-x-3 mb-4">
                            <span className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded text-sm">
                              {anime.type}
                            </span>
                            <span className="text-yellow-400">⭐ {anime.rating}</span>
                          </div>
                          <p className="text-gray-400 text-sm line-clamp-3">
                            Update episode baru setiap minggu. Tersedia dengan subtitle Indonesia.
                          </p>
                          <a
                            href={`/anime/${anime.url.split('/').pop()}`}
                            className="inline-block mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                          >
                            Lihat Detail
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📺</div>
              <h2 className="text-2xl font-bold mb-2">Belum Ada Anime Sedang Tayang</h2>
              <p className="text-gray-400">
                Cek kembali nanti untuk anime musim baru
              </p>
            </div>
          )
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😢</div>
            <h2 className="text-2xl font-bold mb-2">Gagal Memuat Data</h2>
            <p className="text-gray-400">{homepageData.error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
