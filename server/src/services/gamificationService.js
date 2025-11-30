import User from '../models/User.js';
import Habit from '../models/Habit.js';
import Achievement from '../models/Achievement.js';

class GamificationService {
  // Points calculation
  calculateHabitPoints(habit, streak = 1) {
    const basePoints = 10;
    const streakBonus = Math.min(streak * 2, 50); // Max 50 bonus points
    const categoryMultipliers = {
      health: 1.2,
      fitness: 1.2,
      mindfulness: 1.1,
      learning: 1.3,
      productivity: 1.1,
      social: 1.0,
      creative: 1.1,
      other: 1.0
    };

    const categoryMultiplier = categoryMultipliers[habit.category] || 1.0;
    return Math.round((basePoints + streakBonus) * categoryMultiplier);
  }

  calculateTaskPoints(task) {
    const priorityPoints = {
      low: 5,
      medium: 10,
      high: 20,
      urgent: 30
    };

    const basePoints = priorityPoints[task.priority] || 10;

    // Bonus for completing before due date
    let timeBonus = 0;
    if (task.dueDate) {
      const now = new Date();
      const daysBeforeDue = Math.floor((task.dueDate - now) / (1000 * 60 * 60 * 24));
      if (daysBeforeDue > 0) {
        timeBonus = Math.min(daysBeforeDue * 2, 10);
      }
    }

    return basePoints + timeBonus;
  }

  // Level calculation
  getPointsForLevel(level) {
    // Formula: points needed = (level - 1)^2 * 100
    return Math.pow(level - 1, 2) * 100;
  }

  getProgressToNextLevel(currentPoints, currentLevel) {
    const pointsForCurrentLevel = this.getPointsForLevel(currentLevel);
    const pointsForNextLevel = this.getPointsForLevel(currentLevel + 1);
    const pointsNeeded = pointsForNextLevel - pointsForCurrentLevel;
    const pointsEarned = currentPoints - pointsForCurrentLevel;

    return {
      currentLevel,
      nextLevel: currentLevel + 1,
      pointsInLevel: Math.max(0, pointsEarned),
      pointsNeeded: pointsNeeded,
      percentage: Math.round((pointsEarned / pointsNeeded) * 100)
    };
  }

  // Achievement checking
  async checkAchievements(user, context = {}) {
    const newBadges = [];

    try {
      // Get all achievements
      const achievements = await Achievement.find({ isActive: true });

      // Get user's current badges
      const earnedBadgeIds = user.gamification.badges.map(b => b.id);

      // Get user's habits for checking
      const habits = await Habit.find({ user: user._id, isActive: true });

      for (const achievement of achievements) {
        // Skip if already earned
        if (earnedBadgeIds.includes(achievement.id)) continue;

        let earned = false;

        switch (achievement.requirement.type) {
          case 'count':
            if (achievement.category === 'habits') {
              earned = habits.length >= achievement.requirement.value;
            }
            break;

          case 'streak':
            earned = user.gamification.streak.current >= achievement.requirement.value ||
                     user.gamification.streak.longest >= achievement.requirement.value;
            break;

          case 'points':
            earned = user.gamification.points >= achievement.requirement.value;
            break;

          case 'level':
            earned = user.gamification.level >= achievement.requirement.value;
            break;

          case 'custom':
            // Handle custom achievements based on context
            if (achievement.id === 'perfect_day' && context.perfectDay) {
              earned = true;
            }
            if (achievement.id === 'early_bird' && context.earlyBird) {
              earned = true;
            }
            break;
        }

        if (earned) {
          const badge = {
            id: achievement.id,
            name: achievement.name,
            description: achievement.description,
            icon: achievement.icon,
            earnedAt: new Date()
          };

          user.awardBadge(badge);

          // Add achievement reward points
          if (achievement.reward.points > 0) {
            user.addPoints(achievement.reward.points);
          }

          newBadges.push(badge);
        }
      }

      if (newBadges.length > 0) {
        await user.save();
      }

      return newBadges;
    } catch (error) {
      console.error('Error checking achievements:', error);
      return [];
    }
  }

  // Streak management
  isStreakActive(lastCheckIn) {
    if (!lastCheckIn) return false;

    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const lastCheckInDate = new Date(lastCheckIn);
    lastCheckInDate.setHours(0, 0, 0, 0);

    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    return lastCheckInDate.getTime() === today.getTime() ||
           lastCheckInDate.getTime() === yesterday.getTime();
  }

  // Badge rarity colors
  getBadgeRarityColor(rarity) {
    const colors = {
      common: '#94a3b8',
      rare: '#3b82f6',
      epic: '#a855f7',
      legendary: '#f59e0b'
    };
    return colors[rarity] || colors.common;
  }

  // Statistics
  async getUserStats(userId) {
    try {
      const user = await User.findById(userId);
      const habits = await Habit.find({ user: userId, isActive: true });

      const totalHabits = habits.length;
      const totalCompletions = habits.reduce((sum, h) => sum + h.stats.totalCompletions, 0);
      const longestStreak = Math.max(...habits.map(h => h.stats.longestStreak), 0);

      const completionRate = totalHabits > 0
        ? Math.round((habits.filter(h => h.isCompletedToday()).length / totalHabits) * 100)
        : 0;

      return {
        points: user.gamification.points,
        level: user.gamification.level,
        streak: user.gamification.streak,
        badges: user.gamification.badges.length,
        habits: {
          total: totalHabits,
          completions: totalCompletions,
          longestStreak: longestStreak,
          completionRate: completionRate
        },
        progress: this.getProgressToNextLevel(
          user.gamification.points,
          user.gamification.level
        )
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }

  // Leaderboard (for future use)
  async getLeaderboard(limit = 10) {
    try {
      const users = await User.find()
        .select('username gamification.points gamification.level gamification.streak')
        .sort({ 'gamification.points': -1 })
        .limit(limit);

      return users.map((user, index) => ({
        rank: index + 1,
        username: user.username,
        points: user.gamification.points,
        level: user.gamification.level,
        streak: user.gamification.streak.current
      }));
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      throw error;
    }
  }
}

export default new GamificationService();
