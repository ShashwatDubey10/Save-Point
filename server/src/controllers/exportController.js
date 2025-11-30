import User from '../models/User.js';
import Habit from '../models/Habit.js';
import Task from '../models/Task.js';
import Session from '../models/Session.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Export all user data as JSON
// @route   GET /api/export/json
// @access  Private
export const exportJSON = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId).select('-password');
  const habits = await Habit.find({ user: userId });
  const tasks = await Task.find({ user: userId });
  const sessions = await Session.find({ user: userId });

  const exportData = {
    exportDate: new Date().toISOString(),
    version: '1.0',
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      gamification: user.gamification,
      profile: user.profile,
      preferences: user.preferences,
      createdAt: user.createdAt
    },
    habits: habits.map(h => ({
      id: h._id,
      title: h.title,
      description: h.description,
      category: h.category,
      frequency: h.frequency,
      schedule: h.schedule,
      color: h.color,
      icon: h.icon,
      completions: h.completions,
      stats: h.stats,
      isActive: h.isActive,
      createdAt: h.createdAt
    })),
    tasks: tasks.map(t => ({
      id: t._id,
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      category: t.category,
      dueDate: t.dueDate,
      estimatedTime: t.estimatedTime,
      subtasks: t.subtasks,
      tags: t.tags,
      color: t.color,
      completedAt: t.completedAt,
      createdAt: t.createdAt
    })),
    sessions: sessions.map(s => ({
      id: s._id,
      date: s.date,
      habits: s.habits,
      notes: s.notes,
      mood: s.mood,
      status: s.status,
      createdAt: s.createdAt
    })),
    statistics: {
      totalHabits: habits.length,
      totalTasks: tasks.length,
      totalCompletions: habits.reduce((sum, h) => sum + h.stats.totalCompletions, 0),
      totalPoints: user.gamification.points,
      level: user.gamification.level,
      badges: user.gamification.badges.length
    }
  };

  res.status(200).json({
    success: true,
    data: exportData
  });
});

// @desc    Export habits as CSV
// @route   GET /api/export/habits-csv
// @access  Private
export const exportHabitsCSV = asyncHandler(async (req, res) => {
  const habits = await Habit.find({ user: req.user.id });

  // Create CSV header
  let csv = 'Title,Category,Frequency,Total Completions,Current Streak,Longest Streak,Created Date,Active\n';

  // Add habit rows
  habits.forEach(habit => {
    csv += `"${habit.title}",`;
    csv += `"${habit.category}",`;
    csv += `"${habit.frequency}",`;
    csv += `${habit.stats.totalCompletions},`;
    csv += `${habit.stats.currentStreak},`;
    csv += `${habit.stats.longestStreak},`;
    csv += `"${habit.createdAt.toISOString()}",`;
    csv += `${habit.isActive}\n`;
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=habits.csv');
  res.status(200).send(csv);
});

// @desc    Export tasks as CSV
// @route   GET /api/export/tasks-csv
// @access  Private
export const exportTasksCSV = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });

  let csv = 'Title,Status,Priority,Category,Due Date,Estimated Time (min),Subtasks,Completed Date,Created Date\n';

  tasks.forEach(task => {
    csv += `"${task.title}",`;
    csv += `"${task.status}",`;
    csv += `"${task.priority}",`;
    csv += `"${task.category}",`;
    csv += `"${task.dueDate ? task.dueDate.toISOString() : ''}",`;
    csv += `${task.estimatedTime || ''},`;
    csv += `${task.subtasks.length},`;
    csv += `"${task.completedAt ? task.completedAt.toISOString() : ''}",`;
    csv += `"${task.createdAt.toISOString()}"\n`;
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=tasks.csv');
  res.status(200).send(csv);
});

// @desc    Export completions history as CSV
// @route   GET /api/export/completions-csv
// @access  Private
export const exportCompletionsCSV = asyncHandler(async (req, res) => {
  const habits = await Habit.find({ user: req.user.id });

  let csv = 'Habit,Date,Note,Mood\n';

  habits.forEach(habit => {
    habit.completions.forEach(completion => {
      csv += `"${habit.title}",`;
      csv += `"${completion.date.toISOString()}",`;
      csv += `"${completion.note || ''}",`;
      csv += `"${completion.mood || ''}"\n`;
    });
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=completions-history.csv');
  res.status(200).send(csv);
});

// @desc    Get export summary
// @route   GET /api/export/summary
// @access  Private
export const getExportSummary = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const habitsCount = await Habit.countDocuments({ user: userId });
  const tasksCount = await Task.countDocuments({ user: userId });
  const sessionsCount = await Session.countDocuments({ user: userId });

  const user = await User.findById(userId);

  const summary = {
    availableExports: [
      {
        type: 'json',
        name: 'Complete Data Export (JSON)',
        description: 'All your data in JSON format',
        endpoint: '/api/export/json',
        includes: ['User profile', 'Habits', 'Tasks', 'Sessions', 'Statistics']
      },
      {
        type: 'csv',
        name: 'Habits Export (CSV)',
        description: 'Your habits in CSV format',
        endpoint: '/api/export/habits-csv',
        recordCount: habitsCount
      },
      {
        type: 'csv',
        name: 'Tasks Export (CSV)',
        description: 'Your tasks in CSV format',
        endpoint: '/api/export/tasks-csv',
        recordCount: tasksCount
      },
      {
        type: 'csv',
        name: 'Completions History (CSV)',
        description: 'All habit completions',
        endpoint: '/api/export/completions-csv'
      }
    ],
    dataSize: {
      habits: habitsCount,
      tasks: tasksCount,
      sessions: sessionsCount,
      badges: user.gamification.badges.length
    }
  };

  res.status(200).json({
    success: true,
    data: summary
  });
});
