import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { habitService } from '../services/habitService';
import AppHeader from '../components/AppHeader';
import AppNavigation from '../components/AppNavigation';

const LevelsPage = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const data = await habitService.getAll();
      setHabits(data.data || []);
    } catch (err) {
      setError('Failed to load habits');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate XP and Level stats
  const totalXP = user?.gamification?.points || 0;
  const level = user?.gamification?.level || 1;
  const POINTS_PER_LEVEL = 100;
  const xpForNextLevel = level * POINTS_PER_LEVEL;
  const currentLevelXP = totalXP % POINTS_PER_LEVEL;
  const xpProgress = (currentLevelXP / POINTS_PER_LEVEL) * 100;

  // Level milestones
  const levelMilestones = [
    { level: 5, title: 'Habit Novice', icon: '🌱', unlocked: level >= 5 },
    { level: 10, title: 'Habit Enthusiast', icon: '🌿', unlocked: level >= 10 },
    { level: 15, title: 'Habit Master', icon: '🌳', unlocked: level >= 15 },
    { level: 20, title: 'Habit Legend', icon: '🏆', unlocked: level >= 20 },
    { level: 25, title: 'Habit Hero', icon: '⭐', unlocked: level >= 25 },
    { level: 30, title: 'Habit Champion', icon: '👑', unlocked: level >= 30 },
  ];

  // XP sources
  const xpSources = [
    { name: 'Daily Habit Completion', xp: 10, icon: '✅' },
    { name: '3-Day Streak Bonus', xp: 15, icon: '🔥' },
    { name: '7-Day Streak Bonus', xp: 50, icon: '🔥' },
    { name: '30-Day Streak Bonus', xp: 200, icon: '🏆' },
    { name: 'Perfect Day (All Habits)', xp: 25, icon: '⭐' },
    { name: 'Weekly Goal Complete', xp: 100, icon: '🎯' },
  ];

  // Badges
  const allBadges = [
    { id: 'first_habit', name: 'First Habit', description: 'Create your first habit', icon: '🎯', unlocked: habits.length > 0 },
    { id: 'week_warrior', name: 'Week Warrior', description: 'Complete a habit for 7 days straight', icon: '💪', unlocked: habits.some(h => (h.stats?.currentStreak || 0) >= 7) },
    { id: 'perfect_day', name: 'Perfect Day', description: 'Complete all habits in a day', icon: '⭐', unlocked: false },
    { id: 'early_bird', name: 'Early Bird', description: 'Complete a habit before 7 AM', icon: '🌅', unlocked: false },
    { id: 'night_owl', name: 'Night Owl', description: 'Complete a habit after 10 PM', icon: '🦉', unlocked: false },
    { id: 'month_master', name: 'Month Master', description: '30-day streak on any habit', icon: '📅', unlocked: habits.some(h => (h.stats?.currentStreak || 0) >= 30) },
    { id: 'diversified', name: 'Diversified', description: 'Have habits in 5 different categories', icon: '🎨', unlocked: false },
    { id: 'collector', name: 'Habit Collector', description: 'Create 10 habits', icon: '📚', unlocked: habits.length >= 10 },
  ];

  const unlockedBadges = allBadges.filter(b => b.unlocked);
  const lockedBadges = allBadges.filter(b => !b.unlocked);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <AppHeader />
      <AppNavigation />

      {/* Main Content */}
      <main className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Level & Progress 🏆
          </h1>
          <p className="text-gray-400">
            Track your XP, achievements, and unlock new milestones
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
            {error}
          </div>
        )}

        {/* Current Level Card */}
        <div className="glass rounded-2xl p-8 mb-8 text-center">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 mb-4 relative">
            <span className="text-6xl font-bold text-white">{level}</span>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-2xl">
              ⭐
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Level {level}</h2>
          <p className="text-gray-400 mb-6">
            {levelMilestones.find(m => !m.unlocked)?.title || 'Habit Champion'}
          </p>

          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">{currentLevelXP} XP</span>
              <span className="text-sm text-gray-400">{POINTS_PER_LEVEL} XP</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-yellow-500 to-orange-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {POINTS_PER_LEVEL - currentLevelXP} XP needed for Level {level + 1}
            </p>
          </div>

          {/* Total XP */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-gray-400 text-sm mb-1">Total XP Earned</p>
            <p className="text-4xl font-bold gradient-text">{totalXP.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Level Milestones */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Level Milestones</h2>
            <div className="space-y-3">
              {levelMilestones.map(milestone => (
                <div
                  key={milestone.level}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                    milestone.unlocked
                      ? 'bg-primary-500/10 border border-primary-500/30'
                      : 'bg-white/5 opacity-50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                    milestone.unlocked ? 'bg-primary-500/20' : 'bg-white/5'
                  }`}>
                    {milestone.unlocked ? milestone.icon : '🔒'}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${milestone.unlocked ? 'text-white' : 'text-gray-500'}`}>
                      {milestone.title}
                    </p>
                    <p className="text-sm text-gray-500">Level {milestone.level}</p>
                  </div>
                  {milestone.unlocked && (
                    <div className="text-green-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* XP Sources */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">How to Earn XP</h2>
            <div className="space-y-3">
              {xpSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl">
                      {source.icon}
                    </div>
                    <p className="text-white text-sm">{source.name}</p>
                  </div>
                  <div className="text-primary-400 font-bold">+{source.xp} XP</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Achievements & Badges</h2>
            <p className="text-gray-400 text-sm">
              {unlockedBadges.length} / {allBadges.length} unlocked
            </p>
          </div>

          {/* Unlocked Badges */}
          {unlockedBadges.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-white mb-4">Unlocked</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {unlockedBadges.map(badge => (
                  <div key={badge.id} className="glass rounded-xl p-4 text-center hover:bg-white/10 transition-all">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-3xl">
                      {badge.icon}
                    </div>
                    <p className="text-white font-medium text-sm mb-1">{badge.name}</p>
                    <p className="text-gray-500 text-xs">{badge.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Locked Badges */}
          {lockedBadges.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Locked</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {lockedBadges.map(badge => (
                  <div key={badge.id} className="glass rounded-xl p-4 text-center opacity-50">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/10 flex items-center justify-center text-3xl">
                      🔒
                    </div>
                    <p className="text-gray-400 font-medium text-sm mb-1">{badge.name}</p>
                    <p className="text-gray-600 text-xs">{badge.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-3xl mb-2">🎯</p>
            <p className="text-2xl font-bold text-white">{habits.length}</p>
            <p className="text-sm text-gray-500">Active Habits</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-3xl mb-2">🔥</p>
            <p className="text-2xl font-bold text-white">{user?.gamification?.streak?.current || 0}</p>
            <p className="text-sm text-gray-500">Current Streak</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-3xl mb-2">🏆</p>
            <p className="text-2xl font-bold text-white">{user?.gamification?.streak?.longest || 0}</p>
            <p className="text-sm text-gray-500">Longest Streak</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-3xl mb-2">⭐</p>
            <p className="text-2xl font-bold text-white">{unlockedBadges.length}</p>
            <p className="text-sm text-gray-500">Badges Earned</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LevelsPage;
