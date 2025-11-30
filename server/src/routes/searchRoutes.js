import express from 'express';
import {
  globalSearch,
  searchHabits,
  searchTasks,
  getSearchSuggestions
} from '../controllers/searchController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', globalSearch);
router.get('/habits', searchHabits);
router.get('/tasks', searchTasks);
router.get('/suggestions', getSearchSuggestions);

export default router;
