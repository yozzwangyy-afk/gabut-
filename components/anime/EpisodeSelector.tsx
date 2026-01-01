'use client';

import { Episode } from '@/lib/types';

interface EpisodeSelectorProps {
  episodes: Episode[];
  currentEpisode: string;
  onSelect: (episodeUrl: string) => void;
}

export default function EpisodeSelector({ 
  episodes, 
  currentEpisode,
  onSelect 
}: EpisodeSelectorProps) {
  const getEpisodeNumber = (episode: Episode): number => {
    return episode.episodeNumber || parseInt(episode.id.toString()) || 0;
  };

  const sortedEpisodes = [...episodes].sort((a, b) => 
    getEpisodeNumber(b) - getEpisodeNumber(a)
  );

  const handleEpisodeClick = (episode: Episode) => {
    onSelect(episode.url);
  };

  return (
    <div className="space-y-1">
      {sortedEpisodes.map((episode) => {
        const epNumber = getEpisodeNumber(episode);
        const isCurrent = currentEpisode === episode.slug || 
                         currentEpisode === episode.id.toString();
        
        return (
          <button
            key={episode.id}
            onClick={() => handleEpisodeClick(episode)}
            className={`
              w-full p-3 rounded-lg text-left transition-all duration-200
              hover:bg-gray-700/50 hover:pl-4
              ${isCurrent
                ? 'bg-purple-900/30 border-l-4 border-purple-500 pl-4'
                : 'bg-transparent pl-3'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`
                  w-8 h-8 rounded flex items-center justify-center text-sm font-bold
                  ${isCurrent
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-800 text-gray-300'
                  }
                `}>
                  {epNumber}
                </div>
                <div>
                  <div className="font-medium text-white">
                    Episode {epNumber}
                  </div>
                  {episode.title && (
                    <div className="text-xs text-gray-400 truncate max-w-[180px]">
                      {episode.title}
                    </div>
                  )}
                </div>
              </div>
              
              {isCurrent && (
                <div className="text-purple-400 animate-pulse">
                  ▶
                </div>
              )}
            </div>
          </button>
        );
      })}
      
      {episodes.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          Daftar episode belum tersedia
        </div>
      )}
    </div>
  );
}
