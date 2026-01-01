import AnimeCard from '@/components/anime/AnimeCard';
import { scraper } from '@/lib/scraper/kurama';

const days = [
  { id: 'all', name: 'Semua Hari' },
  { id: 'monday', name: 'Senin' },
  { id: 'tuesday', name: 'Selasa' },
  { id: 'wednesday', name: 'Rabu' },
  { id: 'thursday', name: 'Kamis' },
  { id: 'friday', name: 'Jumat' },
  { id: 'saturday', name: 'Sabtu' },
  { id: 'sunday', name: 'Minggu' },
];

export default async function SchedulePage() {
  const scheduleData = await scraper.getSchedule('all');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">📅 Jadwal Tayang</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Lihat jadwal rilis episode anime setiap hari. Selalu update dengan episode terbaru.
          </p>
        </div>

        {/* Day Selector */}
        <div className="mb-8">
          <div className="flex overflow-x-auto pb-4 space-x-2">
            {days.map((day) => (
              <a
                key={day.id}
                href={`/schedule?day=${day.id}`}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg whitespace-nowrap transition"
              >
                {day.name}
              </a>
            ))}
          </div>
        </div>

        {/* Schedule Content */}
        {scheduleData.success ? (
          <div className="space-y-12">
            {scheduleData.data.schedule.length > 0 ? (
              <>
                {/* All Anime Grid */}
                <div>
                  <h2 className="text-2xl font-bold mb-6">Semua Anime</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {scheduleData.data.schedule.map((anime: any) => (
                      <AnimeCard
                        key={anime.id}
                        anime={{
                          id: anime.id,
                          slug: anime.url.split('/').pop() || '',
                          title: anime.title,
                          poster: anime.poster,
                          rating: '',
                          type: '',
                          total_episode: anime.episode,
                          url: anime.url,
                        }}
                        showEpisode={true}
                        showRating={false}
                        size="sm"
                      />
                    ))}
                  </div>
                </div>

                {/* By Time Slots */}
                <div>
                  <h2 className="text-2xl font-bold mb-6">Berdasarkan Waktu</h2>
                  <div className="space-y-6">
                    {['Morning', 'Afternoon', 'Evening', 'Night'].map((timeSlot) => {
                      const timeAnime = scheduleData.data.schedule.filter(
                        (anime: any) => {
                          if (!anime.time) return false;
                          const hour = parseInt(anime.time.split(':')[0]);
                          if (timeSlot === 'Morning' && hour >= 6 && hour < 12) return true;
                          if (timeSlot === 'Afternoon' && hour >= 12 && hour < 18) return true;
                          if (timeSlot === 'Evening' && hour >= 18 && hour < 22) return true;
                          if (timeSlot === 'Night' && (hour >= 22 || hour < 6)) return true;
                          return false;
                        }
                      );

                      if (timeAnime.length === 0) return null;

                      return (
                        <div key={timeSlot} className="bg-gray-800/30 rounded-2xl p-6">
                          <h3 className="text-xl font-bold mb-4">{timeSlot} ({timeAnime.length} anime)</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {timeAnime.map((anime: any) => (
                              <div key={anime.id} className="bg-gray-800/50 rounded-xl p-4">
                                <div className="aspect-[3/4] bg-gray-700 rounded-lg mb-3 overflow-hidden">
                                  <img
                                    src={anime.poster}
                                    alt={anime.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <h4 className="font-medium text-sm line-clamp-2 mb-1">
                                  {anime.title}
                                </h4>
                                <div className="text-xs text-gray-400">
                                  {anime.time} • EP {anime.episode}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📅</div>
                <h2 className="text-2xl font-bold mb-2">Jadwal Kosong</h2>
                <p className="text-gray-400">
                  Tidak ada jadwal tayang untuk hari ini
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😢</div>
            <h2 className="text-2xl font-bold mb-2">Gagal Memuat Jadwal</h2>
            <p className="text-gray-400">{scheduleData.error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
