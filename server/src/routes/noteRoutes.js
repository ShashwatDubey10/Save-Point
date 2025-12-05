import express from 'express';
import {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  togglePin,
  toggleArchive,
  duplicateNote
} from '../controllers/noteController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// CRUD routes
router.route('/')
  .get(getNotes)
  .post(createNote);

router.route('/:id')
  .get(getNote)
  .put(updateNote)
  .delete(deleteNote);

// Action routes
router.post('/:id/toggle-pin', togglePin);
router.post('/:id/toggle-archive', toggleArchive);
router.post('/:id/duplicate', duplicateNote);

export default router;
