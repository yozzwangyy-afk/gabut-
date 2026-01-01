'use client';

interface QualitySelectorProps {
  sources: Array<{
    quality: string;
    url: string;
    type: 'hls' | 'mp4' | 'iframe';
  }>;
  selected: any;
  onChange: (source: any) => void;
}

export default function QualitySelector({ sources, selected, onChange }: QualitySelectorProps) {
  if (sources.length <= 1) return null;
  
  return (
    <div className="relative">
      <select
        value={selected.quality}
        onChange={(e) => {
          const source = sources.find(s => s.quality === e.target.value);
          if (source) onChange(source);
        }}
        className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg appearance-none cursor-pointer pr-8"
      >
        {sources.map((source, index) => (
          <option key={index} value={source.quality}>
            {source.quality === 'auto' ? 'Auto' : `${source.quality}p`}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
