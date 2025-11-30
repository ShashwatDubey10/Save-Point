import { body, param, query, validationResult } from 'express-validator';

// Middleware to check validation results
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Auth validation rules
export const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores and hyphens'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

export const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Habit validation rules
export const createHabitValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Habit title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('category')
    .optional()
    .isIn(['health', 'fitness', 'productivity', 'mindfulness', 'learning', 'social', 'creative', 'other'])
    .withMessage('Invalid category'),
  body('frequency')
    .optional()
    .isIn(['daily', 'weekly', 'custom'])
    .withMessage('Invalid frequency')
];

export const updateHabitValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid habit ID'),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Habit title cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('category')
    .optional()
    .isIn(['health', 'fitness', 'productivity', 'mindfulness', 'learning', 'social', 'creative', 'other'])
    .withMessage('Invalid category')
];

// Task validation rules
export const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority'),
  body('category')
    .optional()
    .isIn(['work', 'personal', 'health', 'learning', 'shopping', 'other'])
    .withMessage('Invalid category'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid due date format')
];

export const updateTaskValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid task ID'),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Task title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'completed'])
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority')
];

// ID validation
export const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format')
];
