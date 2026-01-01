import CryptoJS from 'crypto-js';

interface VideoSource {
  quality: string;
  url: string;
  type: 'hls' | 'mp4' | 'iframe';
}

export async function decryptVideoUrl(scriptContent: string): Promise<VideoSource[]> {
  try {
    // Pattern 1: Base64 encoded URLs
    const base64Pattern = /['"]([A-Za-z0-9+/=]+)['"]/g;
    const matches = scriptContent.match(base64Pattern);
    
    if (matches) {
      for (const match of matches) {
        const cleanMatch = match.replace(/['"]/g, '');
        if (cleanMatch.length > 50) { // Likely a video URL
          try {
            const decoded = Buffer.from(cleanMatch, 'base64').toString('utf-8');
            
            // Look for m3u8 or mp4 URLs
            const urlMatch = decoded.match(/https?[^"']+\.(m3u8|mp4)[^"']*/);
            if (urlMatch) {
              return [{
                quality: 'auto',
                url: urlMatch[0],
                type: urlMatch[1] === 'm3u8' ? 'hls' : 'mp4'
              }];
            }
          } catch (e) {
            continue;
          }
        }
      }
    }

    // Pattern 2: eval decryption
    if (scriptContent.includes('eval')) {
      // Extract encrypted string
      const encryptedMatch = scriptContent.match(/eval\(.*?atob\(['"]([^'"]+)['"]\)/);
      if (encryptedMatch) {
        const encrypted = encryptedMatch[1];
        const decoded = Buffer.from(encrypted, 'base64').toString('utf-8');
        
        // Look for video URLs
        const videoRegex = /(https?:\/\/[^\s"'<>]+\.(m3u8|mp4))/g;
        const videoMatches = decoded.match(videoRegex);
        
        if (videoMatches) {
          return videoMatches.map(url => ({
            quality: url.includes('360') ? '360p' : 
                    url.includes('480') ? '480p' : 
                    url.includes('720') ? '720p' : 
                    url.includes('1080') ? '1080p' : 'auto',
            url,
            type: url.includes('.m3u8') ? 'hls' : 'mp4'
          }));
        }
      }
    }

    // Pattern 3: Direct player.src assignment
    const playerSrcMatch = scriptContent.match(/player\.src\s*=\s*['"]([^'"]+)['"]/);
    if (playerSrcMatch) {
      return [{
        quality: 'auto',
        url: playerSrcMatch[1],
        type: playerSrcMatch[1].includes('.m3u8') ? 'hls' : 'mp4'
      }];
    }

    return [];
  } catch (error) {
    console.error('Decryption error:', error);
    return [];
  }
}
