'use client';

interface DownloadPanelProps {
  downloads: Array<{
    type: string;
    links: Array<{
      name: string;
      url: string;
      recommended?: boolean;
    }>;
  }>;
}

export default function DownloadPanel({ downloads }: DownloadPanelProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="bg-gray-800/20 rounded-xl p-4">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span className="text-purple-400">📥</span> Download Episode
      </h3>
      
      {/* Tab Headers */}
      <div className="flex border-b border-gray-700 mb-4">
        {downloads.map((download, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 font-medium ${
              activeTab === index 
                ? 'text-purple-300 border-b-2 border-purple-500' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {download.type}
          </button>
        ))}
      </div>
      
      {/* Download Links */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {downloads[activeTab]?.links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-3 rounded-lg border transition-all ${
              link.recommended
                ? 'bg-purple-900/20 border-purple-700/50 hover:bg-purple-900/30'
                : 'bg-gray-800/30 border-gray-700/50 hover:bg-gray-800/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{link.name}</span>
              {link.recommended && (
                <span className="text-xs bg-purple-600 px-2 py-1 rounded">🔥</span>
              )}
            </div>
            <div className="text-xs text-gray-400 mt-1">Klik untuk download</div>
          </a>
        ))}
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        * Download disediakan oleh server eksternal
      </div>
    </div>
  );
}
