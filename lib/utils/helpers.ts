export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function parseQuality(qualityStr: string): number {
  const match = qualityStr.match(/(\d+)p/);
  return match ? parseInt(match[1]) : 360;
}

export function sortByQuality(sources: Array<{quality: string}>): Array<{quality: string}> {
  return [...sources].sort((a, b) => {
    const qualityA = parseQuality(a.quality);
    const qualityB = parseQuality(b.quality);
    return qualityB - qualityA; // Descending
  });
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  return new Promise((resolve, reject) => {
    const attempt = (retryCount: number) => {
      fn()
        .then(resolve)
        .catch((error) => {
          if (retryCount >= maxRetries) {
            reject(error);
          } else {
            setTimeout(() => attempt(retryCount + 1), delayMs * retryCount);
          }
        });
    };
    attempt(0);
  });
}

export function extractEpisodeNumber(url: string): number {
  const match = url.match(/episode-(\d+)/i) || url.match(/(\d+)$/);
  return match ? parseInt(match[1]) : 1;
}
