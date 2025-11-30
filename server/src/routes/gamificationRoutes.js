import express from 'express';
import {
  getUserStats,
  getAchievements,
  getUserBadges,
  getLeaderboard,
  getLevelProgress
} from '../controllers/gamificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/stats', getUserStats);
router.get('/achievements', getAchievements);
router.get('/badges', getUserBadges);
router.get('/leaderboard', getLeaderboard);
router.get('/progress', getLevelProgress);

export default router;
