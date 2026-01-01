import { NextRequest, NextResponse } from 'next/server';
import { scraper } from '@/lib/scraper/kurama';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const episodeUrl = searchParams.get('url');
    
    if (!episodeUrl) {
      return NextResponse.json(
        { error: 'Episode URL is required' },
        { status: 400 }
      );
    }

    // Get episode data
    const episodeData = await scraper.getEpisodeData(episodeUrl);
    
    if (!episodeData.success || !episodeData.data) {
      return NextResponse.json(
        { error: episodeData.error || 'Failed to get episode data' },
        { status: 404 }
      );
    }

    // Process video URLs through proxy
    const processedSources = episodeData.data.videoSources.map(source => {
      if (source.type === 'hls' || source.type === 'mp4') {
        return {
          ...source,
          proxyUrl: `/api/proxy?url=${encodeURIComponent(source.url)}`
        };
      }
      return source;
    });

    return NextResponse.json({
      success: true,
      data: {
        ...episodeData.data,
        videoSources: processedSources
      }
    });
  } catch (error: any) {
    console.error('Video API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
