import Task from '../models/Task.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import gamificationService from '../services/gamificationService.js';

// @desc    Get all tasks for logged in user
// @route   GET /api/tasks
// @access  Private
export const getTasks = asyncHandler(async (req, res) => {
  const { status, priority, category, startDate, endDate } = req.query;

  const filter = { user: req.user.id };

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (category) filter.category = category;

  // Date range filter
  if (startDate || endDate) {
    filter.dueDate = {};
    if (startDate) filter.dueDate.$gte = new Date(startDate);
    if (endDate) filter.dueDate.$lte = new Date(endDate);
  }

  const tasks = await Task.find(filter).sort({ dueDate: 1, priority: -1, createdAt: -1 });

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  // Make sure user owns task
  if (task.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this task'
    });
  }

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = asyncHandler(async (req, res) => {
  req.body.user = req.user.id;

  const task = await Task.create(req.body);

  res.status(201).json({
    success: true,
    data: task
  });
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = asyncHandler(async (req, res) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  // Make sure user owns task
  if (task.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this task'
    });
  }

  const previousStatus = task.status;
  const wasCompleted = task.status === 'completed';
  const willBeCompleted = req.body.status === 'completed';
  const willBeInProgress = req.body.status === 'in-progress';

  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  const user = await User.findById(req.user.id);
  const previousLevel = user.gamification.level;
  let pointsResponse = null;

  // Award XP if task was just started (moved to in-progress) - ONLY if not already awarded
  if (previousStatus === 'todo' && willBeInProgress && !task.xpAwarded.start) {
    const startPointsData = gamificationService.calculateTaskStartPoints(task);
    user.addPoints(startPointsData.points);
    await user.save();

    // Mark start XP as awarded
    task.xpAwarded.start = true;
    await task.save();

    const leveledUp = user.gamification.level > previousLevel;

    pointsResponse = {
      earned: startPointsData.points,
      type: 'start',
      priority: startPointsData.priority,
      total: user.gamification.points,
      level: user.gamification.level,
      leveledUp,
      previousLevel
    };
  }

  // Award XP if task was just completed - ONLY if not already awarded
  if (!wasCompleted && willBeCompleted && !task.xpAwarded.completion) {
    const pointsData = gamificationService.calculateTaskPoints(task);

    user.addPoints(pointsData.totalPoints);
    await user.save();

    // Mark completion XP as awarded
    task.xpAwarded.completion = true;
    await task.save();

    const leveledUp = user.gamification.level > previousLevel;

    pointsResponse = {
      earned: pointsData.totalPoints,
      type: 'complete',
      breakdown: {
        base: pointsData.basePoints,
        deadlineModifier: pointsData.deadlineModifier,
        daysEarly: pointsData.daysEarly,
        daysLate: pointsData.daysLate,
        status: pointsData.deadlineStatus
      },
      total: user.gamification.points,
      level: user.gamification.level,
      leveledUp,
      previousLevel
    };
  }

  if (pointsResponse) {
    return res.status(200).json({
      success: true,
      data: task,
      points: pointsResponse
    });
  }

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  // Make sure user owns task
  if (task.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this task'
    });
  }

  await task.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully'
  });
});

// @desc    Toggle task status (todo <-> completed)
// @route   POST /api/tasks/:id/toggle
// @access  Private
export const toggleTaskStatus = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  // Make sure user owns task
  if (task.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this task'
    });
  }

  const previousStatus = task.status;
  const wasCompleted = task.status === 'completed';
  task.toggleStatus();
  await task.save();

  const user = await User.findById(req.user.id);
  const previousLevel = user.gamification.level;
  let pointsResponse = null;

  // Award XP if task was just started (moved to in-progress) - ONLY if not already awarded
  if (previousStatus === 'todo' && task.status === 'in-progress' && !task.xpAwarded.start) {
    const startPointsData = gamificationService.calculateTaskStartPoints(task);
    user.addPoints(startPointsData.points);
    await user.save();

    // Mark start XP as awarded
    task.xpAwarded.start = true;
    await task.save();

    const leveledUp = user.gamification.level > previousLevel;

    pointsResponse = {
      earned: startPointsData.points,
      type: 'start',
      priority: startPointsData.priority,
      total: user.gamification.points,
      level: user.gamification.level,
      leveledUp,
      previousLevel
    };
  }

  // Award XP if task was just completed - ONLY if not already awarded
  if (!wasCompleted && task.status === 'completed' && !task.xpAwarded.completion) {
    const pointsData = gamificationService.calculateTaskPoints(task);

    // Award the calculated XP
    user.addPoints(pointsData.totalPoints);
    await user.save();

    // Mark completion XP as awarded
    task.xpAwarded.completion = true;
    await task.save();

    const leveledUp = user.gamification.level > previousLevel;

    pointsResponse = {
      earned: pointsData.totalPoints,
      type: 'complete',
      breakdown: {
        base: pointsData.basePoints,
        deadlineModifier: pointsData.deadlineModifier,
        daysEarly: pointsData.daysEarly,
        daysLate: pointsData.daysLate,
        status: pointsData.deadlineStatus
      },
      total: user.gamification.points,
      level: user.gamification.level,
      leveledUp,
      previousLevel
    };
  }

  if (pointsResponse) {
    return res.status(200).json({
      success: true,
      data: task,
      points: pointsResponse
    });
  }

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc    Toggle subtask completion
// @route   POST /api/tasks/:id/subtasks/:subtaskId/toggle
// @access  Private
export const toggleSubtask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  // Make sure user owns task
  if (task.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this task'
    });
  }

  const success = task.toggleSubtask(req.params.subtaskId);

  if (!success) {
    return res.status(404).json({
      success: false,
      message: 'Subtask not found'
    });
  }

  await task.save();

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc    Get upcoming tasks
// @route   GET /api/tasks/upcoming/:days
// @access  Private
export const getUpcomingTasks = asyncHandler(async (req, res) => {
  const days = parseInt(req.params.days) || 7;

  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  const tasks = await Task.find({
    user: req.user.id,
    status: { $ne: 'completed' },
    dueDate: {
      $gte: now,
      $lte: futureDate
    }
  }).sort({ dueDate: 1 });

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

// @desc    Get overdue tasks
// @route   GET /api/tasks/overdue
// @access  Private
export const getOverdueTasks = asyncHandler(async (req, res) => {
  const now = new Date();

  const tasks = await Task.find({
    user: req.user.id,
    status: { $ne: 'completed' },
    dueDate: { $lt: now }
  }).sort({ dueDate: 1 });

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

// @desc    Get task statistics
// @route   GET /api/tasks/stats
// @access  Private
export const getTaskStats = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });

  const now = new Date();

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    todo: tasks.filter(t => t.status === 'todo').length,
    overdue: tasks.filter(t => t.dueDate && t.dueDate < now && t.status !== 'completed').length,
    byPriority: {
      urgent: tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length,
      high: tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length,
      medium: tasks.filter(t => t.priority === 'medium' && t.status !== 'completed').length,
      low: tasks.filter(t => t.priority === 'low' && t.status !== 'completed').length
    },
    byCategory: {}
  };

  // Group by category
  tasks.forEach(task => {
    if (!stats.byCategory[task.category]) {
      stats.byCategory[task.category] = {
        total: 0,
        completed: 0
      };
    }
    stats.byCategory[task.category].total++;
    if (task.status === 'completed') {
      stats.byCategory[task.category].completed++;
    }
  });

  res.status(200).json({
    success: true,
    data: stats
  });
});
