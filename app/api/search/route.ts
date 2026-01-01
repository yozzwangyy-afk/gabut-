import { NextRequest, NextResponse } from 'next/server';
import { scraper } from '@/lib/scraper/kurama';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    
    if (!query.trim()) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }

    const result = await scraper.search(query, page);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
