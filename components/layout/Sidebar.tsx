'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  {
    title: 'NAVIGASI',
    items: [
      { icon: '🏠', label: 'Beranda', href: '/' },
      { icon: '🔥', label: 'Sedang Tayang', href: '/ongoing' },
      { icon: '🆕', label: 'Terbaru', href: '/latest' },
      { icon: '🏆', label: 'Populer', href: '/popular' },
      { icon: '📅', label: 'Jadwal', href: '/schedule' },
      { icon: '🎭', label: 'Genre', href: '/genres' },
    ],
  },
  {
    title: 'KOLEKSI SAYA',
    items: [
      { icon: '❤️', label: 'Favorit', href: '/favorites' },
      { icon: '📑', label: 'Bookmark', href: '/bookmarks' },
      { icon: '⏳', label: 'History', href: '/history' },
      { icon: '⏬', label: 'Download', href: '/downloads' },
    ],
  },
  {
    title: 'KATEGORI',
    items: [
      { icon: '🎬', label: 'Movie', href: '/category/movie' },
      { icon: '📺', label: 'TV Series', href: '/category/tv' },
      { icon: '🏁', label: 'Selesai', href: '/category/completed' },
      { icon: '🔄', label: 'Ongoing', href: '/category/ongoing' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState([0, 1, 2]);

  const toggleSection = (index: number) => {
    setExpandedSections(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <aside className="h-full bg-gray-900/50 border-r border-gray-800/30">
      <div className="p-6 border-b border-gray-800/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">A</span>
          </div>
          <div>
            <h2 className="text-lg font-bold">ANONIME</h2>
            <p className="text-xs text-gray-400">Menu Navigasi</p>
          </div>
        </div>
      </div>
      
      <div className="overflow-y-auto h-[calc(100vh-140px)] scrollbar-hide">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="border-b border-gray-800/30">
            <button
              onClick={() => toggleSection(sectionIndex)}
              className="w-full px-6 py-3 flex items-center justify-between hover:bg-gray-800/30 transition"
            >
              <span className="text-sm font-bold text-gray-400">{section.title}</span>
              <span className="text-gray-500">
                {expandedSections.includes(sectionIndex) ? '▼' : '▶'}
              </span>
            </button>
            
            {expandedSections.includes(sectionIndex) && (
              <div className="pb-2">
                {section.items.map((item, itemIndex) => (
                  <Link
                    key={itemIndex}
                    href={item.href}
                    className={`flex items-center space-x-3 px-6 py-2 mx-2 rounded-lg transition ${
                      pathname === item.href
                        ? 'bg-purple-600/20 text-purple-300'
                        : 'hover:bg-gray-800/30 text-gray-300'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {/* Quick Stats */}
        <div className="p-6">
          <h3 className="text-sm font-bold text-gray-400 mb-3">STATS CEPAT</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Online Users</span>
              <span className="text-green-400 font-bold">1.2K</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Total Anime</span>
              <span className="text-blue-400 font-bold">10K+</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Server Status</span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-green-400">Online</span>
              </span>
            </div>
          </div>
        </div>
        
        {/* Advertisement Slot */}
        <div className="p-4 mx-4 mb-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl border border-purple-800/30">
          <div className="text-center">
            <div className="text-2xl mb-2">⚡</div>
            <h4 className="font-bold text-sm mb-1">Premium Features</h4>
            <p className="text-xs text-gray-400">No Ads, HD Quality</p>
            <button className="mt-3 w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-sm font-medium hover:opacity-90 transition">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
