import asyncHandler from '../utils/asyncHandler.js';
import gamificationService from '../services/gamificationService.js';
import Achievement from '../models/Achievement.js';

// @desc    Get user statistics
// @route   GET /api/gamification/stats
// @access  Private
export const getUserStats = asyncHandler(async (req, res) => {
  const stats = await gamificationService.getUserStats(req.user.id);

  res.status(200).json({
    success: true,
    data: stats
  });
});

// @desc    Get all achievements
// @route   GET /api/gamification/achievements
// @access  Private
export const getAchievements = asyncHandler(async (req, res) => {
  const achievements = await Achievement.find({ isActive: true }).sort({ 'requirement.value': 1 });

  // Get user's earned badges
  const earnedBadgeIds = req.user.gamification.badges.map(b => b.id);

  // Map achievements with earned status
  const achievementsWithStatus = achievements.map(achievement => ({
    id: achievement.id,
    name: achievement.name,
    description: achievement.description,
    category: achievement.category,
    icon: achievement.icon,
    rarity: achievement.rarity,
    requirement: achievement.requirement,
    reward: achievement.reward,
    earned: earnedBadgeIds.includes(achievement.id),
    earnedAt: earnedBadgeIds.includes(achievement.id)
      ? req.user.gamification.badges.find(b => b.id === achievement.id).earnedAt
      : null
  }));

  res.status(200).json({
    success: true,
    count: achievementsWithStatus.length,
    data: achievementsWithStatus
  });
});

// @desc    Get user badges
// @route   GET /api/gamification/badges
// @access  Private
export const getUserBadges = asyncHandler(async (req, res) => {
  const badges = req.user.gamification.badges;

  res.status(200).json({
    success: true,
    count: badges.length,
    data: badges
  });
});

// @desc    Get leaderboard
// @route   GET /api/gamification/leaderboard
// @access  Private
export const getLeaderboard = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  const leaderboard = await gamificationService.getLeaderboard(limit);

  res.status(200).json({
    success: true,
    count: leaderboard.length,
    data: leaderboard
  });
});

// @desc    Get level progress
// @route   GET /api/gamification/progress
// @access  Private
export const getLevelProgress = asyncHandler(async (req, res) => {
  const progress = gamificationService.getProgressToNextLevel(
    req.user.gamification.points,
    req.user.gamification.level
  );

  res.status(200).json({
    success: true,
    data: progress
  });
});
