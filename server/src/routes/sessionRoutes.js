import express from 'express';
import {
  getTodaySession,
  autosaveSession,
  publishSession,
  getSessionHistory,
  getSessionByDate,
  deleteSession
} from '../controllers/sessionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Today's session routes
router.get('/today', getTodaySession);
router.put('/today/autosave', autosaveSession);
router.post('/today/publish', publishSession);

// History and specific sessions
router.get('/history', getSessionHistory);
router.get('/:date', getSessionByDate);
router.delete('/:date', deleteSession);

export default router;
