import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['habits', 'streaks', 'points', 'levels', 'special'],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  requirement: {
    type: {
      type: String,
      enum: ['count', 'streak', 'points', 'level', 'custom'],
      required: true
    },
    value: {
      type: Number,
      required: true
    }
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  reward: {
    points: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: ''
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Default achievements to seed the database
achievementSchema.statics.getDefaultAchievements = function() {
  return [
    {
      id: 'first_habit',
      name: 'Getting Started',
      description: 'Create your first habit',
      category: 'habits',
      icon: '🌱',
      requirement: { type: 'count', value: 1 },
      rarity: 'common',
      reward: { points: 10 }
    },
    {
      id: 'habit_collector',
      name: 'Habit Collector',
      description: 'Create 5 habits',
      category: 'habits',
      icon: '📚',
      requirement: { type: 'count', value: 5 },
      rarity: 'common',
      reward: { points: 25 }
    },
    {
      id: 'habit_master',
      name: 'Habit Master',
      description: 'Create 10 habits',
      category: 'habits',
      icon: '🎯',
      requirement: { type: 'count', value: 10 },
      rarity: 'rare',
      reward: { points: 50 }
    },
    {
      id: 'streak_starter',
      name: 'Streak Starter',
      description: 'Reach a 3-day streak',
      category: 'streaks',
      icon: '🔥',
      requirement: { type: 'streak', value: 3 },
      rarity: 'common',
      reward: { points: 15 }
    },
    {
      id: 'week_warrior',
      name: 'Week Warrior',
      description: 'Reach a 7-day streak',
      category: 'streaks',
      icon: '⚡',
      requirement: { type: 'streak', value: 7 },
      rarity: 'rare',
      reward: { points: 35 }
    },
    {
      id: 'consistency_king',
      name: 'Consistency King',
      description: 'Reach a 30-day streak',
      category: 'streaks',
      icon: '👑',
      requirement: { type: 'streak', value: 30 },
      rarity: 'epic',
      reward: { points: 100 }
    },
    {
      id: 'century_streak',
      name: 'Century Club',
      description: 'Reach a 100-day streak',
      category: 'streaks',
      icon: '💯',
      requirement: { type: 'streak', value: 100 },
      rarity: 'legendary',
      reward: { points: 500 }
    },
    {
      id: 'point_rookie',
      name: 'Point Rookie',
      description: 'Earn 100 points',
      category: 'points',
      icon: '⭐',
      requirement: { type: 'points', value: 100 },
      rarity: 'common',
      reward: { points: 10 }
    },
    {
      id: 'point_veteran',
      name: 'Point Veteran',
      description: 'Earn 500 points',
      category: 'points',
      icon: '🌟',
      requirement: { type: 'points', value: 500 },
      rarity: 'rare',
      reward: { points: 25 }
    },
    {
      id: 'point_legend',
      name: 'Point Legend',
      description: 'Earn 1000 points',
      category: 'points',
      icon: '💫',
      requirement: { type: 'points', value: 1000 },
      rarity: 'epic',
      reward: { points: 50 }
    },
    {
      id: 'level_up',
      name: 'Level Up!',
      description: 'Reach level 2',
      category: 'levels',
      icon: '📈',
      requirement: { type: 'level', value: 2 },
      rarity: 'common',
      reward: { points: 20 }
    },
    {
      id: 'rising_star',
      name: 'Rising Star',
      description: 'Reach level 5',
      category: 'levels',
      icon: '🚀',
      requirement: { type: 'level', value: 5 },
      rarity: 'rare',
      reward: { points: 50 }
    },
    {
      id: 'elite_performer',
      name: 'Elite Performer',
      description: 'Reach level 10',
      category: 'levels',
      icon: '💎',
      requirement: { type: 'level', value: 10 },
      rarity: 'epic',
      reward: { points: 100 }
    },
    {
      id: 'early_bird',
      name: 'Early Bird',
      description: 'Complete a habit before 8 AM',
      category: 'special',
      icon: '🌅',
      requirement: { type: 'custom', value: 1 },
      rarity: 'common',
      reward: { points: 15 }
    },
    {
      id: 'perfect_day',
      name: 'Perfect Day',
      description: 'Complete all habits in a day',
      category: 'special',
      icon: '✨',
      requirement: { type: 'custom', value: 1 },
      rarity: 'rare',
      reward: { points: 50 }
    }
  ];
};

const Achievement = mongoose.model('Achievement', achievementSchema);

export default Achievement;
