import { NextRequest, NextResponse } from 'next/server';
import { scraper } from '@/lib/scraper/kurama';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const episodeId = params.id;
    const episodeUrl = `https://v8.kuramanime.tel/episode/${episodeId}`;
    
    const result = await scraper.getEpisodeData(episodeUrl);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data
    });
  } catch (error: any) {
    console.error('Episode API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
