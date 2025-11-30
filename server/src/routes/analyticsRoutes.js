import express from 'express';
import {
  getDashboardOverview,
  getHeatmapData,
  getHabitTrends,
  getCategoryBreakdown,
  getWeeklySummary,
  getMonthlySummary,
  getPersonalRecords
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/dashboard', getDashboardOverview);
router.get('/heatmap', getHeatmapData);
router.get('/trends', getHabitTrends);
router.get('/categories', getCategoryBreakdown);
router.get('/weekly', getWeeklySummary);
router.get('/monthly', getMonthlySummary);
router.get('/records', getPersonalRecords);

export default router;
