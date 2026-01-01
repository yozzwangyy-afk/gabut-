import axios from 'axios';
import * as cheerio from 'cheerio';

class KuramaScraper {
  private baseUrl = 'https://v8.kuramanime.tel';
  private targetEnv = 'data-kk';
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
      }
    });
  }

  async search(query: string, page: number = 1) {
    try {
      const response = await this.axiosInstance.get('/anime', {
        params: {
          order_by: 'latest',
          search: query,
          page,
          need_json: true
        }
      });

      return {
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
    } catch (error) {
      console.error('Search error:', error);
      return {
        success: false,
        error: 'Failed to fetch search results'
      };
    }
  }

  async getAnimeDetail(url: string) {
    try {
      const response = await this.axiosInstance.get(url);
      const $ = cheerio.load(response.data);
      
      // Parse detail anime
      const detail = {
        title: $('.anime__details__title h3').text().trim(),
        japaneseTitle: $('.anime__details__title span').text().trim(),
        poster: $('.anime__details__pic__mobile').attr('data-setbg') || '',
        rating: $('.anime__details__pic__mobile .ep').text().trim(),
        synopsis: $('#synopsisField').text().trim(),
        genres: [] as string[],
        info: {} as Record<string, any>
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
        detail.genres.push($(element).text().trim().replace(',', ''));
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
          slug: link.split('/').pop()
        });
      });

      // Parse related anime
      const related: any[] = [];
      $('.anime__details__review .breadcrumb__links__v2 div a').each((_, element) => {
        related.push({
          title: $(element).text().slice(2).trim(),
          url: $(element).attr('href')
        });
      });

      return {
        success: true,
        data: {
          detail,
          episodes: episodes.reverse(),
          related,
          id: $('input#animeId').attr('value')
        }
      };
    } catch (error) {
      console.error('Detail error:', error);
      return {
        success: false,
        error: 'Failed to fetch anime details'
      };
    }
  }

  async getEpisodeData(url: string) {
    try {
      const response = await this.axiosInstance.get(url);
      const $ = cheerio.load(response.data);
      
      // Extract video sources
      const videoSources: any[] = [];
      $('#player source').each((_, element) => {
        videoSources.push({
          quality: $(element).attr('size') || 'auto',
          url: $(element).attr('src') || ''
        });
      });

      // Extract download links
      const downloads: any[] = [];
      $('#animeDownloadLink').find('h6').each((_, element) => {
        const type = $(element).text().trim();
        const links: any[] = [];
        let nextElement = $(element).next();
        
        while (nextElement.length && !nextElement.is('h6')) {
          if (nextElement.is('a')) {
            links.push({
              name: nextElement.text().trim(),
              url: nextElement.attr('href'),
              recommended: nextElement.find('i.fa-fire').length > 0
            });
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
        episodeList.push({
          episode: $(element).text().trim(),
          url: $(element).attr('href')
        });
      });

      return {
        success: true,
        data: {
          id: $('input#animeId').attr('value'),
          title: $('title').text(),
          episodeList,
          videoSources,
          downloads,
          batchLink: $('a.ep-button[type="batch"]').attr('href') || null
        }
      };
    } catch (error) {
      console.error('Episode error:', error);
      return {
        success: false,
        error: 'Failed to fetch episode data'
      };
    }
  }

  async getSchedule(day: string = 'all', page: number = 1) {
    try {
      const response = await this.axiosInstance.get('/schedule', {
        params: {
          scheduled_day: day,
          page,
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
          pagination: {
            hasNextPage: !!response.data.animes.next_page_url,
            nextPage: response.data.animes.next_page_url?.split('page=')[1] || null
          }
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

  async getHomepage() {
    try {
      const [ongoing, latest, popular] = await Promise.all([
        this.axiosInstance.get('/', { params: { need_json: true } }),
        this.axiosInstance.get('/anime', { params: { order_by: 'latest', need_json: true } }),
        this.axiosInstance.get('/anime', { params: { order_by: 'popular', need_json: true } })
      ]);

      return {
        success: true,
        data: {
          ongoing: ongoing.data.ongoingAnimes?.data.slice(0, 12) || [],
          latest: latest.data.animes?.data.slice(0, 12) || [],
          popular: popular.data.animes?.data.slice(0, 12) || []
        }
      };
    } catch (error) {
      console.error('Homepage error:', error);
      return {
        success: false,
        error: 'Failed to fetch homepage data'
      };
    }
  }
}

export const scraper = new KuramaScraper();
