'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Episode } from '@/lib/types';

interface EpisodeListProps {
  episodes: Episode[];
  animeSlug: string;
  currentEpisode?: string;
  maxDisplay?: number;
}

export default function EpisodeList({ 
  episodes, 
  animeSlug,
  currentEpisode,
  maxDisplay = 50 
}: EpisodeListProps) {
  const [displayCount, setDisplayCount] = useState(maxDisplay);
  const router = useRouter();

  const handleEpisodeClick = (episode: Episode) => {
    // Extract episode number from slug or URL
    let episodeId = episode.slug;
    if (!episodeId && episode.url) {
      episodeId = episode.url.split('/').pop() || '';
    }
    
    if (episodeId) {
      router.push(`/watch/${episodeId}`);
    }
  };

  const showMore = () => {
    setDisplayCount(prev => Math.min(prev + 50, episodes.length));
  };

  if (episodes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        Episode belum tersedia
      </div>
    );
  }

  const displayedEpisodes = episodes.slice(0, displayCount);

  return (
    <div className="space-y-2">
      {/* Episode Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
        {displayedEpisodes.map((episode) => {
          const isCurrent = currentEpisode === episode.slug || 
                           currentEpisode === episode.id.toString();
          
          return (
            <button
              key={episode.id}
              onClick={() => handleEpisodeClick(episode)}
              className={`
                aspect-square rounded-lg flex flex-col items-center justify-center
                transition-all duration-200 hover:scale-105
                ${isCurrent
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                }
              `}
              title={`Episode ${episode.episodeNumber}: ${episode.title}`}
            >
              <div className="text-lg font-bold">{episode.episodeNumber}</div>
              {isCurrent && (
                <div className="text-xs mt-1 animate-pulse">▶</div>
              )}
            </button>
          );
        })}
      </div>

      {/* Show More Button */}
      {displayCount < episodes.length && (
        <div className="text-center pt-4">
          <button
            onClick={showMore}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition"
          >
            Tampilkan Lebih Banyak ({episodes.length - displayCount} tersisa)
          </button>
        </div>
      )}

      {/* Episode Stats */}
      <div className="pt-4 border-t border-gray-800">
        <div className="flex justify-between text-sm text-gray-400">
          <div>
            Total: <span className="text-white font-medium">{episodes.length}</span> episode
          </div>
          <div>
            Menampilkan: <span className="text-white font-medium">{displayCount}</span> episode
          </div>
        </div>
      </div>
    </div>
  );
}
