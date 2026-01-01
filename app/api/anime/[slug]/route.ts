import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { scraper } from '@/lib/scraper/kurama';
import AnimeCard from '@/components/anime/AnimeCard';
import EpisodeList from '@/components/anime/EpisodeList';
import DetailPanel from '@/components/anime/DetailPanel';
import Loading from '@/components/ui/Loading';

interface PageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
  };
}

export default async function AnimeDetailPage({ params, searchParams }: PageProps) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  
  // Fetch anime detail
  const animeData = await scraper.getAnimeDetail(
    `https://v8.kuramanime.tel/anime/${params.slug}`
  );

  if (!animeData.success) {
    notFound();
  }

  const { detail, episodes, related } = animeData.data;

  // Paginate episodes
  const episodesPerPage = 50;
  const startIndex = (page - 1) * episodesPerPage;
  const endIndex = startIndex + episodesPerPage;
  const paginatedEpisodes = episodes.slice(startIndex, endIndex);
  const totalPages = Math.ceil(episodes.length / episodesPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Background */}
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url(${detail.poster})`,
            filter: 'blur(20px) brightness(0.3)'
          }}
        />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Poster */}
            <div className="flex-shrink-0">
              <div className="w-48 md:w-56 lg:w-64 rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-700/50">
                <Image
                  src={detail.poster}
                  alt={detail.title}
                  width={256}
                  height={384}
                  className="w-full h-auto"
                  unoptimized
                />
              </div>
            </div>
            
            {/* Title & Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                {detail.title}
              </h1>
              <p className="text-gray-300 text-lg md:text-xl mb-6">
                {detail.japaneseTitle}
              </p>
              
              {/* Rating & Status */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2">
                  ⭐ {detail.rating || 'N/A'}
                </div>
                <div className="bg-gray-800 text-white px-4 py-2 rounded-full">
                  {detail.status || 'Unknown'}
                </div>
                <div className="bg-gray-800 text-white px-4 py-2 rounded-full">
                  {detail.info.type || 'TV'}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {episodes.length > 0 && (
                  <Link
                    href={`/watch/${episodes[0].slug || episodes[0].id}`}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-bold transition shadow-lg"
                  >
                    ▶ Tonton Sekarang
                  </Link>
                )}
                <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition">
                  ❤️ Tambah Favorit
                </button>
                <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition">
                  🔔 Notifikasi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Episodes & Content */}
          <div className="lg:col-span-2">
            {/* Synopsis */}
            <div className="bg-gray-800/30 rounded-2xl p-6 mb-8 border border-gray-700/50">
              <h2 className="text-2xl font-bold mb-4">📖 Sinopsis</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {detail.synopsis || 'Sinopsis tidak tersedia untuk anime ini.'}
              </p>
            </div>
            
            {/* Episodes */}
            <div className="bg-gray-800/30 rounded-2xl p-6 mb-8 border border-gray-700/50">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">🎬 Daftar Episode</h2>
                <div className="text-gray-400">
                  Total: <span className="text-white font-bold">{episodes.length}</span> episode
                </div>
              </div>
              
              {/* Episode List */}
              <EpisodeList 
                episodes={paginatedEpisodes} 
                animeSlug={params.slug}
              />
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8 pt-6 border-t border-gray-700/30">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(pageNum => 
                      pageNum === 1 || 
                      pageNum === totalPages || 
                      Math.abs(pageNum - page) <= 2
                    )
                    .map((pageNum, idx, array) => (
                      <div key={pageNum} className="flex items-center">
                        {idx > 0 && array[idx - 1] !== pageNum - 1 && (
                          <span className="mx-2 text-gray-500">...</span>
                        )}
                        <Link
                          href={`/anime/${params.slug}?page=${pageNum}`}
                          className={`w-10 h-10 flex items-center justify-center rounded-lg transition ${
                            pageNum === page
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-800 hover:bg-gray-700'
                          }`}
                        >
                          {pageNum}
                        </Link>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column - Details & Related */}
          <div className="space-y-6">
            {/* Info Panel */}
            <DetailPanel anime={{
              id: animeData.data.id || '',
              slug: params.slug,
              title: detail.title,
              poster: detail.poster,
              rating: detail.rating,
              type: detail.info.type || 'TV',
              total_episode: episodes.length.toString(),
              url: `https://v8.kuramanime.tel/anime/${params.slug}`,
              synopsis: detail.synopsis,
              genres: detail.genres,
              status: detail.status,
              duration: detail.info.durasi,
              studio: Array.isArray(detail.info.studio) 
                ? detail.info.studio.join(', ') 
                : detail.info.studio,
              season: detail.info.musim || detail.info.season,
            }} />
            
            {/* Related Anime */}
            {related.length > 0 && (
              <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-bold mb-4">🎯 Anime Terkait</h3>
                <div className="space-y-4">
                  {related.slice(0, 5).map((item: any, index) => (
                    <Link
                      key={index}
                      href={item.url.replace('https://v8.kuramanime.tel/anime/', '/anime/')}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700/50 transition group"
                    >
                      <div className="flex-shrink-0 w-16 h-20 bg-gray-700 rounded-lg overflow-hidden">
                        {/* Thumbnail placeholder - would need actual images */}
                        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                          <span className="text-gray-500">📺</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium group-hover:text-purple-300 transition truncate">
                          {item.title}
                        </h4>
                        <div className="text-xs text-gray-400 mt-1">
                          Klik untuk detail
                        </div>
                      </div>
                      <div className="text-gray-500 group-hover:text-gray-400 transition">
                        →
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quick Stats */}
            <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-xl font-bold mb-4">📊 Statistik</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">{episodes.length}</div>
                  <div className="text-sm text-gray-400">Total Episode</div>
                </div>
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">{detail.rating || 'N/A'}</div>
                  <div className="text-sm text-gray-400">Rating</div>
                </div>
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">{detail.genres?.length || 0}</div>
                  <div className="text-sm text-gray-400">Genre</div>
                </div>
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">
                    {detail.info.durasi || '24m'}
                  </div>
                  <div className="text-sm text-gray-400">Durasi/Episode</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
