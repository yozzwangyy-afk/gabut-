'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { SearchResult, Anime } from '@/lib/types';

interface SearchBarProps {
  compact?: boolean;
  defaultValue?: string;
}

export default function SearchBar({ compact = false, defaultValue = '' }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const [results, setResults] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Perform search
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}&page=1`);
        const data: SearchResult = await response.json();
        
        if (data.animes) {
          setResults(data.animes.slice(0, 8)); // Limit to 8 results
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowResults(false);
    }
  };

  const handleResultClick = (anime: Anime) => {
    const slug = anime.url.split('/').pop();
    if (slug) {
      router.push(`/anime/${slug}`);
      setQuery('');
      setShowResults(false);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => query.trim() && setShowResults(true)}
          placeholder="Cari anime..."
          className={`w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${
            compact ? 'py-2 px-4 text-sm' : 'py-3 px-6 text-base'
          }`}
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            '🔍'
          )}
        </button>
      </form>

      {/* Search Results Dropdown */}
      {showResults && (query.trim() || results.length > 0) && (
        <div className="absolute top-full mt-2 w-full bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto animate-fade-in">
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="inline-block w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-400">Mencari...</p>
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="p-3 border-b border-gray-800">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-300">
                    Hasil pencarian ({results.length})
                  </span>
                  <button
                    onClick={() => {
                      router.push(`/search?q=${encodeURIComponent(query)}`);
                      setShowResults(false);
                    }}
                    className="text-xs text-purple-400 hover:text-purple-300"
                  >
                    Lihat semua →
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-800/50">
                {results.map((anime) => (
                  <button
                    key={anime.id}
                    onClick={() => handleResultClick(anime)}
                    className="w-full p-4 text-left hover:bg-gray-800/50 transition flex items-center space-x-4"
                  >
                    <div className="flex-shrink-0 w-12 h-16 bg-gray-700 rounded overflow-hidden">
                      <img
                        src={anime.poster}
                        alt={anime.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate">{anime.title}</h3>
                      <div className="flex items-center space-x-3 mt-1 text-sm text-gray-400">
                        <span className="bg-gray-800 px-2 py-0.5 rounded">
                          {anime.type}
                        </span>
                        <span>⭐ {anime.rating}</span>
                        {anime.total_episode && (
                          <span>EP {anime.total_episode}</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : query.trim() && !isLoading ? (
            <div className="p-6 text-center">
              <div className="text-4xl mb-2">😕</div>
              <p className="text-gray-300">Tidak ditemukan anime "{query}"</p>
              <p className="text-sm text-gray-500 mt-1">
                Coba kata kunci lain atau periksa ejaan
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
