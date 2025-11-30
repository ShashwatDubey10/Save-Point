import express from 'express';
import {
  getHabits,
  getHabit,
  createHabit,
  updateHabit,
  deleteHabit,
  completeHabit,
  uncompleteHabit,
  getHabitStats,
  getHabitHistory
} from '../controllers/habitController.js';
import { protect } from '../middleware/auth.js';
import {
  createHabitValidation,
  updateHabitValidation,
  idValidation,
  validate
} from '../middleware/validator.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Stats route (must be before /:id)
router.get('/stats', getHabitStats);

// CRUD routes
router.route('/')
  .get(getHabits)
  .post(createHabitValidation, validate, createHabit);

router.route('/:id')
  .get(idValidation, validate, getHabit)
  .put(updateHabitValidation, validate, updateHabit)
  .delete(idValidation, validate, deleteHabit);

// Completion routes
router.post('/:id/complete', idValidation, validate, completeHabit);
router.post('/:id/uncomplete', idValidation, validate, uncompleteHabit);

// History route
router.get('/:id/history', idValidation, validate, getHabitHistory);

export default router;
