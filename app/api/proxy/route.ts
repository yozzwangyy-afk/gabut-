import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const videoUrl = searchParams.get('url');
    
    if (!videoUrl) {
      return new Response('URL parameter is required', { status: 400 });
    }

    // Decode URL
    const decodedUrl = decodeURIComponent(videoUrl);
    
    // Fetch video with proper headers
    const videoResponse = await fetch(decodedUrl, {
      headers: {
        'Referer': 'https://v8.kuramanime.tel/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://v8.kuramanime.tel',
        'Sec-Fetch-Dest': 'video',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
      }
    });

    if (!videoResponse.ok) {
      throw new Error(`Failed to fetch video: ${videoResponse.status}`);
    }

    // Get content type
    const contentType = videoResponse.headers.get('content-type') || 'video/mp4';
    
    // Create headers for response
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Cache-Control', 'public, max-age=3600');
    headers.set('Access-Control-Allow-Origin', '*');
    
    // If it's an HLS stream, we need to proxy the segments too
    if (contentType.includes('application/vnd.apple.mpegurl') || 
        contentType.includes('application/x-mpegurl')) {
      const m3u8Content = await videoResponse.text();
      
      // Rewrite URLs in m3u8 to go through our proxy
      const proxiedContent = m3u8Content.replace(
        /(https?:\/\/[^\s]+)/g, 
        (match) => `/api/proxy?url=${encodeURIComponent(match)}`
      );
      
      return new Response(proxiedContent, { headers });
    }

    // For direct video files, stream the response
    const videoStream = videoResponse.body;
    if (!videoStream) {
      throw new Error('No video stream available');
    }

    return new Response(videoStream, { headers });
  } catch (error: any) {
    console.error('Proxy error:', error);
    return new Response(`Proxy error: ${error.message}`, { status: 500 });
  }
}

export const runtime = 'edge';
