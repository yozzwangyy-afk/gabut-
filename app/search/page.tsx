'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import AnimeGrid from '@/components/anime/AnimeGrid';
import Loading from '@/components/ui/Loading';
import SearchBar from '@/components/ui/SearchBar';
import { Anime } from '@/lib/types';

interface SearchResult {
  animes: Anime[];
  pagination: {
    hasNextPage: boolean;
    nextPage: string | null;
    currentPage: number;
  };
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const page = searchParams.get('page') || '1';
  
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&page=${page}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setResults(data.data);
        } else {
          setError(data.error || 'Failed to fetch results');
        }
      } catch (err: any) {
        console.error('Search error:', err);
        setError(err.message || 'Terjadi kesalahan saat mencari');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, page]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Header */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">🔍 Cari Anime</h1>
          <p className="text-gray-400 mb-8">
            Temukan anime favorit Anda dari koleksi ribuan judul
          </p>
          
          <div className="mb-8">
            <SearchBar defaultValue={query} />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 pb-12">
        {loading ? (
          <Loading message="Mencari anime..." />
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😢</div>
            <h2 className="text-2xl font-bold mb-2">Gagal Memuat Hasil</h2>
            <p className="text-gray-400">{error}</p>
          </div>
        ) : results ? (
          <>
            {/* Results Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold">
                  Hasil Pencarian: "{query}"
                </h2>
                <p className="text-gray-400">
                  Ditemukan {results.animes.length} anime
                </p>
              </div>
              
              <div className="text-sm text-gray-400">
                Halaman {results.pagination.currentPage}
              </div>
            </div>

            {/* Results Grid */}
            {results.animes.length > 0 ? (
              <>
                <AnimeGrid animeList={results.animes} />
                
                {/* Pagination */}
                {results.pagination.hasNextPage && (
                  <div className="text-center mt-12">
                    <a
                      href={`/search?q=${encodeURIComponent(query)}&page=${results.pagination.nextPage}`}
                      className="inline-block px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition"
                    >
                      Muat Lebih Banyak
                    </a>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold mb-2">Tidak Ditemukan</h3>
                <p className="text-gray-400 mb-6">
                  Tidak ada anime yang cocok dengan "{query}"
                </p>
                <div className="text-sm text-gray-500">
                  Coba kata kunci lain atau periksa ejaan
                </div>
              </div>
            )}
          </>
        ) : !query ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">👋</div>
            <h3 className="text-2xl font-bold mb-2">Mulai Pencarian Anda</h3>
            <p className="text-gray-400">
              Masukkan judul anime di atas untuk memulai pencarian
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
