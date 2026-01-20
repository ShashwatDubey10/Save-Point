import Habit from '../models/Habit.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import gamificationService from '../services/gamificationService.js';

// @desc    Get all habits for logged in user
// @route   GET /api/habits
// @access  Private
export const getHabits = asyncHandler(async (req, res) => {
  const { category, isActive } = req.query;

  const filter = { user: req.user.id };

  if (category) {
    filter.category = category;
  }

  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  }

  const habits = await Habit.find(filter).sort({ order: 1, createdAt: -1 });

  res.status(200).json({
    success: true,
    count: habits.length,
    data: habits
  });
});

// @desc    Get single habit
// @route   GET /api/habits/:id
// @access  Private
export const getHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findById(req.params.id);

  if (!habit) {
    return res.status(404).json({
      success: false,
      message: 'Habit not found'
    });
  }

  // Make sure user owns habit
  if (habit.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this habit'
    });
  }

  res.status(200).json({
    success: true,
    data: habit
  });
});

// @desc    Create new habit
// @route   POST /api/habits
// @access  Private
export const createHabit = asyncHandler(async (req, res) => {
  req.body.user = req.user.id;

  const habit = await Habit.create(req.body);

  // Check for achievements
  const user = await User.findById(req.user.id);
  const newBadges = await gamificationService.checkAchievements(user);

  res.status(201).json({
    success: true,
    data: habit,
    badges: newBadges
  });
});

// @desc    Update habit
// @route   PUT /api/habits/:id
// @access  Private
export const updateHabit = asyncHandler(async (req, res) => {
  let habit = await Habit.findById(req.params.id);

  if (!habit) {
    return res.status(404).json({
      success: false,
      message: 'Habit not found'
    });
  }

  // Make sure user owns habit
  if (habit.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this habit'
    });
  }

  habit = await Habit.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: habit
  });
});

// @desc    Delete habit
// @route   DELETE /api/habits/:id
// @access  Private
export const deleteHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findById(req.params.id);

  if (!habit) {
    return res.status(404).json({
      success: false,
      message: 'Habit not found'
    });
  }

  // Make sure user owns habit
  if (habit.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this habit'
    });
  }

  await habit.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Habit deleted successfully'
  });
});

// @desc    Complete habit for today
// @route   POST /api/habits/:id/complete
// @access  Private
export const completeHabit = asyncHandler(async (req, res) => {
  const { note, mood } = req.body;

  const habit = await Habit.findById(req.params.id);

  if (!habit) {
    return res.status(404).json({
      success: false,
      message: 'Habit not found'
    });
  }

  // Make sure user owns habit
  if (habit.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to complete this habit'
    });
  }

  // Check if already completed
  if (habit.isCompletedToday()) {
    return res.status(400).json({
      success: false,
      message: 'Habit already completed today'
    });
  }

  // Complete habit
  habit.complete(note, mood);
  await habit.save();

  // Award points to user
  const user = await User.findById(req.user.id);
  const points = gamificationService.calculateHabitPoints(habit, habit.stats.currentStreak);
  user.addPoints(points);
  user.updateStreak();
  await user.save();

  // Check for achievements
  const context = {};
  const now = new Date();
  if (now.getHours() < 8) {
    context.earlyBird = true;
  }

  // Check if all habits completed today
  const allHabits = await Habit.find({ user: user._id, isActive: true });
  const allCompleted = allHabits.every(h => h.isCompletedToday());
  if (allCompleted && allHabits.length > 0) {
    context.perfectDay = true;
  }

  const newBadges = await gamificationService.checkAchievements(user, context);

  res.status(200).json({
    success: true,
    data: habit,
    points: {
      earned: points,
      total: user.gamification.points,
      level: user.gamification.level
    },
    badges: newBadges
  });
});

// @desc    Uncomplete habit for today
// @route   POST /api/habits/:id/uncomplete
// @access  Private
export const uncompleteHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findById(req.params.id);

  if (!habit) {
    return res.status(404).json({
      success: false,
      message: 'Habit not found'
    });
  }

  // Make sure user owns habit
  if (habit.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to uncomplete this habit'
    });
  }

  // Check if completed today
  if (!habit.isCompletedToday()) {
    return res.status(400).json({
      success: false,
      message: 'Habit not completed today'
    });
  }

  // Calculate points that were awarded (using current streak before uncompleting)
  const user = await User.findById(req.user.id);
  const pointsToDeduct = gamificationService.calculateHabitPoints(habit, habit.stats.currentStreak);

  // Uncomplete habit
  habit.uncomplete();
  await habit.save();

  // Deduct points from user
  user.gamification.points = Math.max(0, user.gamification.points - pointsToDeduct);
  user.calculateLevel();
  await user.save();

  res.status(200).json({
    success: true,
    data: habit,
    points: {
      deducted: pointsToDeduct,
      total: user.gamification.points,
      level: user.gamification.level
    }
  });
});

// @desc    Complete habit for a specific date
// @route   POST /api/habits/:id/complete-date
// @access  Private
export const completeHabitForDate = asyncHandler(async (req, res) => {
  const { date, note, mood } = req.body;

  if (!date) {
    return res.status(400).json({
      success: false,
      message: 'Date is required'
    });
  }

  const habit = await Habit.findById(req.params.id);

  if (!habit) {
    return res.status(404).json({
      success: false,
      message: 'Habit not found'
    });
  }

  // Make sure user owns habit
  if (habit.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to complete this habit'
    });
  }

  // Complete habit for the specified date
  const success = habit.completeForDate(date, note, mood);
  
  if (!success) {
    return res.status(400).json({
      success: false,
      message: 'Habit already completed for this date or date is invalid'
    });
  }

  await habit.save();

  // Recalculate user stats
  const user = await User.findById(req.user.id);
  user.updateStreak();
  await user.save();

  res.status(200).json({
    success: true,
    data: habit
  });
});

// @desc    Uncomplete habit for a specific date
// @route   POST /api/habits/:id/uncomplete-date
// @access  Private
export const uncompleteHabitForDate = asyncHandler(async (req, res) => {
  const { date } = req.body;

  if (!date) {
    return res.status(400).json({
      success: false,
      message: 'Date is required'
    });
  }

  const habit = await Habit.findById(req.params.id);

  if (!habit) {
    return res.status(404).json({
      success: false,
      message: 'Habit not found'
    });
  }

  // Make sure user owns habit
  if (habit.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to uncomplete this habit'
    });
  }

  // Uncomplete habit for the specified date
  const success = habit.uncompleteForDate(date);
  
  if (!success) {
    return res.status(400).json({
      success: false,
      message: 'Habit not completed for this date'
    });
  }

  await habit.save();

  // Recalculate user stats
  const user = await User.findById(req.user.id);
  user.updateStreak();
  await user.save();

  res.status(200).json({
    success: true,
    data: habit
  });
});

// @desc    Get habit statistics
// @route   GET /api/habits/stats
// @access  Private
export const getHabitStats = asyncHandler(async (req, res) => {
  const habits = await Habit.find({ user: req.user.id, isActive: true });

  const stats = {
    totalHabits: habits.length,
    completedToday: habits.filter(h => h.isCompletedToday()).length,
    totalCompletions: habits.reduce((sum, h) => sum + (h.stats?.totalCompletions || 0), 0),
    averageStreak: habits.length > 0
      ? Math.round(habits.reduce((sum, h) => sum + (h.stats?.currentStreak || 0), 0) / habits.length)
      : 0,
    longestStreak: Math.max(...habits.map(h => h.stats?.longestStreak || 0), 0),
    byCategory: {}
  };

  // Group by category
  habits.forEach(habit => {
    if (!stats.byCategory[habit.category]) {
      stats.byCategory[habit.category] = {
        count: 0,
        completions: 0
      };
    }
    stats.byCategory[habit.category].count++;
    stats.byCategory[habit.category].completions += (habit.stats?.totalCompletions || 0);
  });

  res.status(200).json({
    success: true,
    data: stats
  });
});

// @desc    Get habit completion history
// @route   GET /api/habits/:id/history
// @access  Private
export const getHabitHistory = asyncHandler(async (req, res) => {
  const { startDate, endDate, limit = 30 } = req.query;

  const habit = await Habit.findById(req.params.id);

  if (!habit) {
    return res.status(404).json({
      success: false,
      message: 'Habit not found'
    });
  }

  // Make sure user owns habit
  if (habit.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this habit'
    });
  }

  let completions = habit.completions;

  // Filter by date range
  if (startDate || endDate) {
    completions = completions.filter(c => {
      const date = new Date(c.date);
      if (startDate && date < new Date(startDate)) return false;
      if (endDate && date > new Date(endDate)) return false;
      return true;
    });
  }

  // Limit results
  completions = completions.slice(-parseInt(limit));

  res.status(200).json({
    success: true,
    count: completions.length,
    data: completions
  });
});

// @desc    Reorder habits
// @route   PUT /api/habits/reorder
// @access  Private
export const reorderHabits = asyncHandler(async (req, res) => {
  const { habitIds } = req.body;

  if (!habitIds || !Array.isArray(habitIds)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an array of habit IDs'
    });
  }

  // Verify all habits belong to the user
  const habits = await Habit.find({
    _id: { $in: habitIds },
    user: req.user.id
  });

  if (habits.length !== habitIds.length) {
    return res.status(403).json({
      success: false,
      message: 'One or more habits not found or unauthorized'
    });
  }

  // Update order for each habit
  const updatePromises = habitIds.map((habitId, index) =>
    Habit.findByIdAndUpdate(
      habitId,
      { order: index },
      { new: true }
    )
  );

  const updatedHabits = await Promise.all(updatePromises);

  res.status(200).json({
    success: true,
    data: updatedHabits
  });
});
