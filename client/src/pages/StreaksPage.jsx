import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { habitService } from '../services/habitService';
import AppHeader from '../components/AppHeader';
import AppNavigation from '../components/AppNavigation';

const StreaksPage = () => {
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

  // Calculate streak stats
  const currentStreak = user?.gamification?.streak?.current || 0;
  const longestStreak = user?.gamification?.streak?.longest || 0;
  const totalDaysActive = habits.reduce((sum, habit) => sum + (habit.stats?.currentStreak || 0), 0);

  // Sort habits by current streak
  const habitsByStreak = [...habits].sort((a, b) =>
    (b.stats?.currentStreak || 0) - (a.stats?.currentStreak || 0)
  );

  // Get habits on fire (streak > 7)
  const onFireHabits = habits.filter(h => (h.stats?.currentStreak || 0) >= 7);

  // Get habits at risk (last completed > 1 day ago)
  const atRiskHabits = habits.filter(h => {
    if (!h.stats?.lastCompletedDate) return false;
    const daysSince = Math.floor((new Date() - new Date(h.stats.lastCompletedDate)) / (1000 * 60 * 60 * 24));
    return daysSince >= 1 && (h.stats?.currentStreak || 0) > 0;
  });

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
      <main className="pt-40 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Streaks & Consistency 🔥
          </h1>
          <p className="text-gray-400">
            Track your consistency and maintain your momentum
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
            {error}
          </div>
        )}

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass rounded-2xl p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-3xl">
              🔥
            </div>
            <p className="text-gray-400 text-sm mb-1">Current Streak</p>
            <p className="text-4xl font-bold text-white">{currentStreak}</p>
            <p className="text-gray-500 text-sm mt-1">days</p>
          </div>

          <div className="glass rounded-2xl p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-3xl">
              🏆
            </div>
            <p className="text-gray-400 text-sm mb-1">Longest Streak</p>
            <p className="text-4xl font-bold text-white">{longestStreak}</p>
            <p className="text-gray-500 text-sm mt-1">days</p>
          </div>

          <div className="glass rounded-2xl p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-3xl">
              📊
            </div>
            <p className="text-gray-400 text-sm mb-1">Total Active Days</p>
            <p className="text-4xl font-bold text-white">{totalDaysActive}</p>
            <p className="text-gray-500 text-sm mt-1">across all habits</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Habits on Fire */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              On Fire ({onFireHabits.length})
            </h2>
            {onFireHabits.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">Build a 7-day streak to light up your habits!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {onFireHabits.map(habit => (
                  <div key={habit._id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-2xl">
                      {habit.icon || '📌'}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{habit.title}</p>
                      <p className="text-sm text-gray-500">{habit.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">{habit.stats?.currentStreak || 0}</p>
                      <p className="text-xs text-gray-500">days</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* At Risk */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              At Risk ({atRiskHabits.length})
            </h2>
            {atRiskHabits.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">Great job! No habits at risk right now.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {atRiskHabits.map(habit => {
                  const daysSince = Math.floor((new Date() - new Date(habit.stats.lastCompletedDate)) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={habit._id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-yellow-500/20">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">
                        {habit.icon || '📌'}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{habit.title}</p>
                        <p className="text-sm text-yellow-500">Not completed for {daysSince} day{daysSince !== 1 ? 's' : ''}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-400">{habit.stats?.currentStreak || 0}</p>
                        <p className="text-xs text-gray-500">day streak</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* All Habits Ranked by Streak */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">All Habits Ranked by Streak</h2>
          {habits.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🎯</div>
              <p className="text-gray-500 mb-4">No habits yet. Create your first habit to start building streaks!</p>
              <Link
                to="/habits"
                className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors"
              >
                Go to Habits
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {habitsByStreak.map((habit, index) => (
                <div
                  key={habit._id}
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                >
                  {/* Rank */}
                  <div className="w-8 text-center">
                    {index === 0 && <span className="text-2xl">🥇</span>}
                    {index === 1 && <span className="text-2xl">🥈</span>}
                    {index === 2 && <span className="text-2xl">🥉</span>}
                    {index > 2 && <span className="text-gray-500 font-medium">#{index + 1}</span>}
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">
                    {habit.icon || '📌'}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <p className="text-white font-medium">{habit.title}</p>
                    <p className="text-sm text-gray-500">{habit.category}</p>
                  </div>

                  {/* Streak Info */}
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-orange-400">🔥</span>
                      <span className="text-2xl font-bold text-white">{habit.stats?.currentStreak || 0}</span>
                    </div>
                    {habit.stats?.longestStreak && habit.stats.longestStreak > (habit.stats.currentStreak || 0) && (
                      <p className="text-xs text-gray-500 mt-1">Best: {habit.stats.longestStreak} days</p>
                    )}
                  </div>

                  {/* Completion Rate */}
                  {habit.stats?.totalCompletions && (
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-medium text-white">{habit.stats.totalCompletions}</p>
                      <p className="text-xs text-gray-500">completions</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Streak Tips */}
        <div className="mt-8 glass rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">💡 Tips to Maintain Your Streak</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
              <div className="text-2xl">⏰</div>
              <div>
                <h3 className="text-white font-medium mb-1">Set Reminders</h3>
                <p className="text-sm text-gray-400">Enable notifications to stay on track with your daily habits.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
              <div className="text-2xl">🎯</div>
              <div>
                <h3 className="text-white font-medium mb-1">Start Small</h3>
                <p className="text-sm text-gray-400">Begin with achievable goals to build momentum and confidence.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
              <div className="text-2xl">📅</div>
              <div>
                <h3 className="text-white font-medium mb-1">Plan Ahead</h3>
                <p className="text-sm text-gray-400">Schedule your habits for specific times to make them routine.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
              <div className="text-2xl">🎉</div>
              <div>
                <h3 className="text-white font-medium mb-1">Celebrate Wins</h3>
                <p className="text-sm text-gray-400">Acknowledge your progress and reward yourself for milestones.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StreaksPage;
