import Habit from '../models/Habit.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get dashboard overview
// @route   GET /api/analytics/dashboard
// @access  Private
export const getDashboardOverview = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Get user data
  const user = await User.findById(userId);

  // Get all habits
  const habits = await Habit.find({ user: userId, isActive: true });

  // Get all tasks
  const tasks = await Task.find({ user: userId });

  // Calculate today's completion rate
  const completedToday = habits.filter(h => h.isCompletedToday()).length;
  const completionRate = habits.length > 0
    ? Math.round((completedToday / habits.length) * 100)
    : 0;

  // Get active streaks
  const activeStreaks = habits
    .filter(h => h.stats.currentStreak > 0)
    .map(h => ({
      habitId: h._id,
      habitTitle: h.title,
      streak: h.stats.currentStreak,
      icon: h.icon
    }))
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 5);

  // Task statistics
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    overdue: tasks.filter(t => t.dueDate && t.dueDate < new Date() && t.status !== 'completed').length,
    dueToday: tasks.filter(t => {
      if (!t.dueDate || t.status === 'completed') return false;
      const today = new Date();
      const dueDate = new Date(t.dueDate);
      return today.toDateString() === dueDate.toDateString();
    }).length
  };

  // Recent achievements
  const recentBadges = user.gamification.badges
    .sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt))
    .slice(0, 3);

  // Overall stats
  const overview = {
    user: {
      username: user.username,
      level: user.gamification.level,
      points: user.gamification.points,
      streak: user.gamification.streak.current,
      longestStreak: user.gamification.streak.longest,
      totalBadges: user.gamification.badges.length
    },
    habits: {
      total: habits.length,
      completedToday: completedToday,
      completionRate: completionRate,
      totalCompletions: habits.reduce((sum, h) => sum + h.stats.totalCompletions, 0),
      longestStreak: Math.max(...habits.map(h => h.stats.longestStreak), 0)
    },
    tasks: taskStats,
    activeStreaks: activeStreaks,
    recentBadges: recentBadges,
    progress: {
      currentLevel: user.gamification.level,
      pointsInLevel: user.gamification.points - Math.pow(user.gamification.level - 1, 2) * 100,
      pointsForNextLevel: Math.pow(user.gamification.level, 2) * 100 - Math.pow(user.gamification.level - 1, 2) * 100
    }
  };

  res.status(200).json({
    success: true,
    data: overview
  });
});

// @desc    Get habit completion heatmap data
// @route   GET /api/analytics/heatmap
// @access  Private
export const getHeatmapData = asyncHandler(async (req, res) => {
  const { startDate, endDate, habitId } = req.query;

  const filter = { user: req.user.id, isActive: true };
  if (habitId) {
    filter._id = habitId;
  }

  const habits = await Habit.find(filter);

  // Create date range (default: last 365 days)
  const end = endDate ? new Date(endDate) : new Date();
  const start = startDate ? new Date(startDate) : new Date(end.getTime() - 365 * 24 * 60 * 60 * 1000);

  // Build heatmap data
  const heatmapData = {};

  habits.forEach(habit => {
    habit.completions.forEach(completion => {
      const dateStr = completion.date.toISOString().split('T')[0];
      if (new Date(dateStr) >= start && new Date(dateStr) <= end) {
        if (!heatmapData[dateStr]) {
          heatmapData[dateStr] = {
            date: dateStr,
            count: 0,
            habits: []
          };
        }
        heatmapData[dateStr].count++;
        heatmapData[dateStr].habits.push({
          id: habit._id,
          title: habit.title,
          icon: habit.icon,
          note: completion.note,
          mood: completion.mood
        });
      }
    });
  });

  // Convert to array and sort by date
  const heatmapArray = Object.values(heatmapData).sort((a, b) =>
    new Date(a.date) - new Date(b.date)
  );

  res.status(200).json({
    success: true,
    count: heatmapArray.length,
    data: heatmapArray
  });
});

// @desc    Get habit trends over time
// @route   GET /api/analytics/trends
// @access  Private
export const getHabitTrends = asyncHandler(async (req, res) => {
  const { period = '30', habitId } = req.query;
  const days = parseInt(period);

  const filter = { user: req.user.id, isActive: true };
  if (habitId) {
    filter._id = habitId;
  }

  const habits = await Habit.find(filter);

  // Generate date range
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

  // Initialize daily data
  const dailyData = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    dailyData.push({
      date: dateStr,
      completions: 0,
      totalHabits: habits.length,
      completionRate: 0
    });
  }

  // Fill in completion data
  habits.forEach(habit => {
    habit.completions.forEach(completion => {
      const dateStr = completion.date.toISOString().split('T')[0];
      const dayIndex = dailyData.findIndex(d => d.date === dateStr);
      if (dayIndex !== -1) {
        dailyData[dayIndex].completions++;
      }
    });
  });

  // Calculate completion rates
  dailyData.forEach(day => {
    if (day.totalHabits > 0) {
      day.completionRate = Math.round((day.completions / day.totalHabits) * 100);
    }
  });

  res.status(200).json({
    success: true,
    period: days,
    data: dailyData
  });
});

// @desc    Get category breakdown
// @route   GET /api/analytics/categories
// @access  Private
export const getCategoryBreakdown = asyncHandler(async (req, res) => {
  const habits = await Habit.find({ user: req.user.id, isActive: true });
  const tasks = await Task.find({ user: req.user.id });

  // Habit categories
  const habitCategories = {};
  habits.forEach(habit => {
    if (!habitCategories[habit.category]) {
      habitCategories[habit.category] = {
        count: 0,
        completions: 0,
        activeStreaks: 0,
        totalPoints: 0
      };
    }
    habitCategories[habit.category].count++;
    habitCategories[habit.category].completions += habit.stats.totalCompletions;
    if (habit.stats.currentStreak > 0) {
      habitCategories[habit.category].activeStreaks++;
    }
    // Estimate points (10 base points per completion)
    habitCategories[habit.category].totalPoints += habit.stats.totalCompletions * 10;
  });

  // Task categories
  const taskCategories = {};
  tasks.forEach(task => {
    if (!taskCategories[task.category]) {
      taskCategories[task.category] = {
        total: 0,
        completed: 0,
        inProgress: 0,
        todo: 0
      };
    }
    taskCategories[task.category].total++;
    taskCategories[task.category][task.status === 'in-progress' ? 'inProgress' : task.status]++;
  });

  res.status(200).json({
    success: true,
    data: {
      habits: habitCategories,
      tasks: taskCategories
    }
  });
});

// @desc    Get weekly summary
// @route   GET /api/analytics/weekly
// @access  Private
export const getWeeklySummary = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId);

  // Get date range for this week
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  // Get habits and calculate weekly stats
  const habits = await Habit.find({ user: userId, isActive: true });

  let weeklyCompletions = 0;
  let possibleCompletions = habits.length * 7;

  const dailyBreakdown = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    const dayStr = day.toISOString().split('T')[0];

    let dayCompletions = 0;
    habits.forEach(habit => {
      const completed = habit.completions.some(c =>
        c.date.toISOString().split('T')[0] === dayStr
      );
      if (completed) {
        dayCompletions++;
        weeklyCompletions++;
      }
    });

    dailyBreakdown.push({
      date: dayStr,
      dayName: day.toLocaleDateString('en-US', { weekday: 'short' }),
      completions: dayCompletions,
      totalHabits: habits.length,
      completionRate: habits.length > 0 ? Math.round((dayCompletions / habits.length) * 100) : 0
    });
  }

  // Get tasks completed this week
  const tasks = await Task.find({
    user: userId,
    status: 'completed',
    completedAt: { $gte: startOfWeek, $lte: endOfWeek }
  });

  res.status(200).json({
    success: true,
    data: {
      weekStart: startOfWeek,
      weekEnd: endOfWeek,
      habits: {
        totalCompletions: weeklyCompletions,
        possibleCompletions: possibleCompletions,
        completionRate: possibleCompletions > 0
          ? Math.round((weeklyCompletions / possibleCompletions) * 100)
          : 0,
        dailyBreakdown: dailyBreakdown
      },
      tasks: {
        completed: tasks.length,
        details: tasks.map(t => ({
          id: t._id,
          title: t.title,
          priority: t.priority,
          completedAt: t.completedAt
        }))
      },
      user: {
        currentLevel: user.gamification.level,
        currentPoints: user.gamification.points,
        currentStreak: user.gamification.streak.current
      }
    }
  });
});

// @desc    Get monthly summary
// @route   GET /api/analytics/monthly
// @access  Private
export const getMonthlySummary = asyncHandler(async (req, res) => {
  const { month, year } = req.query;
  const userId = req.user.id;

  const targetDate = month && year
    ? new Date(parseInt(year), parseInt(month) - 1, 1)
    : new Date();

  const startOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
  const endOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);

  const habits = await Habit.find({ user: userId, isActive: true });
  const tasks = await Task.find({ user: userId });

  // Calculate monthly completions
  let totalCompletions = 0;
  const daysInMonth = endOfMonth.getDate();
  const dailyData = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth(), day);
    const dateStr = date.toISOString().split('T')[0];

    let dayCompletions = 0;
    habits.forEach(habit => {
      const completed = habit.completions.some(c =>
        c.date.toISOString().split('T')[0] === dateStr
      );
      if (completed) {
        dayCompletions++;
        totalCompletions++;
      }
    });

    dailyData.push({
      date: dateStr,
      day: day,
      completions: dayCompletions
    });
  }

  // Tasks completed this month
  const completedTasks = tasks.filter(t =>
    t.status === 'completed' &&
    t.completedAt >= startOfMonth &&
    t.completedAt <= endOfMonth
  );

  res.status(200).json({
    success: true,
    data: {
      month: startOfMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      habits: {
        totalHabits: habits.length,
        totalCompletions: totalCompletions,
        averagePerDay: Math.round(totalCompletions / daysInMonth * 10) / 10,
        dailyData: dailyData
      },
      tasks: {
        total: tasks.length,
        completed: completedTasks.length,
        completionRate: tasks.length > 0
          ? Math.round((completedTasks.length / tasks.length) * 100)
          : 0
      }
    }
  });
});

// @desc    Get personal best records
// @route   GET /api/analytics/records
// @access  Private
export const getPersonalRecords = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId);
  const habits = await Habit.find({ user: userId });
  const tasks = await Task.find({ user: userId });

  // Find records
  const longestStreakHabit = habits.reduce((max, habit) =>
    habit.stats.longestStreak > (max?.stats.longestStreak || 0) ? habit : max
  , null);

  const mostCompletedHabit = habits.reduce((max, habit) =>
    habit.stats.totalCompletions > (max?.stats.totalCompletions || 0) ? habit : max
  , null);

  const oldestHabit = habits.reduce((oldest, habit) =>
    (!oldest || habit.createdAt < oldest.createdAt) ? habit : oldest
  , null);

  // Calculate best week (most completions in a 7-day period)
  let bestWeek = { count: 0, startDate: null };
  // This is a simplified version - you could implement a sliding window for more accuracy

  res.status(200).json({
    success: true,
    data: {
      longestStreak: {
        value: user.gamification.streak.longest,
        habit: longestStreakHabit ? {
          id: longestStreakHabit._id,
          title: longestStreakHabit.title,
          icon: longestStreakHabit.icon,
          streak: longestStreakHabit.stats.longestStreak
        } : null
      },
      mostCompleted: mostCompletedHabit ? {
        id: mostCompletedHabit._id,
        title: mostCompletedHabit.title,
        icon: mostCompletedHabit.icon,
        completions: mostCompletedHabit.stats.totalCompletions
      } : null,
      highestLevel: user.gamification.level,
      totalPoints: user.gamification.points,
      totalBadges: user.gamification.badges.length,
      oldestHabit: oldestHabit ? {
        title: oldestHabit.title,
        createdAt: oldestHabit.createdAt,
        daysActive: Math.floor((new Date() - oldestHabit.createdAt) / (1000 * 60 * 60 * 24))
      } : null,
      totalHabits: habits.length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'completed').length
    }
  });
});
