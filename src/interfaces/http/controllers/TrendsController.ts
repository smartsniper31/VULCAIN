import { Request, Response } from 'express';
// Importez vos services/modèles ici

export class TrendsController {
  
  static async getTrends(req: Request, res: Response) {
    try {
      console.log('📥 Request received: GET /api/trends');
      
      // Simulation de récupération de données (remplacez par votre appel DB)
      // const trends = await TrendModel.find().sort({ searchVolume: -1 });
      
      // Si la DB est vide ou lente, on ne laisse pas le frontend attendre
      const trends: any[] = []; // Remplacer par vos vraies données

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
     // Même logique de try/catch ici...
     res.status(501).json({ message: "Not implemented yet" });
  }
}