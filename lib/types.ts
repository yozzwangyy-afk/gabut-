export interface Anime {
  id: string;
  slug: string;
  title: string;
  poster: string;
  rating: string;
  type: string;
  total_episode: string;
  url: string;
  synopsis?: string;
  genres?: string[];
  status?: string;
  duration?: string;
  studio?: string;
  season?: string;
}

export interface Episode {
  id: string;
  title: string;
  episodeNumber: number;
  url: string;
  slug: string;
  animeSlug?: string;
}

export interface VideoSource {
  quality: string;
  url: string;
  proxyUrl?: string;
  type: 'hls' | 'mp4' | 'iframe';
}

export interface DownloadLink {
  name: string;
  url: string;
  recommended?: boolean;
}

export interface DownloadGroup {
  type: string;
  links: DownloadLink[];
}

export interface EpisodeData {
  id: string;
  title: string;
  animeTitle: string;
  episodeNumber: string;
  videoSources: VideoSource[];
  downloads: DownloadGroup[];
  episodeList: Episode[];
  nextEpisode?: string;
  prevEpisode?: string;
}

export interface SearchResult {
  animes: Anime[];
  pagination: {
    hasNextPage: boolean;
    nextPage: string | null;
    currentPage: number;
  };
}

export interface ScheduleItem {
  id: string;
  title: string;
  poster: string;
  time: string;
  episode: string;
  url: string;
}

export interface HomepageData {
  ongoing: Anime[];
  latest: Anime[];
  popular: Anime[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
