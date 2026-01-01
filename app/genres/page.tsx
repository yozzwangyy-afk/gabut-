import Link from 'next/link';

const genres = [
  { name: 'Action', count: 1250, color: 'from-red-500 to-orange-500' },
  { name: 'Adventure', count: 980, color: 'from-green-500 to-emerald-500' },
  { name: 'Comedy', count: 1560, color: 'from-yellow-500 to-amber-500' },
  { name: 'Drama', count: 1120, color: 'from-purple-500 to-pink-500' },
  { name: 'Fantasy', count: 1340, color: 'from-blue-500 to-cyan-500' },
  { name: 'Romance', count: 890, color: 'from-pink-500 to-rose-500' },
  { name: 'Sci-Fi', count: 760, color: 'from-indigo-500 to-violet-500' },
  { name: 'Slice of Life', count: 540, color: 'from-teal-500 to-green-500' },
  { name: 'Supernatural', count: 670, color: 'from-purple-500 to-indigo-500' },
  { name: 'Mystery', count: 430, color: 'from-gray-600 to-gray-800' },
  { name: 'Horror', count: 320, color: 'from-red-700 to-red-900' },
  { name: 'Sports', count: 280, color: 'from-blue-600 to-blue-800' },
  { name: 'Mecha', count: 190, color: 'from-gray-700 to-gray-900' },
  { name: 'Music', count: 150, color: 'from-yellow-600 to-orange-600' },
  { name: 'Ecchi', count: 410, color: 'from-pink-600 to-red-600' },
  { name: 'Harem', count: 370, color: 'from-rose-500 to-pink-500' },
];

export default function GenresPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">🎭 Genre Anime</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Jelajahi anime berdasarkan genre favorit Anda. Setiap genre memiliki koleksi unik yang siap Anda tonton.
          </p>
        </div>

        {/* Genres Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {genres.map((genre) => (
            <Link
              key={genre.name}
              href={`/genre/${genre.name.toLowerCase()}`}
              className="group relative overflow-hidden rounded-xl aspect-square"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
              
              {/* Pattern Overlay */}
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full pattern-dots pattern-gray-400 pattern-size-2 pattern-opacity-100" />
              </div>
              
              {/* Content */}
              <div className="relative h-full p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">{genre.name}</h3>
                  <div className="text-sm opacity-80">
                    {genre.count.toLocaleString()} anime
                  </div>
                </div>
                
                {/* Hover Icon */}
                <div className="self-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-lg">▶</span>
                  </div>
                </div>
              </div>
              
              {/* Hover Effect */}
              <div className="absolute inset-0 border-2 border-white/20 group-hover:border-white/40 rounded-xl transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* Popular Tags */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">🔖 Tag Populer</h2>
          <div className="flex flex-wrap gap-3">
            {[
              'Isekai', 'School', 'Magic', 'Military', 'Vampire', 'Samurai',
              'Demons', 'Game', 'Time Travel', 'Super Power', 'Martial Arts',
              'Psychological', 'Historical', 'Space', 'Police', 'Cars',
              'Dementia', 'Kids', 'Shoujo', 'Shounen', 'Seinen', 'Josei'
            ].map((tag) => (
              <a
                key={tag}
                href={`/tag/${tag.toLowerCase()}`}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
              >
                {tag}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
