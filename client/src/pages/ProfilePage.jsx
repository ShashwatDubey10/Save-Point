import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { habitService } from '../services/habitService';
import AppHeader from '../components/AppHeader';
import AppNavigation from '../components/AppNavigation';
import axios from 'axios';

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Edit mode states
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await habitService.getStats();
      setStats(data.data || null);
    } catch (err) {
      setError('Failed to load stats');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!newUsername.trim()) {
      setError('Username cannot be empty');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/me`,
        { username: newUsername },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await refreshUser();
      setSuccess('Username updated successfully!');
      setIsEditingUsername(false);
      setNewUsername('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update username');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Password updated successfully!');
      setIsEditingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    }
  };

  const level = user?.gamification?.level || 1;
  const totalXP = user?.gamification?.points || 0;
  const xpForNextLevel = Math.pow(level, 2) * 100 - Math.pow(level - 1, 2) * 100;
  const pointsInLevel = totalXP - Math.pow(level - 1, 2) * 100;
  const xpProgress = (pointsInLevel / xpForNextLevel) * 100;

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
      <main className="pt-40 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-4xl">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            {user?.username || 'User'}
          </h1>
          <p className="text-gray-400">Level {level} Habit Builder</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400">
            {success}
          </div>
        )}

        {/* Profile Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Level Progress */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Level Progress</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-3xl">
                🏆
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-white">Level {level}</span>
                  <span className="text-sm text-gray-400">{pointsInLevel}/{xpForNextLevel} XP</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(xpProgress, 100)}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div>
                <p className="text-gray-400 text-sm">Total XP</p>
                <p className="text-xl font-bold text-white">{totalXP}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">To Next Level</p>
                <p className="text-xl font-bold text-white">{Math.max(0, xpForNextLevel - pointsInLevel)}</p>
              </div>
            </div>
          </div>

          {/* Streaks */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Streak Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-3xl">
                  🔥
                </div>
                <div className="flex-1">
                  <p className="text-gray-400 text-sm">Current Streak</p>
                  <p className="text-2xl font-bold text-white">{user?.gamification?.streak?.current || 0} days</p>
                </div>
              </div>
              <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Longest Streak</p>
                  <p className="text-xl font-bold text-white">{user?.gamification?.longestStreak || 0} days</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Days</p>
                  <p className="text-xl font-bold text-white">{stats?.totalCompletions || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Stats */}
        <div className="glass rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-bold text-white mb-4">Account Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <div className="text-2xl mb-2">📚</div>
              <div className="text-2xl font-bold text-white mb-1">{stats?.totalHabits || 0}</div>
              <div className="text-sm text-gray-400">Total Habits</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <div className="text-2xl mb-2">✅</div>
              <div className="text-2xl font-bold text-white mb-1">{stats?.completedToday || 0}</div>
              <div className="text-sm text-gray-400">Today</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-2xl font-bold text-white mb-1">{stats?.totalCompletions || 0}</div>
              <div className="text-sm text-gray-400">All Time</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <div className="text-2xl mb-2">🏅</div>
              <div className="text-2xl font-bold text-white mb-1">{user?.gamification?.badges?.length || 0}</div>
              <div className="text-sm text-gray-400">Badges</div>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="glass rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-bold text-white mb-4">Account Information</h3>
          <div className="space-y-4">
            {/* Username */}
            <div className="py-3 border-b border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Username</span>
                {!isEditingUsername ? (
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{user?.username || 'N/A'}</span>
                    <button
                      onClick={() => {
                        setIsEditingUsername(true);
                        setNewUsername(user?.username || '');
                      }}
                      className="text-primary-400 hover:text-primary-300 text-sm"
                    >
                      Edit
                    </button>
                  </div>
                ) : null}
              </div>
              {isEditingUsername && (
                <form onSubmit={handleUpdateUsername} className="space-y-3">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full px-3 py-2 bg-dark-700 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    placeholder="New username"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingUsername(false);
                        setNewUsername('');
                      }}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Email */}
            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <span className="text-gray-400">Email</span>
              <span className="text-white font-medium">{user?.email || 'N/A'}</span>
            </div>

            {/* Password */}
            <div className="py-3 border-b border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Password</span>
                {!isEditingPassword ? (
                  <button
                    onClick={() => setIsEditingPassword(true)}
                    className="text-primary-400 hover:text-primary-300 text-sm"
                  >
                    Change Password
                  </button>
                ) : null}
              </div>
              {isEditingPassword && (
                <form onSubmit={handleUpdatePassword} className="space-y-3">
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-dark-700 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    placeholder="Current password"
                    required
                  />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-dark-700 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    placeholder="New password"
                    required
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-dark-700 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    placeholder="Confirm new password"
                    required
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingPassword(false);
                        setCurrentPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                      }}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Member Since */}
            <div className="flex items-center justify-between py-3">
              <span className="text-gray-400">Member Since</span>
              <span className="text-white font-medium">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link to="/dashboard" className="glass rounded-xl p-6 hover:bg-white/10 transition-all text-center">
            <div className="text-4xl mb-3">🏠</div>
            <h4 className="text-lg font-bold text-white mb-2">Back to Dashboard</h4>
            <p className="text-sm text-gray-400">Return to your main dashboard</p>
          </Link>
          <Link to="/habits" className="glass rounded-xl p-6 hover:bg-white/10 transition-all text-center">
            <div className="text-4xl mb-3">📚</div>
            <h4 className="text-lg font-bold text-white mb-2">Manage Habits</h4>
            <p className="text-sm text-gray-400">View and edit your habits</p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
