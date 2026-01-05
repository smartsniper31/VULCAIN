import { Router } from 'express';
import { TrendsController } from '../controllers/TrendsController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// GET /api/trends - Return list of trends with Trend Scoring (sort by searchVolume and isHot)
router.get('/trends', TrendsController.getTrends);

// GET /api/trends/:slug - Return full details of a trend
router.get('/trends/:slug', TrendsController.getTrendBySlug);

// POST /api/trends/sync - (ADMIN only) Trigger VForgeEngine manually
router.post('/trends/sync', authMiddleware, TrendsController.syncTrends);

export default router;
