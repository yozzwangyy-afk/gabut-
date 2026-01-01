import AnimeCard from './AnimeCard';
import { Anime } from '@/lib/types';

interface AnimeGridProps {
  animeList: Anime[];
  title?: string;
  loading?: boolean;
  emptyMessage?: string;
  gridCols?: string;
}

export default function AnimeGrid({ 
  animeList, 
  title,
  loading = false,
  emptyMessage = "Tidak ada anime yang ditemukan",
  gridCols = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
}: AnimeGridProps) {
  if (loading) {
    return (
      <div className="space-y-8">
        {title && <h2 className="text-2xl font-bold">{title}</h2>}
        <div className={`grid ${gridCols} gap-4`}>
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-[3/4] bg-gray-800 rounded-xl mb-3"></div>
              <div className="h-4 bg-gray-800 rounded mb-2"></div>
              <div className="h-3 bg-gray-800 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (animeList.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😴</div>
        <h3 className="text-xl font-bold mb-2">Kosong</h3>
        <p className="text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {title && (
        <h2 className="text-2xl font-bold border-l-4 border-purple-500 pl-4">
          {title}
        </h2>
      )}
      
      <div className={`grid ${gridCols} gap-4`}>
        {animeList.map((anime) => (
          <AnimeCard 
            key={anime.id} 
            anime={anime}
            showType={true}
            showEpisode={true}
            showRating={true}
            size="md"
          />
        ))}
      </div>
    </div>
  );
}
