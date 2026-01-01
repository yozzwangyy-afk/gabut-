export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900/50 border-t border-gray-800/50 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  ANONIME
                </h2>
                <p className="text-xs text-gray-400">Streaming Anonim</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Platform streaming anime gratis dengan privasi terjamin. 
              Tanpa iklan pop-up, tanpa tracking.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Navigasi</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-white transition">Beranda</a></li>
              <li><a href="/ongoing" className="text-gray-400 hover:text-white transition">Sedang Tayang</a></li>
              <li><a href="/latest" className="text-gray-400 hover:text-white transition">Terbaru</a></li>
              <li><a href="/popular" className="text-gray-400 hover:text-white transition">Populer</a></li>
              <li><a href="/schedule" className="text-gray-400 hover:text-white transition">Jadwal</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Kategori</h3>
            <ul className="space-y-2">
              <li><a href="/genre/action" className="text-gray-400 hover:text-white transition">Action</a></li>
              <li><a href="/genre/adventure" className="text-gray-400 hover:text-white transition">Adventure</a></li>
              <li><a href="/genre/comedy" className="text-gray-400 hover:text-white transition">Comedy</a></li>
              <li><a href="/genre/drama" className="text-gray-400 hover:text-white transition">Drama</a></li>
              <li><a href="/genre/fantasy" className="text-gray-400 hover:text-white transition">Fantasy</a></li>
              <li><a href="/genre/romance" className="text-gray-400 hover:text-white transition">Romance</a></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Informasi</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-400 hover:text-white transition">Tentang Kami</a></li>
              <li><a href="/privacy" className="text-gray-400 hover:text-white transition">Kebijakan Privasi</a></li>
              <li><a href="/dmca" className="text-gray-400 hover:text-white transition">DMCA</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition">Kontak</a></li>
              <li><a href="/sitemap" className="text-gray-400 hover:text-white transition">Sitemap</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800/50 my-8"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            © {currentYear} ANONIME. Semua hak cipta anime milik pemiliknya masing-masing.
          </div>
          <div className="flex items-center space-x-6">
            <span className="text-gray-500 text-sm">Status:</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">Online</span>
            </div>
            <div className="text-gray-500 text-sm">
              Server: 🇮🇩 Indonesia
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-xs">
            ANONIME tidak menyimpan file video apapun di server kami. 
            Semua konten disediakan oleh sumber eksternal non-affiliasi.
            Kami tidak bertanggung jawab atas konten yang ditautkan.
          </p>
        </div>
      </div>
    </footer>
  );
}
