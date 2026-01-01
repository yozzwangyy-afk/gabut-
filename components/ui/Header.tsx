'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import SearchBar from './SearchBar';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Beranda', path: '/' },
    { name: 'Sedang Tayang', path: '/ongoing' },
    { name: 'Terbaru', path: '/latest' },
    { name: 'Populer', path: '/popular' },
    { name: 'Jadwal', path: '/schedule' },
    { name: 'Genre', path: '/genres' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gray-900/95 backdrop-blur-lg border-b border-gray-800/50'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                ANONIME
              </h1>
              <p className="text-xs text-gray-400">Streaming Anonim</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-4 py-2 rounded-lg transition ${
                  pathname === item.path
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search and Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="w-64">
              <SearchBar compact />
            </div>
            <button
              onClick={() => router.push('/search')}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
              title="Pencarian Lanjutan"
            >
              🔍
            </button>
            <button
              onClick={() => router.push('/bookmarks')}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
              title="Bookmark"
            >
              📑
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 bg-gray-800 rounded-lg"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <span className={`block h-0.5 bg-white transition-transform ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`block h-0.5 bg-white transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 bg-white transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-slide-up">
            <div className="mb-4">
              <SearchBar />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`p-3 rounded-lg text-center transition ${
                    pathname === item.path
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="flex justify-center space-x-4 mt-4 pt-4 border-t border-gray-800">
              <button
                onClick={() => {
                  router.push('/bookmarks');
                  setIsMenuOpen(false);
                }}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
              >
                📑 Bookmark
              </button>
              <button
                onClick={() => {
                  router.push('/history');
                  setIsMenuOpen(false);
                }}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
              >
                ⏳ History
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
