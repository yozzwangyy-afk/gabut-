import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting store
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 100; // requests per minute

export function middleware(request: NextRequest) {
  const ip = request.ip || '127.0.0.1';
  const now = Date.now();
  
  // Rate limiting
  const requestData = rateLimit.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
  
  if (now > requestData.resetTime) {
    requestData.count = 1;
    requestData.resetTime = now + RATE_LIMIT_WINDOW;
  } else {
    requestData.count++;
  }
  
  rateLimit.set(ip, requestData);
  
  if (requestData.count > RATE_LIMIT_MAX) {
    return new NextResponse(
      JSON.stringify({ 
        success: false, 
        error: 'Rate limit exceeded. Please try again later.' 
      }),
      { 
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': Math.ceil(requestData.resetTime / 1000).toString(),
        }
      }
    );
  }
  
  // Security headers
  const response = NextResponse.next();
  
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // CORS headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  
  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', RATE_LIMIT_MAX.toString());
  response.headers.set('X-RateLimit-Remaining', (RATE_LIMIT_MAX - requestData.count).toString());
  response.headers.set('X-RateLimit-Reset', Math.ceil(requestData.resetTime / 1000).toString());
  
  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
