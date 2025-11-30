import express from 'express';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
  toggleSubtask,
  getUpcomingTasks,
  getOverdueTasks,
  getTaskStats
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';
import {
  createTaskValidation,
  updateTaskValidation,
  idValidation,
  validate
} from '../middleware/validator.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Special routes (must be before /:id)
router.get('/stats', getTaskStats);
router.get('/upcoming/:days', getUpcomingTasks);
router.get('/overdue', getOverdueTasks);

// CRUD routes
router.route('/')
  .get(getTasks)
  .post(createTaskValidation, validate, createTask);

router.route('/:id')
  .get(idValidation, validate, getTask)
  .put(updateTaskValidation, validate, updateTask)
  .delete(idValidation, validate, deleteTask);

// Toggle routes
router.post('/:id/toggle', idValidation, validate, toggleTaskStatus);
router.post('/:id/subtasks/:subtaskId/toggle', toggleSubtask);

export default router;
