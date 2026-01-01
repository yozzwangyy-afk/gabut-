import Image from 'next/image';
import Link from 'next/link';

interface Anime {
  id: string;
  slug: string;
  title: string;
  poster: string;
  rating?: string;
  type?: string;
  total_episode?: string;
  url: string;
  status?: string;
  duration?: string;
}

interface AnimeCardProps {
  anime: Anime;
  showType?: boolean;
  showEpisode?: boolean;
  showRating?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function AnimeCard({ 
  anime, 
  showType = true,
  showEpisode = true,
  showRating = true,
  size = 'md'
}: AnimeCardProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-36';
      case 'lg': return 'w-56';
      default: return 'w-48';
    }
  };

  const getTitleSize = () => {
    switch (size) {
      case 'sm': return 'text-sm';
      case 'lg': return 'text-base';
      default: return 'text-sm';
    }
  };

  const slug = anime.url.split('/').pop() || anime.slug;

  return (
    <Link href={`/anime/${slug}`} className="block">
      <div className={`group relative overflow-hidden rounded-xl bg-gray-800 hover:bg-gray-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 ${getSizeClasses()}`}>
        {/* Poster Container */}
        <div className="aspect-[3/4] relative overflow-hidden">
          <Image
            src={anime.poster || '/placeholder.jpg'}
            alt={anime.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
            unoptimized
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Top Badges */}
          <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
            {showRating && anime.rating && (
              <div className="bg-purple-600/90 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
                ⭐ {anime.rating}
              </div>
            )}
            
            {showType && anime.type && (
              <div className="bg-gray-900/90 text-white text-xs px-2 py-1 rounded">
                {anime.type}
              </div>
            )}
          </div>
          
          {/* Bottom Episode Badge */}
          {showEpisode && anime.total_episode && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
              EP {anime.total_episode}
            </div>
          )}
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-purple-600/80 hover:bg-purple-500/90 w-12 h-12 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <span className="text-white text-xl">▶</span>
            </div>
          </div>
        </div>
        
        {/* Anime Info */}
        <div className="p-3">
          <h3 className={`font-semibold line-clamp-2 mb-1 group-hover:text-purple-300 transition-colors ${getTitleSize()}`}>
            {anime.title}
          </h3>
          
          {/* Additional Info */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="truncate">
              {anime.status || 'Ongoing'}
            </span>
            {anime.duration && (
              <span>{anime.duration}</span>
            )}
          </div>
        </div>
        
        {/* Hover Border Effect */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-500/50 rounded-xl transition-all duration-300 pointer-events-none" />
      </div>
    </Link>
  );
}
