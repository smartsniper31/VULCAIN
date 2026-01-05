import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../../infrastructure/database/prisma.provider';
import { VForgeEngine } from '../../../infrastructure/scrapers/VForgeEngine';

const getTrendsQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
  category: z.string().optional(),
  sortBy: z.enum(['searchVolume', 'createdAt', 'isHot']).optional().default('searchVolume'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

const favoriteSchema = z.object({
  id: z.string(),
});

export class TrendsController {
  static async getTrends(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit, category, sortBy, sortOrder } = getTrendsQuerySchema.parse(req.query);

      const skip = (page - 1) * limit;
      const where = category ? { category } : {};

      const trends = await prisma.trend.findMany({
        where,
        select: {
          id: true,
          slug: true,
          title: true,
          description: true,
          searchVolume: true,
          growthRate: true,
          imageUrl: true,
          sourceUrl: true,
          isHot: true,
          category: true,
          createdAt: true,
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      });

      const total = await prisma.trend.count({ where });

      res.json({
        status: 'success',
        timestamp: new Date().toISOString(),
        data: trends,
        meta: { total, page, limit },
      });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Invalid query parameters' });
    }
  }

  static async getTrendBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;

      const trend = await prisma.trend.findUnique({
        where: { slug },
        select: {
          id: true,
          slug: true,
          title: true,
          description: true,
          searchVolume: true,
          growthRate: true,
          imageUrl: true,
          sourceUrl: true,
          isHot: true,
          category: true,
          metadata: true,
          createdAt: true,
        },
      });

      if (!trend) {
        res.status(404).json({ success: false, message: 'Trend not found' });
        return;
      }

      res.json({
        status: 'success',
        timestamp: new Date().toISOString(),
        data: trend,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async favoriteTrend(req: Request, res: Response): Promise<void> {
    try {
      const { id } = favoriteSchema.parse(req.params);
      const userId = req.user!.id;

      const existingFavorite = await prisma.favorite.findUnique({
        where: { userId_trendId: { userId, trendId: id } },
      });

      if (existingFavorite) {
        res.status(400).json({ success: false, message: 'Trend already favorited' });
        return;
      }

      await prisma.favorite.create({
        data: { userId, trendId: id },
      });

      res.json({
        status: 'success',
        timestamp: new Date().toISOString(),
        data: { message: 'Trend favorited successfully' },
      });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Invalid request' });
    }
  }

  static async syncTrends(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user!;
      if (user.role !== 'ADMIN') {
        res.status(403).json({ success: false, message: 'Access denied. Admin role required.' });
        return;
      }

      const forgeEngine = new VForgeEngine();
      await forgeEngine.manualForge();

      res.json({
        status: 'success',
        timestamp: new Date().toISOString(),
        data: { message: 'Trends synchronization completed successfully' },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Synchronization failed' });
    }
  }
}
