import Habit from '../models/Habit.js';
import Task from '../models/Task.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Global search across habits and tasks
// @route   GET /api/search
// @access  Private
export const globalSearch = asyncHandler(async (req, res) => {
  const { q, type, category, limit = 20 } = req.query;

  if (!q || q.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }

  const searchRegex = new RegExp(q, 'i');
  const results = {
    habits: [],
    tasks: []
  };

  // Search habits
  if (!type || type === 'habits') {
    const habitFilter = {
      user: req.user.id,
      $or: [
        { title: searchRegex },
        { description: searchRegex }
      ]
    };

    if (category) {
      habitFilter.category = category;
    }

    results.habits = await Habit.find(habitFilter)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
  }

  // Search tasks
  if (!type || type === 'tasks') {
    const taskFilter = {
      user: req.user.id,
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { tags: searchRegex }
      ]
    };

    if (category) {
      taskFilter.category = category;
    }

    results.tasks = await Task.find(taskFilter)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
  }

  const totalResults = results.habits.length + results.tasks.length;

  res.status(200).json({
    success: true,
    query: q,
    totalResults,
    data: results
  });
});

// @desc    Search habits only
// @route   GET /api/search/habits
// @access  Private
export const searchHabits = asyncHandler(async (req, res) => {
  const { q, category, isActive, limit = 20 } = req.query;

  if (!q || q.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }

  const searchRegex = new RegExp(q, 'i');
  const filter = {
    user: req.user.id,
    $or: [
      { title: searchRegex },
      { description: searchRegex }
    ]
  };

  if (category) {
    filter.category = category;
  }

  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  }

  const habits = await Habit.find(filter)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    query: q,
    count: habits.length,
    data: habits
  });
});

// @desc    Search tasks only
// @route   GET /api/search/tasks
// @access  Private
export const searchTasks = asyncHandler(async (req, res) => {
  const { q, category, status, priority, limit = 20 } = req.query;

  if (!q || q.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }

  const searchRegex = new RegExp(q, 'i');
  const filter = {
    user: req.user.id,
    $or: [
      { title: searchRegex },
      { description: searchRegex },
      { tags: searchRegex }
    ]
  };

  if (category) {
    filter.category = category;
  }

  if (status) {
    filter.status = status;
  }

  if (priority) {
    filter.priority = priority;
  }

  const tasks = await Task.find(filter)
    .limit(parseInt(limit))
    .sort({ dueDate: 1, createdAt: -1 });

  res.status(200).json({
    success: true,
    query: q,
    count: tasks.length,
    data: tasks
  });
});

// @desc    Get search suggestions
// @route   GET /api/search/suggestions
// @access  Private
export const getSearchSuggestions = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length < 2) {
    return res.status(200).json({
      success: true,
      data: []
    });
  }

  const searchRegex = new RegExp('^' + q, 'i'); // Match from start

  // Get habit titles
  const habitTitles = await Habit.find({
    user: req.user.id,
    title: searchRegex
  })
    .select('title icon category')
    .limit(5);

  // Get task titles
  const taskTitles = await Task.find({
    user: req.user.id,
    title: searchRegex
  })
    .select('title priority category')
    .limit(5);

  // Get unique tags from tasks
  const tasks = await Task.find({
    user: req.user.id,
    tags: searchRegex
  })
    .select('tags')
    .limit(10);

  const uniqueTags = [...new Set(
    tasks.flatMap(t => t.tags.filter(tag =>
      tag.toLowerCase().startsWith(q.toLowerCase())
    ))
  )].slice(0, 5);

  const suggestions = [
    ...habitTitles.map(h => ({
      type: 'habit',
      text: h.title,
      icon: h.icon,
      category: h.category
    })),
    ...taskTitles.map(t => ({
      type: 'task',
      text: t.title,
      priority: t.priority,
      category: t.category
    })),
    ...uniqueTags.map(tag => ({
      type: 'tag',
      text: tag
    }))
  ];

  res.status(200).json({
    success: true,
    count: suggestions.length,
    data: suggestions
  });
});
