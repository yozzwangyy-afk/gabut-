interface CacheItem {
  data: any;
  expires: number;
  timestamp: number;
}

class MemoryCache {
  private cache: Map<string, CacheItem> = new Map();
  private defaultTTL: number = 300000; // 5 minutes

  set(key: string, data: any, ttl: number = this.defaultTTL): void {
    const expires = Date.now() + ttl;
    this.cache.set(key, {
      data,
      expires,
      timestamp: Date.now()
    });

    // Auto cleanup
    setTimeout(() => {
      if (this.cache.has(key) && this.cache.get(key)!.expires <= Date.now()) {
        this.cache.delete(key);
      }
    }, ttl);
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (item.expires <= Date.now()) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    return this.cache.has(key) && (this.cache.get(key)!.expires > Date.now());
  }

  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      memoryUsage: process.memoryUsage().heapUsed
    };
  }
}

export const cache = new MemoryCache();
