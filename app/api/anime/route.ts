import { NextRequest, NextResponse } from 'next/server';
import { scraper } from '@/lib/scraper/kurama';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'latest';
    const page = parseInt(searchParams.get('page') || '1');
    
    let result;
    
    switch (type) {
      case 'ongoing':
        result = await scraper.getHomepage();
        if (result.success) {
          result.data = { animes: result.data.ongoing };
        }
        break;
      case 'popular':
        result = await scraper.getHomepage();
        if (result.success) {
          result.data = { animes: result.data.popular };
        }
        break;
      case 'latest':
      default:
        result = await scraper.search('', page);
        break;
    }
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data
    });
  } catch (error: any) {
    console.error('Anime List API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
