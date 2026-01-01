import axios from 'axios';
import * as cheerio from 'cheerio';
import { decryptVideoUrl } from './decrypt';

interface AnimeItem {
  id: string;
  slug: string;
  title: string;
  poster: string;
  rating: string;
  type: string;
  total_episode: string;
  url: string;
}

interface VideoSource {
  quality: string;
  url: string;
  type: 'hls' | 'mp4' | 'iframe';
}

interface EpisodeData {
  id: string;
  title: string;
  videoSources: VideoSource[];
  downloads: any[];
  episodeList: any[];
  nextEpisode?: string;
  prevEpisode?: string;
}

class KuramaScraper {
  private baseUrl = 'https://v8.kuramanime.tel';
  private axiosInstance;
  private cache = new Map();

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0',
      }
    });
  }

  async search(query: string, page: number = 1) {
    const cacheKey = `search:${query}:${page}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await this.axiosInstance.get('/anime', {
        params: {
          order_by: 'latest',
          search: query,
          page,
          need_json: true
        }
      });

      const result = {
        success: true,
        data: {
          animes: response.data.animes.data.map((item: any) => ({
            id: item.id,
            slug: item.slug,
            title: item.title,
            poster: item.poster,
            rating: item.rating,
            type: item.type,
            total_episode: item.total_episode,
            url: `${this.baseUrl}/anime/${item.id}/${item.slug}`,
          })),
          pagination: {
            hasNextPage: !!response.data.animes.next_page_url,
            nextPage: response.data.animes.next_page_url?.split('page=')[1] || null,
            currentPage: page
          }
        }
      };

      this.cache.set(cacheKey, result);
      setTimeout(() => this.cache.delete(cacheKey), 300000); // 5 minutes cache

      return result;
    } catch (error) {
      console.error('Search error:', error);
      return {
        success: false,
        error: 'Failed to fetch search results'
      };
    }
  }

  async getAnimeDetail(url: string) {
    const cacheKey = `detail:${url}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await this.axiosInstance.get(url);
      const $ = cheerio.load(response.data);
      
      const detail = {
        title: $('.anime__details__title h3').text().trim(),
        japaneseTitle: $('.anime__details__title span').text().trim(),
        poster: $('.anime__details__pic__mobile').attr('data-setbg') || '',
        rating: $('.anime__details__pic__mobile .ep').text().trim(),
        synopsis: $('#synopsisField').text().trim(),
        genres: [] as string[],
        info: {} as Record<string, any>,
        status: $('.anime__details__widget ul li .row:contains("Status") .col-9').text().trim() || 'Unknown'
      };

      // Parse info panel
      $('.anime__details__widget ul li .row').each((_, element) => {
        const key = $(element).find('.col-3 span').text().replace(':', '').toLowerCase().trim();
        const valueElement = $(element).find('.col-9');
        
        if (valueElement.find('a').length > 0) {
          const values: string[] = [];
          valueElement.find('a').each((_, el) => {
            values.push($(el).text().trim());
          });
          detail.info[key] = values;
        } else {
          detail.info[key] = valueElement.text().trim();
        }
      });

      // Parse genres/tags
      $('#tagSection .breadcrumb__links__v2__tags a').each((_, element) => {
        const genre = $(element).text().trim().replace(',', '');
        if (genre) detail.genres.push(genre);
      });

      // Parse episodes
      const episodes: any[] = [];
      const episodeHtml = $('#episodeLists').attr('data-content') || '';
      const $$ = cheerio.load(episodeHtml);
      
      $$('.btn-danger').each((index, element) => {
        const title = $$(element).text().trim();
        const link = $$(element).attr('href') || '';
        episodes.push({
          id: index + 1,
          title,
          episodeNumber: parseInt(title.replace(/\D/g, '')) || index + 1,
          url: link.startsWith('http') ? link : `${this.baseUrl}${link}`,
          slug: link.split('/').pop(),
          animeSlug: url.split('/').pop()
        });
      });

      // Parse related anime
      const related: any[] = [];
      $('.anime__details__review .breadcrumb__links__v2 div a').each((_, element) => {
        const title = $(element).text().slice(2).trim();
        const url = $(element).attr('href');
        if (title && url) {
          related.push({ title, url });
        }
      });

      const result = {
        success: true,
        data: {
          detail,
          episodes: episodes.reverse(),
          related: related.slice(0, 8),
          id: $('input#animeId').attr('value') || url.split('/').pop()
        }
      };

      this.cache.set(cacheKey, result);
      setTimeout(() => this.cache.delete(cacheKey), 300000);

      return result;
    } catch (error) {
      console.error('Detail error:', error);
      return {
        success: false,
        error: 'Failed to fetch anime details'
      };
    }
  }

  async getEpisodeData(episodeUrl: string): Promise<{success: boolean; data?: EpisodeData; error?: string}> {
    const cacheKey = `episode:${episodeUrl}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      console.log('Fetching episode:', episodeUrl);
      
      const response = await this.axiosInstance.get(episodeUrl, {
        headers: {
          'Referer': this.baseUrl + '/',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        }
      });

      const $ = cheerio.load(response.data);
      
      // Try multiple methods to extract video
      let videoSources: VideoSource[] = [];
      
      // Method 1: Direct source tags
      $('#player source').each((_, element) => {
        const url = $(element).attr('src');
        const quality = $(element).attr('size') || 'auto';
        if (url && (url.includes('.m3u8') || url.includes('.mp4'))) {
          videoSources.push({
            quality,
            url,
            type: url.includes('.m3u8') ? 'hls' : 'mp4'
          });
        }
      });

      // Method 2: Iframe
      const iframeSrc = $('#player iframe').attr('src');
      if (iframeSrc && videoSources.length === 0) {
        videoSources.push({
          quality: 'auto',
          url: iframeSrc,
          type: 'iframe'
        });
      }

      // Method 3: Script decryption
      if (videoSources.length === 0) {
        const scriptContent = $('script').filter(function() {
          return $(this).html()?.includes('eval') || 
                 $(this).html()?.includes('decrypt') ||
                 $(this).html()?.includes('player.src');
        }).html() || '';

        const decrypted = await decryptVideoUrl(scriptContent);
        if (decrypted) {
          videoSources = decrypted;
        }
      }

      // Extract download links
      const downloads: any[] = [];
      $('#animeDownloadLink').find('h6').each((_, element) => {
        const type = $(element).text().trim();
        const links: any[] = [];
        let nextElement = $(element).next();
        
        while (nextElement.length && !nextElement.is('h6')) {
          if (nextElement.is('a')) {
            const url = nextElement.attr('href');
            if (url) {
              links.push({
                name: nextElement.text().trim(),
                url,
                recommended: nextElement.find('i.fa-fire').length > 0
              });
            }
          }
          nextElement = nextElement.next();
        }
        
        if (links.length > 0) {
          downloads.push({ type, links });
        }
      });

      // Extract episode list
      const episodeList: any[] = [];
      $('a.ep-button[type="episode"]').each((_, element) => {
        const url = $(element).attr('href');
        if (url) {
          episodeList.push({
            episode: $(element).text().trim(),
            url: url.startsWith('http') ? url : `${this.baseUrl}${url}`
          });
        }
      });

      // Find next/prev episodes
      const currentEpNum = episodeUrl.match(/episode-(\d+)/)?.[1] || 
                          episodeUrl.split('/').pop()?.match(/\d+/)?.[0];
      
      let nextEpisode: string | undefined;
      let prevEpisode: string | undefined;
      
      if (currentEpNum) {
        const epNum = parseInt(currentEpNum);
        const animeBase = episodeUrl.split('/').slice(0, -1).join('/');
        nextEpisode = `${animeBase}/episode-${epNum + 1}`;
        if (epNum > 1) {
          prevEpisode = `${animeBase}/episode-${epNum - 1}`;
        }
      }

      const result = {
        success: true,
        data: {
          id: $('input#animeId').attr('value') || episodeUrl.split('/').pop() || '',
          title: $('title').text() || 'Episode',
          videoSources,
          downloads,
          episodeList: episodeList.slice(0, 20), // Limit to 20 episodes
          nextEpisode,
          prevEpisode,
          animeTitle: $('.breadcrumb__links__v2 a').last().text() || '',
          episodeNumber: currentEpNum || '1'
        }
      };

      this.cache.set(cacheKey, result);
      setTimeout(() => this.cache.delete(cacheKey), 180000); // 3 minutes cache

      return result;
    } catch (error: any) {
      console.error('Episode error:', error.message);
      return {
        success: false,
        error: `Failed to fetch episode data: ${error.message}`
      };
    }
  }

  async getHomepage() {
    const cacheKey = 'homepage';
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const [ongoingRes, latestRes, popularRes] = await Promise.all([
        this.axiosInstance.get('/', { params: { need_json: true } }),
        this.axiosInstance.get('/anime', { params: { order_by: 'latest', need_json: true } }),
        this.axiosInstance.get('/anime', { params: { order_by: 'popular', need_json: true } })
      ]);

      const result = {
        success: true,
        data: {
          ongoing: ongoingRes.data.ongoingAnimes?.data.slice(0, 12).map((item: any) => ({
            id: item.id,
            title: item.title,
            poster: item.poster,
            rating: item.rating,
            type: item.type,
            url: `${this.baseUrl}/anime/${item.id}/${item.slug}`
          })) || [],
          latest: latestRes.data.animes?.data.slice(0, 12).map((item: any) => ({
            id: item.id,
            title: item.title,
            poster: item.poster,
            rating: item.rating,
            type: item.type,
            url: `${this.baseUrl}/anime/${item.id}/${item.slug}`
          })) || [],
          popular: popularRes.data.animes?.data.slice(0, 12).map((item: any) => ({
            id: item.id,
            title: item.title,
            poster: item.poster,
            rating: item.rating,
            type: item.type,
            url: `${this.baseUrl}/anime/${item.id}/${item.slug}`
          })) || [],
        }
      };

      this.cache.set(cacheKey, result);
      setTimeout(() => this.cache.delete(cacheKey), 300000);

      return result;
    } catch (error) {
      console.error('Homepage error:', error);
      return {
        success: false,
        error: 'Failed to fetch homepage data'
      };
    }
  }

  async getSchedule(day: string = 'all') {
    try {
      const response = await this.axiosInstance.get('/schedule', {
        params: {
          scheduled_day: day,
          need_json: true
        }
      });

      return {
        success: true,
        data: {
          schedule: response.data.animes.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            poster: item.poster,
            time: item.schedule_time,
            episode: item.episode,
            url: `${this.baseUrl}/anime/${item.id}/${item.slug}`
          })),
          day
        }
      };
    } catch (error) {
      console.error('Schedule error:', error);
      return {
        success: false,
        error: 'Failed to fetch schedule'
      };
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

export const scraper = new KuramaScraper();
