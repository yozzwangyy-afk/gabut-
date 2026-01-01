import { NextRequest, NextResponse } from 'next/server';
import { scraper } from '@/lib/scraper/kurama';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const fullUrl = `https://v8.kuramanime.tel/anime/${slug}`;
    
    const result = await scraper.getAnimeDetail(fullUrl);
    
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
    console.error('Anime API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
