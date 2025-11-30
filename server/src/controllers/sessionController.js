import Session from '../models/Session.js';
import Habit from '../models/Habit.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import gamificationService from '../services/gamificationService.js';

// @desc    Get today's session (or create if doesn't exist)
// @route   GET /api/sessions/today
// @access  Private
export const getTodaySession = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let session = await Session.findOne({
    user: req.user.id,
    date: today
  }).populate('habits.habit', 'title icon category');

  // If no session exists for today, create one with user's active habits
  if (!session) {
    const activeHabits = await Habit.find({
      user: req.user.id,
      isActive: true
    });

    session = await Session.create({
      user: req.user.id,
      date: today,
      habits: activeHabits.map(habit => ({
        habit: habit._id,
        completed: false
      })),
      status: 'draft'
    });

    session = await Session.findById(session._id)
      .populate('habits.habit', 'title icon category');
  }

  res.status(200).json({
    success: true,
    data: session
  });
});

// @desc    Auto-save session (draft)
// @route   PUT /api/sessions/today/autosave
// @access  Private
export const autosaveSession = asyncHandler(async (req, res) => {
  const { habits, notes, mood } = req.body;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let session = await Session.findOne({
    user: req.user.id,
    date: today
  });

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Session not found. Create a session first.'
    });
  }

  // Update session data
  if (habits) session.habits = habits;
  if (notes !== undefined) session.notes = notes;
  if (mood) session.mood = mood;

  session.autoSaveVersion += 1;
  session.status = 'draft';

  await session.save();

  res.status(200).json({
    success: true,
    message: 'Session auto-saved',
    data: session
  });
});

// @desc    Publish session (finalize and apply to habits)
// @route   POST /api/sessions/today/publish
// @access  Private
export const publishSession = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const session = await Session.findOne({
    user: req.user.id,
    date: today
  }).populate('habits.habit');

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Session not found'
    });
  }

  if (session.status === 'published') {
    return res.status(400).json({
      success: false,
      message: 'Session already published'
    });
  }

  const user = await User.findById(req.user.id);
  let totalPoints = 0;
  const newBadges = [];

  // Process each habit completion
  for (const sessionHabit of session.habits) {
    if (sessionHabit.completed && sessionHabit.habit) {
      const habit = sessionHabit.habit;

      // Check if already completed today
      if (!habit.isCompletedToday()) {
        // Complete the habit
        habit.complete(sessionHabit.note, sessionHabit.mood);
        await habit.save();

        // Calculate and award points
        const points = gamificationService.calculateHabitPoints(
          habit,
          habit.stats.currentStreak
        );
        totalPoints += points;
      }
    }
  }

  // Add points to user
  if (totalPoints > 0) {
    user.addPoints(totalPoints);
    user.updateStreak();
    await user.save();

    // Check for achievements
    const context = {};
    const now = new Date();
    if (now.getHours() < 8) {
      context.earlyBird = true;
    }

    // Check if all habits completed
    const allCompleted = session.habits.every(sh => sh.completed);
    if (allCompleted && session.habits.length > 0) {
      context.perfectDay = true;
    }

    const badges = await gamificationService.checkAchievements(user, context);
    newBadges.push(...badges);
  }

  // Mark session as published
  session.publish();
  await session.save();

  res.status(200).json({
    success: true,
    message: 'Session published successfully',
    data: {
      session,
      points: {
        earned: totalPoints,
        total: user.gamification.points,
        level: user.gamification.level
      },
      badges: newBadges
    }
  });
});

// @desc    Get session history
// @route   GET /api/sessions/history
// @access  Private
export const getSessionHistory = asyncHandler(async (req, res) => {
  const { limit = 30, status } = req.query;

  const filter = { user: req.user.id };
  if (status) {
    filter.status = status;
  }

  const sessions = await Session.find(filter)
    .sort({ date: -1 })
    .limit(parseInt(limit))
    .populate('habits.habit', 'title icon category');

  res.status(200).json({
    success: true,
    count: sessions.length,
    data: sessions
  });
});

// @desc    Get specific session by date
// @route   GET /api/sessions/:date
// @access  Private
export const getSessionByDate = asyncHandler(async (req, res) => {
  const sessionDate = new Date(req.params.date);
  sessionDate.setHours(0, 0, 0, 0);

  const session = await Session.findOne({
    user: req.user.id,
    date: sessionDate
  }).populate('habits.habit', 'title icon category');

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'No session found for this date'
    });
  }

  res.status(200).json({
    success: true,
    data: session
  });
});

// @desc    Delete session
// @route   DELETE /api/sessions/:date
// @access  Private
export const deleteSession = asyncHandler(async (req, res) => {
  const sessionDate = new Date(req.params.date);
  sessionDate.setHours(0, 0, 0, 0);

  const session = await Session.findOne({
    user: req.user.id,
    date: sessionDate
  });

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Session not found'
    });
  }

  // Can only delete draft sessions
  if (session.status === 'published') {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete published sessions'
    });
  }

  await session.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Session deleted successfully'
  });
});
