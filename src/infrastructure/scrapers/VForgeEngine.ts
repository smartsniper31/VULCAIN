import * as googleTrends from 'google-trends-api';
import * as cron from 'node-cron';
import * as pc from 'picocolors';
import { prisma } from '../database/prisma.provider';

export class VForgeEngine {
  private maxRetries = 3;
  private retryDelay = 10000; // 10 seconds

  private async retryWithBackoff<T>(fn: () => Promise<T>, retries = this.maxRetries): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0) {
        console.log(pc.yellow(`⏳ Retrying in ${this.retryDelay / 1000} seconds... (${retries} retries left)`));
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        this.retryDelay *= 2; // Exponential backoff
        return this.retryWithBackoff(fn, retries - 1);
      }
      throw error;
    }
  }

  async processAndForge(): Promise<void> {
    console.log(pc.blue('🔥 Starting V-Forge Engine cycle...'));

    try {
      // Add delay to appear more human-like
      await new Promise(resolve => setTimeout(resolve, 5000)); // 5 second delay

      // Fetch trending data from Google Trends with enhanced headers and retry logic
      const trendsData = await this.retryWithBackoff(async () => {
        return await googleTrends.dailyTrends({
          trendDate: new Date(),
          geo: process.env.GEO_LOCATION || 'FR', // Make geo configurable
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
      });

      const parsedData = JSON.parse(trendsData);

      if (!parsedData.default?.trendingSearchesDays?.[0]?.trendingSearches) {
        console.log(pc.yellow('⚠️ No trending data available'));
        return;
      }

      const trendingSearches = parsedData.default.trendingSearchesDays[0].trendingSearches;

      for (const trend of trendingSearches.slice(0, 10)) { // Limit to top 10
        const title = trend.title.query;
        const searchVolume = parseInt(trend.formattedTraffic) || 0;
        const growthRate = Math.random() * 500; // Mock growth rate for demo
        const isHot = growthRate > 200;

        // Generate slug
        const slug = title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();

        // Upsert trend
        await prisma.trend.upsert({
          where: { slug },
          update: {
            searchVolume,
            growthRate,
            isHot,
            metadata: {
              lastUpdated: new Date().toISOString(),
              source: 'google-trends',
            },
          },
          create: {
            slug,
            title,
            description: trend.snippet || `Trending topic: ${title}`,
            searchVolume,
            growthRate,
            sourceUrl: trend.image?.newsUrl || `https://trends.google.com/trends/trendingsearches/daily?geo=${process.env.GEO_LOCATION || 'FR'}#${encodeURIComponent(title)}`,
            category: trend.shareUrl?.split('/')[3] || 'general',
            isHot,
            metadata: {
              created: new Date().toISOString(),
              source: 'google-trends',
            },
          },
        });

        console.log(pc.green(`✅ Forged trend: ${title} (Hot: ${isHot})`));
      }

      console.log(pc.green('🔥 V-Forge Engine cycle completed successfully!'));
    } catch (error: any) {
      console.error(pc.red('❌ V-Forge Engine error:'), {
        message: error.message,
        stack: error.stack,
        code: error.code,
        errno: error.errno,
        syscall: error.syscall
      });
      // In production, you might want to send this to a logging service
    } finally {
      await prisma.$disconnect();
    }
  }

  startAutomatedForge(): void {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.log(pc.yellow('⚠️ DATABASE_URL not set. V-Forge Engine will not start automated scraping.'));
      return;
    }

    // Run every 15 minutes
    cron.schedule('*/15 * * * *', () => {
      this.processAndForge();
    });

    console.log(pc.cyan('⏰ V-Forge Engine automated every 15 minutes'));
  }

  async manualForge(): Promise<void> {
    await this.processAndForge();
  }
}
