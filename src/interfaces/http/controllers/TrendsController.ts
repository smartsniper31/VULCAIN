import { Request, Response } from 'express';
import { prisma } from '../../../infrastructure/database/prisma.provider';

export class TrendsController {
  
  static async getTrends(req: Request, res: Response) {
    try {
      console.log('📥 Request received: GET /api/trends');
      
      // Récupération des tendances depuis la base de données
      const trends = await prisma.trend.findMany({
        orderBy: [
          { isHot: 'desc' },
          { searchVolume: 'desc' },
          { createdAt: 'desc' }
        ],
        take: 50 // Limiter à 50 tendances pour les performances
      });

      console.log(`✅ Sending ${trends.length} trends to client.`);
      
      return res.status(200).json({
        status: 'success',
        data: trends,
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      // C'est ICI que vous sauvez la situation
      console.error('❌ ERROR in TrendsController.getTrends:', error);
      
      // On répond TOUJOURS au client, même en cas d'erreur
      return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
        debug_error: error.message // Utile pour le débug, à retirer en prod
      });
    }
  }

  static async getTrendBySlug(req: Request, res: Response) {
    // Même logique de try/catch ici...
    res.status(501).json({ message: "Not implemented yet" });
  }

  static async syncTrends(req: Request, res: Response) {
    try {
      console.log('📥 Request received: POST /api/trends/sync');

      // Importer VForgeEngine pour déclencher manuellement
      const { VForgeEngine } = await import('../../../infrastructure/scrapers/VForgeEngine');
      const forgeEngine = new VForgeEngine();

      // Lancer la forge manuellement
      await forgeEngine.manualForge();

      console.log('✅ Manual sync completed.');

      return res.status(200).json({
        status: 'success',
        message: 'Trends synchronized successfully',
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      console.error('❌ ERROR in TrendsController.syncTrends:', error);

      return res.status(500).json({
        status: 'error',
        message: 'Failed to sync trends',
        debug_error: error.message
      });
    }
  }
}