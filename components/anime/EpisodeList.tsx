'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Episode } from '@/lib/types';

interface EpisodeListProps {
  episodes: Episode[];
  animeSlug: string;
  currentEpisode?: string;
  maxDisplay?: number;
}

export default function EpisodeList({ 
  episodes, 
  animeSlug,
  currentEpisode,
  maxDisplay = 50 
}: EpisodeListProps) {
  const [displayCount, setDisplayCount] = useState(maxDisplay
