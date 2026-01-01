'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import QualitySelector from './QualitySelector';

interface VideoPlayerProps {
  videoSources: Array<{
    quality: string;
    url: string;
    proxyUrl?: string;
    type: 'hls' | 'mp4' | 'iframe';
  }>;
  poster?: string;
  title?: string;
  autoPlay?: boolean;
}

export default function VideoPlayer({ 
  videoSources, 
  poster, 
  title = 'Anonime Player',
  autoPlay = true 
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [error, setError] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [selectedSource, setSelectedSource] = useState(videoSources[0]);
  const [buffering, setBuffering] = useState(false);

  // Initialize player
  useEffect(() => {
    if (!videoRef.current || !selectedSource) return;

    const video = videoRef.current;
    let hls: Hls | null = null;

    const initializePlayer = () => {
      // Clear previous HLS instance
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      const videoUrl = selectedSource.proxyUrl || selectedSource.url;

      if (selectedSource.type === 'hls' && Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
          maxBufferLength: 30,
          maxMaxBufferLength: 600,
          maxBufferSize: 60 * 1000 * 1000,
          maxBufferHole: 0.5,
          maxFragLookUpTolerance: 0.25,
          liveSyncDurationCount: 3,
          liveMaxLatencyDurationCount: 10,
          manifestLoadingTimeOut: 10000,
          manifestLoadingMaxRetry: 6,
          manifestLoadingRetryDelay: 1000,
          manifestLoadingMaxRetryTimeout: 64000,
          levelLoadingTimeOut: 10000,
          levelLoadingMaxRetry: 6,
          levelLoadingRetryDelay: 1000,
          levelLoadingMaxRetryTimeout: 64000,
          fragLoadingTimeOut: 20000,
          fragLoadingMaxRetry: 6,
          fragLoadingRetryDelay: 1000,
          fragLoadingMaxRetryTimeout: 64000,
          xhrSetup: (xhr) => {
            xhr.setRequestHeader('Referer', 'https://v8.kuramanime.tel/');
            xhr.setRequestHeader('Origin', 'https://v8.kuramanime.tel');
          }
        });

        hls.loadSource(videoUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('HLS manifest parsed successfully');
          if (autoPlay) {
            video.play().catch(e => console.log('Auto-play prevented:', e));
          }
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS error:', data.type, data.details);
          
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log('Network error, trying to recover...');
                hls?.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('Media error, recovering...');
                hls?.recoverMediaError();
                break;
              default:
                setError(`Playback error: ${data.details}`);
                hls?.destroy();
                break;
            }
          }
        });

        hls.on(Hls.Events.BUFFER_CREATED, () => {
          setBuffering(false);
        });

        hls.on(Hls.Events.BUFFER_APPENDING, () => {
          setBuffering(true);
        });

        hlsRef.current = hls;

      } else if (selectedSource.type === 'mp4' || 
                 (selectedSource.type === 'hls' && video.canPlayType('application/vnd.apple.mpegurl'))) {
        // Native HLS (Safari) or MP4
        video.src = videoUrl;
        video.load();
        
        if (autoPlay) {
          video.play().catch(e => console.log('Auto-play prevented:', e));
        }
      } else {
        setError('Format video tidak didukung oleh browser Anda');
      }
    };

    initializePlayer();

    // Event listeners
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handleVolumeChange = () => setVolume(video.volume);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setBuffering(true);
    const handlePlaying = () => setBuffering(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('volumechange', handleVolumeChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);

    // Fullscreen change listener
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Auto-hide controls
    let controlsTimeout: NodeJS.Timeout;
    const resetControlsTimeout = () => {
      clearTimeout(controlsTimeout);
      setShowControls(true);
      controlsTimeout = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 3000);
    };

    resetControlsTimeout();
    video.addEventListener('mousemove', resetControlsTimeout);
    video.addEventListener('touchstart', resetControlsTimeout);

    // Cleanup
    return () => {
      clearTimeout(controlsTimeout);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('volumechange', handleVolumeChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('mousemove', resetControlsTimeout);
      video.removeEventListener('touchstart', resetControlsTimeout);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [selectedSource, autoPlay]);

  // Player controls
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const seek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    if (!document.fullscreenElement) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className="aspect-video bg-black rounded-xl flex flex-col items-center justify-center p-8">
        <div className="text-red-500 text-4xl mb-4">❌</div>
        <div className="text-white text-xl mb-4">{error}</div>
        <div className="text-gray-400 text-sm mb-6">
          Coba gunakan browser lain atau periksa koneksi internet Anda
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold"
        >
          Muat Ulang Player
        </button>
      </div>
    );
  }

  return (
    <div className={`relative bg-black rounded-xl overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full aspect-video outline-none"
        poster={poster}
        playsInline
        preload="metadata"
        onClick={togglePlay}
      />
      
      {/* Buffering Indicator */}
      {buffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-2"></div>
            <div className="text-sm">Memuat video...</div>
          </div>
        </div>
      )}
      
      {/* Custom Controls Overlay */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent 
          transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
          <div className="text-white font-semibold truncate">
            {title}
          </div>
          <div className="flex items-center gap-4">
            <QualitySelector 
              sources={videoSources}
              selected={selectedSource}
              onChange={setSelectedSource}
            />
            <button 
              onClick={toggleFullscreen}
              className="text-white hover:text-purple-300 transition"
            >
              {isFullscreen ? '⤢' : '⤡'}
            </button>
          </div>
        </div>
        
        {/* Center Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className={`bg-black/50 hover:bg-black/70 rounded-full p-4 transition-transform 
              ${isPlaying ? 'scale-90' : 'scale-100'}`}
          >
            <div className="text-white text-4xl">
              {isPlaying ? '⏸️' : '▶️'}
            </div>
          </button>
        </div>
        
        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Progress Bar */}
          <div className="mb-3">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seek(parseFloat(e.target.value))}
              className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          
          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={togglePlay}
                className="text-white hover:text-purple-300"
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.volume = Math.max(0, volume - 0.1);
                    }
                  }}
                  className="text-white hover:text-purple-300"
                >
                  🔉
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => {
                    const newVolume = parseFloat(e.target.value);
                    setVolume(newVolume);
                    if (videoRef.current) {
                      videoRef.current.volume = newVolume;
                    }
                  }}
                  className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
                />
                <button 
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.volume = Math.min(1, volume + 0.1);
                    }
                  }}
                  className="text-white hover:text-purple-300"
                >
                  🔊
                </button>
              </div>
              
              <div className="text-white text-sm">
                {selectedSource.quality}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="text-white hover:text-purple-300">
                ⚙️
              </button>
              <button 
                onClick={toggleFullscreen}
                className="text-white hover:text-purple-300"
              >
                {isFullscreen ? '⤢' : '⤡'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">❌</div>
            <div className="text-white text-xl mb-4">{error}</div>
            <button 
              onClick={() => window.location.reload()}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
