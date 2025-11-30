import express from 'express';
import {
  exportJSON,
  exportHabitsCSV,
  exportTasksCSV,
  exportCompletionsCSV,
  getExportSummary
} from '../controllers/exportController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/summary', getExportSummary);
router.get('/json', exportJSON);
router.get('/habits-csv', exportHabitsCSV);
router.get('/tasks-csv', exportTasksCSV);
router.get('/completions-csv', exportCompletionsCSV);

export default router;
