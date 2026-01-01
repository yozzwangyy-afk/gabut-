import axios from 'axios';

interface ProxyOptions {
  headers?: Record<string, string>;
  timeout?: number;
  maxRetries?: number;
}

export class VideoProxy {
  private static instance: VideoProxy;
  private axiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      timeout: 15000,
      maxRedirects: 5,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      }
    });
  }

  static getInstance(): VideoProxy {
    if (!VideoProxy.instance) {
      VideoProxy.instance = new VideoProxy();
    }
    return VideoProxy.instance;
  }

  async fetchVideo(url: string, options: ProxyOptions = {}): Promise<{
    success: boolean;
    data?: Buffer;
    headers?: Record<string, string>;
    error?: string;
  }> {
    const maxRetries = options.maxRetries || 3;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Proxy attempt ${attempt} for: ${url.substring(0, 100)}...`);
        
        const response = await this.axiosInstance.get(url, {
          responseType: 'arraybuffer',
          headers: {
            'Referer': 'https://v8.kuramanime.tel/',
            'Origin': 'https://v8.kuramanime.tel',
            ...options.headers
          },
          timeout: options.timeout || 15000,
          validateStatus: (status) => status === 200
        });

        const contentType = response.headers['content-type'] || 'application/octet-stream';
        
        return {
          success: true,
          data: response.data,
          headers: {
            'Content-Type': contentType,
            'Content-Length': response.headers['content-length'],
            'Cache-Control': 'public, max-age=3600',
            'Access-Control-Allow-Origin': '*',
          }
        };
      } catch (error: any) {
        console.error(`Proxy attempt ${attempt} failed:`, error.message);
        
        if (attempt === maxRetries) {
          return {
            success: false,
            error: `Failed to fetch video after ${maxRetries} attempts: ${error.message}`
          };
        }
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    
    return {
      success: false,
      error: 'Unknown error'
    };
  }

  async processM3U8(playlistUrl: string): Promise<string> {
    try {
      const response = await this.axiosInstance.get(playlistUrl, {
        headers: {
          'Referer': 'https://v8.kuramanime.tel/',
          'Origin': 'https://v8.kuramanime.tel'
        }
      });

      const playlist = response.data as string;
      
      // Process relative URLs
      const baseUrl = new URL(playlistUrl);
      const processedPlaylist = playlist.replace(
        /(https?:\/\/[^\s]+|\.\.?\/[^\s]+)/g,
        (match: string) => {
          if (match.startsWith('http')) {
            return `/api/proxy?url=${encodeURIComponent(match)}`;
          } else {
            const absoluteUrl = new URL(match, baseUrl).toString();
            return `/api/proxy?url=${encodeURIComponent(absoluteUrl)}`;
          }
        }
      );

      return processedPlaylist;
    } catch (error) {
      console.error('M3U8 processing error:', error);
      throw error;
    }
  }

  getProxyUrl(originalUrl: string): string {
    return `/api/proxy?url=${encodeURIComponent(originalUrl)}`;
  }
}

export const videoProxy = VideoProxy.getInstance();
