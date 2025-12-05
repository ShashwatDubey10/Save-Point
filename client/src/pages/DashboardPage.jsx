import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { habitService } from '../services/habitService';
import { taskService } from '../services/taskService';
import { analyticsService } from '../services/analyticsService';
import AppHeader from '../components/AppHeader';
import AppNavigation from '../components/AppNavigation';
import HabitModal from '../components/HabitModal';
import ConfirmationModal from '../components/ConfirmationModal';
import MonthlyHabitTracker from '../components/MonthlyHabitTracker';

const DashboardPage = () => {
  const { user, refreshUser } = useAuth();
  const [habits, setHabits] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [weeklyData, setWeeklyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch habits, tasks, and weekly summary
      const [habitsResponse, tasksResponse, weeklyResponse] = await Promise.all([
        habitService.getAll(),
        taskService.getAll(), // Fetch all tasks, filter on frontend
        analyticsService.getWeeklySummary()
      ]);

      // taskService.getAll() already returns the data array (response.data.data)
      // Filter out completed tasks on frontend
      const activeTasks = (tasksResponse || []).filter(task => task.status !== 'completed');

      setHabits(habitsResponse.data || []);
      setTasks(activeTasks);
      setWeeklyData(weeklyResponse.data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHabits = async () => {
    try {
      const data = await habitService.getAll();
      setHabits(data.data || []);
    } catch (err) {
      setError('Failed to load habits');
      console.error(err);
    }
  };

  // Check if habit is completed today (same as HabitsPage)
  const isCompletedToday = (habit) => {
    if (!habit.completions || habit.completions.length === 0) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastCompletionData = habit.completions[habit.completions.length - 1];
    const lastCompletion = new Date(lastCompletionData.date);
    lastCompletion.setHours(0, 0, 0, 0);

    return lastCompletion.getTime() === today.getTime();
  };

  const toggleHabit = async (id, completed) => {
    // Optimistic UI update
    setHabits(prevHabits =>
      prevHabits.map(habit => {
        if (habit._id === id) {
          const updatedHabit = { ...habit };
          if (completed) {
            // Remove last completion
            updatedHabit.completions = habit.completions.slice(0, -1);
          } else {
            // Add completion for today
            updatedHabit.completions = [
              ...(habit.completions || []),
              { date: new Date(), note: '', mood: null }
            ];
          }
          return updatedHabit;
        }
        return habit;
      })
    );

    try {
      if (completed) {
        await habitService.uncomplete(id);
        toast.success('Habit marked as incomplete');
      } else {
        const response = await habitService.complete(id);
        const points = response.data?.points?.earned || 10;
        toast.success(`Habit completed! +${points} XP earned 🎉`);
      }
      // Refresh data and user info to get accurate server state
      await Promise.all([
        fetchDashboardData(),
        refreshUser()
      ]);
    } catch (err) {
      console.error('Failed to toggle habit:', err);

      // Show specific error message if available
      const errorMessage = err.response?.data?.message || 'Failed to update habit. Please try again.';
      toast.error(errorMessage);

      // Refresh to revert optimistic update and ensure UI is in sync
      await fetchDashboardData();
    }
  };

  // Create new habit
  const handleCreateHabit = () => {
    setEditingHabit(null);
    setIsHabitModalOpen(true);
  };

  // Edit habit
  const handleEditHabit = (habit, e) => {
    e.stopPropagation(); // Prevent toggle when clicking edit
    e.preventDefault(); // Prevent any default behavior
    setEditingHabit(habit);
    setIsHabitModalOpen(true);
  };

  // Save habit (create or update)
  const handleSaveHabit = async (habitData) => {
    try {
      if (editingHabit) {
        // Update existing habit
        await habitService.update(editingHabit._id, habitData);
        toast.success('Habit updated successfully!');
      } else {
        // Create new habit
        await habitService.create(habitData);
        toast.success('Habit created successfully!');
      }
      await fetchDashboardData();
      setIsHabitModalOpen(false);
      setEditingHabit(null);
    } catch (err) {
      console.error('Failed to save habit:', err);
      toast.error('Failed to save habit. Please try again.');
      throw err; // Re-throw to let the modal handle the error
    }
  };

  // Delete habit
  const handleDeleteClick = (habit, e) => {
    e.stopPropagation(); // Prevent toggle when clicking delete
    e.preventDefault(); // Prevent any default behavior
    setHabitToDelete(habit);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!habitToDelete) return;

    try {
      await habitService.delete(habitToDelete._id);
      toast.success('Habit deleted successfully!');
      await fetchDashboardData();
      setIsDeleteModalOpen(false);
      setHabitToDelete(null);
    } catch (err) {
      console.error('Failed to delete habit:', err);
      toast.error('Failed to delete habit. Please try again.');
      setError('Failed to delete habit');
    }
  };



  const completedCount = habits.filter(h => isCompletedToday(h)).length;
  const totalXP = user?.gamification?.points || 0;
  const level = user?.gamification?.level || 1;
  const xpForNextLevel = Math.pow(level, 2) * 100 - Math.pow(level - 1, 2) * 100;
  const pointsInLevel = totalXP - Math.pow(level - 1, 2) * 100;
  const xpProgress = (pointsInLevel / xpForNextLevel) * 100;

  // Get weekly progress from analytics data
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekProgress = weeklyData?.habits?.dailyBreakdown
    ? weeklyData.habits.dailyBreakdown.map(day => day.completionRate)
    : [0, 0, 0, 0, 0, 0, 0];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            {getGreeting()}, <span className="gradient-text">{user?.username || 'User'}</span>! 👋
          </h1>
          <p className="text-gray-400">
            {habits.length > 0
              ? `Let's make today count. You have ${habits.length - completedCount} habits left.`
              : 'Start by adding your first habit!'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

          {/* Level Card */}
          <Link to="/levels" className="glass rounded-2xl p-5 hover:bg-white/10 transition-all cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-2xl">
                🏆
              </div>
              <div>
                <p className="text-gray-400 text-sm">Level</p>
                <p className="text-2xl font-bold text-white">{level}</p>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">{Math.max(0, xpForNextLevel - pointsInLevel)} XP to next level</p>
          </Link>

          {/* Streak Card */}
          <Link to="/streaks" className="glass rounded-2xl p-5 hover:bg-white/10 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-2xl">
                🔥
              </div>
              <div>
                <p className="text-gray-400 text-sm">Best Streak</p>
                <p className="text-2xl font-bold text-white">{user?.gamification?.longestStreak || 0} days</p>
              </div>
            </div>
          </Link>

          {/* Completed Today */}
          <div className="glass rounded-2xl p-5 hover:bg-white/10 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-2xl">
                ✅
              </div>
              <div>
                <p className="text-gray-400 text-sm">Completed Today</p>
                <p className="text-2xl font-bold text-white">{completedCount}/{habits.length}</p>
              </div>
            </div>
          </div>

          {/* Total Habits */}
          <div className="glass rounded-2xl p-5 hover:bg-white/10 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-2xl">
                📊
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Habits</p>
                <p className="text-2xl font-bold text-white">{habits.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Habit Tracker */}
        <div className="mb-8">
          <MonthlyHabitTracker habits={habits} />
        </div>

        {/* Habits and Sidebar Row */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Habits List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white">Today's Habits</h2>
                <Link to="/habits" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
                  View All →
                </Link>
              </div>
              <button
                onClick={handleCreateHabit}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Habit
              </button>
            </div>

            {habits.length === 0 ? (
              <div className="glass rounded-xl p-8 text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-white mb-2">No habits yet</h3>
                <p className="text-gray-400 mb-4">Start building your routine by adding your first habit!</p>
                <button
                  onClick={handleCreateHabit}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors"
                >
                  Create Your First Habit
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {habits.map((habit) => {
                  const completed = isCompletedToday(habit);
                  return (
                  <div
                    key={habit._id}
                    className={`glass rounded-xl p-4 flex items-center gap-4 transition-all cursor-pointer hover:bg-white/10 ${
                      completed ? 'border border-green-500/30' : ''
                    }`}
                    onClick={() => toggleHabit(habit._id, completed)}
                  >
                    {/* Checkbox */}
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                      completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-white/30 hover:border-primary-500'
                    }`}>
                      {completed && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">
                      {habit.icon || '📌'}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className={`font-medium transition-all ${
                        completed ? 'text-gray-400 line-through' : 'text-white'
                      }`}>
                        {habit.title || habit.name}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize">{habit.category}</p>
                    </div>

                    {/* Streak */}
                    <div className="flex items-center gap-1 px-3 py-1 bg-white/5 rounded-lg">
                      <span className="text-orange-400">🔥</span>
                      <span className="text-white font-medium">{habit.stats?.currentStreak || 0}</span>
                    </div>

                    {/* XP */}
                    <div className="text-primary-400 font-medium">
                      +10 XP
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleEditHabit(habit, e)}
                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                        title="Edit habit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => handleDeleteClick(habit, e)}
                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete habit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weekly Progress */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-lg font-bold text-white mb-4">Weekly Progress</h3>
              <div className="flex items-end justify-between gap-2 h-32">
                {weekDays.map((day, i) => (
                  <div key={day} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-white/10 rounded-full flex-1 relative overflow-hidden">
                      <div
                        className={`absolute bottom-0 left-0 right-0 rounded-full transition-all duration-500 ${
                          weekProgress[i] === 100
                            ? 'bg-gradient-to-t from-green-500 to-emerald-400'
                            : 'bg-gradient-to-t from-primary-600 to-primary-400'
                        }`}
                        style={{ height: `${weekProgress[i]}%` }}
                      />
                    </div>
                    <span className={`text-xs ${i === 6 ? 'text-primary-400 font-medium' : 'text-gray-500'}`}>
                      {day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-lg font-bold text-white mb-4">Recent Achievements</h3>
              <div className="space-y-3">
                {user?.gamification?.badges && user.gamification.badges.length > 0 ? (
                  user.gamification.badges.slice(0, 3).map((badge, i) => (
                    <div key={badge._id || i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-xl">
                        {badge.icon || '🌟'}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{badge.name}</p>
                        {badge.description && (
                          <p className="text-gray-500 text-xs">{badge.description}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl opacity-50">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xl">
                        🔒
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">Early Bird</p>
                        <p className="text-gray-500 text-xs">Complete a habit before 7 AM</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl opacity-50">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xl">
                        🔒
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">Perfect Week</p>
                        <p className="text-gray-500 text-xs">Complete all habits for 7 days</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Section - Full Width */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">Upcoming Tasks</h2>
              <Link to="/tasks" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
                View All →
              </Link>
            </div>
          </div>

          {tasks.length === 0 ? (
            <div className="glass rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">📋</div>
              <p className="text-gray-400">No active tasks</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {tasks
                .sort((a, b) => {
                  // Sort by due date (earliest first)
                  if (a.dueDate && b.dueDate) {
                    return new Date(a.dueDate) - new Date(b.dueDate);
                  }
                  if (a.dueDate) return -1;
                  if (b.dueDate) return 1;
                  return 0;
                })
                .slice(0, 6)
                .map((task) => {
                  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
                  const isOverdue = dueDate && dueDate < new Date();
                  const daysUntilDue = dueDate ? Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24)) : null;

                  return (
                    <Link
                      key={task._id}
                      to="/tasks"
                      className={`glass rounded-xl p-4 flex items-center gap-4 hover:bg-white/10 transition-all ${
                        isOverdue ? 'border border-red-500/30' : ''
                      }`}
                    >
                      {/* Priority Dot */}
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        task.priority === 'urgent' ? 'bg-red-500' :
                        task.priority === 'high' ? 'bg-orange-500' :
                        task.priority === 'medium' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`} />

                      {/* Task Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white truncate">{task.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-500 capitalize">{task.category}</p>
                          {dueDate && (
                            <>
                              <span className="text-gray-600">•</span>
                              <p className={`text-xs font-medium ${
                                isOverdue ? 'text-red-400' :
                                daysUntilDue === 0 ? 'text-orange-400' :
                                daysUntilDue <= 2 ? 'text-yellow-400' :
                                'text-gray-400'
                              }`}>
                                {isOverdue ? 'Overdue' :
                                 daysUntilDue === 0 ? 'Today' :
                                 daysUntilDue === 1 ? 'Tomorrow' :
                                 `${daysUntilDue}d`}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <HabitModal
        isOpen={isHabitModalOpen}
        onClose={() => {
          setIsHabitModalOpen(false);
          setEditingHabit(null);
        }}
        onSave={handleSaveHabit}
        habit={editingHabit}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setHabitToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Habit?"
        message={`Are you sure you want to delete "${habitToDelete?.title || habitToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
};

export default DashboardPage;
