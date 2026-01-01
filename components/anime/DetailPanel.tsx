import { Anime } from '@/lib/types';

interface DetailPanelProps {
  anime: Anime;
}

export default function DetailPanel({ anime }: DetailPanelProps) {
  const infoItems = [
    { label: 'Status', value: anime.status },
    { label: 'Tayang', value: anime.season },
    { label: 'Studio', value: anime.studio },
    { label: 'Durasi', value: anime.duration },
    { label: 'Genre', value: anime.genres?.join(', ') },
    { label: 'Rating', value: `⭐ ${anime.rating}` },
  ];

  return (
    <div className="bg-gray-800/30 rounded-2xl border border-gray-700/50 p-6">
      <h2 className="text-2xl font-bold mb-6">Informasi Detail</h2>
      
      <div className="space-y-4">
        {infoItems.map((item, index) => (
          item.value && (
            <div key={index} className="flex border-b border-gray-700/30 pb-3">
              <div className="w-1/3 text-gray-400">{item.label}</div>
              <div className="w-2/3 text-white">{item.value}</div>
            </div>
          )
        ))}
      </div>

      {/* Synopsis */}
      {anime.synopsis && (
        <div className="mt-8 pt-6 border-t border-gray-700/30">
          <h3 className="text-xl font-bold mb-4">Sinopsis</h3>
          <p className="text-gray-300 leading-relaxed whitespace-pre-line">
            {anime.synopsis}
          </p>
        </div>
      )}

      {/* Genres */}
      {anime.genres && anime.genres.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-700/30">
          <h3 className="text-xl font-bold mb-4">Genre</h3>
          <div className="flex flex-wrap gap-2">
            {anime.genres.map((genre, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition cursor-pointer"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
