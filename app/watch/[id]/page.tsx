'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import VideoPlayer from '@/components/player/VideoPlayer';
import EpisodeSelector from '@/components/player/EpisodeSelector';
import DownloadPanel from '@/components/player/DownloadPanel';
import Loading from '@/components/ui/Loading';

interface EpisodeData {
  id: string;
  title: string;
  animeTitle: string;
  episodeNumber: string;
  videoSources: Array<{
    quality: string;
    url: string;
    proxyUrl?: string;
    type: 'hls' | 'mp4' | 'iframe';
  }>;
  downloads: any[];
  episodeList: any[];
  nextEpisode?: string;
  prevEpisode?: string;
}

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const [episodeData, setEpisodeData] = useState<EpisodeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const episodeId = params.id as string;

  useEffect(() => {
    const loadEpisode = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Construct episode URL
        const episodeUrl = `https://v8.kuramanime.tel/episode/${episodeId}`;
        
        // Fetch episode data
        const response = await fetch(`/api/video?url=${encodeURIComponent(episodeUrl)}`);
        
        if (!response.ok) {
          throw new Error(`Failed to load episode: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Unknown error');
        }
        
        setEpisodeData(result.data);
      } catch (err: any) {
        console.error('Error loading episode:', err);
        setError(err.message || 'Gagal memuat episode');
      } finally {
        setLoading(false);
      }
    };

    if (episodeId) {
      loadEpisode();
    }
  }, [episodeId]);

  const navigateToEpisode = (episodeUrl: string) => {
    const episodeId = episodeUrl.split('/').pop();
    if (episodeId) {
      router.push(`/watch/${episodeId}`);
    }
  };

  if (loading) {
    return <Loading message="Memuat pemutar video..." />;
  }

  if (error || !episodeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-red-900/30 border border-red-700 rounded-xl p-8 text-center">
            <div className="text-6xl mb-4">😢</div>
            <h1 className="text-2xl font-bold mb-2">Episode Tidak Ditemukan</h1>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Navigation */}
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center text-sm text-gray-400 mb-6">
          <button 
            onClick={() => router.push('/')}
            className="hover:text-white transition"
          >
            Beranda
          </button>
          <span className="mx-2">›</span>
          <span className="text-white">{episodeData.animeTitle}</span>
          <span className="mx-2">›</span>
          <span className="text-purple-300">Episode {episodeData.episodeNumber}</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {episodeData.animeTitle}
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Episode {episodeData.episodeNumber}
        </p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Video Player - 3/4 width */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800/30 rounded-2xl overflow-hidden border border-gray-700/50">
              <VideoPlayer
                videoSources={episodeData.videoSources}
                title={`${episodeData.animeTitle} - Episode ${episodeData.episodeNumber}`}
                autoPlay={true}
              />
              
              {/* Episode Navigation */}
              <div className="p-6 bg-gray-800/20 border-t border-gray-700/30">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => episodeData.prevEpisode && navigateToEpisode(episodeData.prevEpisode)}
                    disabled={!episodeData.prevEpisode}
                    className={`px-6 py-3 rounded-lg flex items-center gap-2 ${
                      episodeData.prevEpisode 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-gray-800 cursor-not-allowed'
                    }`}
                  >
                    ← Episode Sebelumnya
                  </button>
                  
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Sekarang Streaming</div>
                    <div className="text-xl font-bold">Episode {episodeData.episodeNumber}</div>
                  </div>
                  
                  <button
                    onClick={() => episodeData.nextEpisode && navigateToEpisode(episodeData.nextEpisode)}
                    disabled={!episodeData.nextEpisode}
                    className={`px-6 py-3 rounded-lg flex items-center gap-2 ${
                      episodeData.nextEpisode 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-gray-800 cursor-not-allowed'
                    }`}
                  >
                    Episode Selanjutnya →
                  </button>
                </div>
              </div>
              
              {/* Download Panel */}
              {episodeData.downloads.length > 0 && (
                <div className="p-6 border-t border-gray-700/30">
                  <DownloadPanel downloads={episodeData.downloads} />
                </div>
              )}
            </div>
            
            {/* Episode Description */}
            <div className="mt-8 bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
              <h2 className="text-2xl font-bold mb-4">Tentang Episode</h2>
              <p className="text-gray-300">
                Nikmati streaming anime berkualitas tinggi secara gratis dan anonim. 
                Video ini diputar menggunakan teknologi HLS streaming dengan multi-quality 
                support. Jika mengalami masalah, coba ganti kualitas atau gunakan browser 
                yang berbeda.
              </p>
            </div>
          </div>
          
          {/* Sidebar - Episode List */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-gray-800/30 rounded-2xl border border-gray-700/50 overflow-hidden">
                <div className="p-4 bg-gray-800/50 border-b border-gray-700/30">
                  <h3 className="text-xl font-bold">Daftar Episode</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Pilih episode lainnya
                  </p>
                </div>
                
                <div className="max-h-[600px] overflow-y-auto">
                  <EpisodeSelector
                    episodes={episodeData.episodeList}
                    currentEpisode={episodeId}
                    onSelect={(episodeUrl) => navigateToEpisode(episodeUrl)}
                  />
                </div>
              </div>
              
              {/* Player Tips */}
              <div className="mt-6 bg-purple-900/20 border border-purple-700/30 rounded-2xl p-6">
                <h4 className="font-bold text-lg mb-3">💡 Tips Player</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Gunakan tombol <strong>F</strong> untuk fullscreen</li>
                  <li>• Gunakan <strong>Spasi</strong> untuk play/pause</li>
                  <li>• Gunakan <strong>← →</strong> untuk seek 10 detik</li>
                  <li>• Gunakan <strong>↑ ↓</strong> untuk mengatur volume</li>
                  <li>• Klik 2x untuk fullscreen</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
