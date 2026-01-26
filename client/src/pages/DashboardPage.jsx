import { useState, useEffect, useMemo, useCallback } from 'react';
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
import DraggableHabitList from '../components/DraggableHabitList';
import { PageContainer, MainContent, ErrorMessage, LoadingSpinner, EmptyState } from '../utils/pageLayout';

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

  const fetchDashboardData = useCallback(async () => {
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
  }, []);

  const fetchHabits = useCallback(async () => {
    try {
      const data = await habitService.getAll();
      setHabits(data.data || []);
    } catch (err) {
      setError('Failed to load habits');
      console.error(err);
    }
  }, []);

  // Check if habit is completed today (same as HabitsPage)
  const isCompletedToday = useCallback((habit) => {
    if (!habit || !habit.completions || habit.completions.length === 0) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastCompletionData = habit.completions[habit.completions.length - 1];
    if (!lastCompletionData || !lastCompletionData.date) {
      return false;
    }

    const lastCompletion = new Date(lastCompletionData.date);
    lastCompletion.setHours(0, 0, 0, 0);

    return lastCompletion.getTime() === today.getTime();
  }, []);

  const toggleHabit = useCallback(async (id, completed) => {
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
  }, []);

  // Edit habit
  const handleEditHabit = useCallback((habit, e) => {
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
  }, [fetchDashboardData]);

  // Delete habit
  const handleDeleteClick = useCallback((habit, e) => {
    e.stopPropagation(); // Prevent toggle when clicking delete
    e.preventDefault(); // Prevent any default behavior
    setHabitToDelete(habit);
    setIsDeleteModalOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
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
  }, [fetchDashboardData, habitToDelete]);

  // Reorder habits
  const handleReorder = useCallback(async (reorderedHabits) => {
    // Optimistically update UI
    setHabits(reorderedHabits);

    try {
      // Extract habit IDs in new order
      const habitIds = reorderedHabits.map(habit => habit._id);

      // Persist order to backend
      await habitService.reorder(habitIds);
    } catch (err) {
      console.error('Failed to reorder habits:', err);
      toast.error('Failed to save habit order. Please try again.');

      // Revert on error
      await fetchHabits();
    }
  }, [fetchHabits]);

  // Memoize expensive computations
  const completedCount = useMemo(() => 
    habits.filter(h => isCompletedToday(h)).length,
    [habits, isCompletedToday]
  );

  // Memoize gamification calculations
  const { totalXP, level, xpForNextLevel, pointsInLevel, xpProgress } = useMemo(() => {
    const totalXP = user?.gamification?.points || 0;
    const level = user?.gamification?.level || 1;
    const xpForNextLevel = Math.pow(level, 2) * 100 - Math.pow(level - 1, 2) * 100;
    const pointsInLevel = totalXP - Math.pow(level - 1, 2) * 100;
    const xpProgress = (pointsInLevel / xpForNextLevel) * 100;
    return { totalXP, level, xpForNextLevel, pointsInLevel, xpProgress };
  }, [user?.gamification?.points, user?.gamification?.level]);

  // Helper to get YYYY-MM-DD string from a date (consistent with HabitTrackingPage)
  const getDateString = useCallback((date, useUTC = false) => {
    if (useUTC) {
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } else {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }, []);

  // Check if habit is completed for a specific date
  const isCompletedForDate = useCallback((habit, date) => {
    const targetDateString = getDateString(date);

    // Check if habit was created after this date
    const habitCreatedDate = new Date(habit.createdAt);
    habitCreatedDate.setHours(0, 0, 0, 0);
    if (habitCreatedDate > date) {
      return false; // Not applicable
    }

    if (!habit.completions || habit.completions.length === 0) {
      return false;
    }

    // Compare dates by their YYYY-MM-DD string representation
    const completion = habit.completions.find(c => {
      const completionDate = new Date(c.date);
      const completionDateString = getDateString(completionDate, true);
      return completionDateString === targetDateString;
    });

    return completion ? true : false;
  };

  // Week days labels (Monday to Sunday)
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Calculate weekly progress from habits (fallback if API data unavailable)
  const calculateWeeklyProgress = () => {
    if (habits.length === 0) {
      return [0, 0, 0, 0, 0, 0, 0];
    }

    // Get current week (Monday to Sunday)
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to Monday-based (0-6)
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - daysFromMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const weekProgress = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      day.setHours(0, 0, 0, 0);

      // Count completions for this day
      let completedCount = 0;
      habits.forEach(habit => {
        if (isCompletedForDate(habit, day)) {
          completedCount++;
        }
      });

      // Calculate completion rate as percentage
      const completionRate = habits.length > 0 
        ? Math.round((completedCount / habits.length) * 100)
        : 0;

      weekProgress.push(completionRate);
    }

    return weekProgress;
  }, [habits, isCompletedForDate]);

  // Get weekly progress from analytics data or calculate from habits
  const weekProgress = useMemo(() => {
    let progress = [0, 0, 0, 0, 0, 0, 0];

    if (weeklyData?.habits?.dailyBreakdown && weeklyData.habits.dailyBreakdown.length === 7) {
      // Use API data if available and properly formatted
      // Backend returns Sunday-Saturday, but we need Monday-Sunday
      // So we need to reorder: take last day (Sun) and put it first, then Mon-Sat
      const apiData = weeklyData.habits.dailyBreakdown;
      const reorderedData = [
        ...apiData.slice(1), // Mon-Sat
        apiData[0]           // Sun (moved to end)
      ];
      progress = reorderedData.map(day => day.completionRate || 0);
    } else {
      // Fallback: calculate from habits directly
      progress = calculateWeeklyProgress();
    }
    return progress;
  }, [weeklyData, calculateWeeklyProgress]);

  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Memoize sorted tasks
  const sortedTasks = useMemo(() => {
    return tasks
      .sort((a, b) => {
        // Sort by due date (earliest first)
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return 0;
      })
      .slice(0, 6);
  }, [tasks]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <PageContainer>
      <AppHeader />
      <AppNavigation />

      <MainContent>
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
            {getGreeting()}, <span className="gradient-text">{user?.username || 'User'}</span>! 👋
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            {habits.length > 0
              ? `Let's make today count. You have ${habits.length - completedCount} habits left.`
              : 'Start by adding your first habit!'}
          </p>
        </div>

        <ErrorMessage message={error} />

        {/* Stats Grid - Compact on mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">

          {/* Level Card */}
          <Link to="/levels" className="glass rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 hover:bg-white/10 transition-all cursor-pointer">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-xl sm:text-2xl">
                🏆
              </div>
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Level</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{level}</p>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 sm:h-2">
              <div
                className="bg-gradient-to-r from-yellow-500 to-orange-500 h-1.5 sm:h-2 rounded-full transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 sm:mt-2">{Math.max(0, xpForNextLevel - pointsInLevel)} XP</p>
          </Link>

          {/* Streak Card */}
          <Link to="/streaks" className="glass rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 hover:bg-white/10 transition-all cursor-pointer">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-xl sm:text-2xl">
                🔥
              </div>
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Streak</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{user?.gamification?.longestStreak || 0}</p>
              </div>
            </div>
          </Link>

          {/* Completed Today */}
          <div className="glass rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 hover:bg-white/10 transition-all">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-xl sm:text-2xl">
                ✅
              </div>
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Done</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{completedCount}/{habits.length}</p>
              </div>
            </div>
          </div>

          {/* Total Habits */}
          <div className="glass rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 hover:bg-white/10 transition-all">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-xl sm:text-2xl">
                📊
              </div>
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Total</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{habits.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Habit Tracker */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg sm:text-xl font-bold text-white">Habit Tracking</h2>
            <Link
              to="/habit-tracking"
              className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base"
            >
              <span>View Full Dashboard</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <MonthlyHabitTracker habits={habits} />
        </div>

        {/* Habits and Sidebar Row */}
        <div className="grid lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          {/* Habits List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <h2 className="text-lg sm:text-xl font-bold text-white">Today's Habits</h2>
                <Link to="/habits" className="text-xs sm:text-sm text-primary-400 hover:text-primary-300 transition-colors">
                  View All →
                </Link>
              </div>
              <button
                onClick={handleCreateHabit}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Add Habit</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>

            {habits.length === 0 ? (
              <EmptyState
                icon="🎯"
                title="No habits yet"
                description="Start building your routine by adding your first habit!"
                actionLabel="Create Your First Habit"
                actionOnClick={handleCreateHabit}
              />
            ) : (
              <DraggableHabitList
                habits={habits}
                onReorder={handleReorder}
                onToggle={toggleHabit}
                onEdit={handleEditHabit}
                onDelete={handleDeleteClick}
                isCompletedToday={isCompletedToday}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            {/* Weekly Progress */}
            <div className="glass rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">Weekly Progress</h3>
              {habits.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">No habits to track</p>
                  <p className="text-gray-600 text-xs mt-1">Add habits to see your weekly progress</p>
                </div>
              ) : (
                <div className="flex items-end justify-between gap-1.5 sm:gap-2 h-32 sm:h-36">
                  {weekDays.map((day, i) => {
                    const progress = weekProgress[i] || 0;
                    const isToday = (() => {
                      const today = new Date();
                      const dayOfWeek = today.getDay();
                      const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                      return i === daysFromMonday;
                    })();
                    
                    return (
                      <div key={day} className="flex-1 flex flex-col items-center gap-1.5 sm:gap-2 min-w-0">
                        <div className="w-full bg-white/10 rounded-full flex-1 relative overflow-hidden min-h-[60px]">
                          <div
                            className={`absolute bottom-0 left-0 right-0 rounded-full transition-all duration-500 ${
                              progress === 100
                                ? 'bg-gradient-to-t from-green-500 to-emerald-400'
                                : progress > 0
                                ? 'bg-gradient-to-t from-primary-600 to-primary-400'
                                : 'bg-white/5'
                            }`}
                            style={{ 
                              height: `${Math.max(progress, 2)}%`, // Minimum 2% height for visibility
                              minHeight: progress > 0 ? '4px' : '0px'
                            }}
                            title={`${day}: ${progress}%`}
                          />
                          {/* Progress percentage label on bar */}
                          {progress > 0 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-[8px] sm:text-[10px] font-bold text-white drop-shadow-sm">
                                {progress}%
                              </span>
                            </div>
                          )}
                        </div>
                        <span className={`text-[10px] sm:text-xs font-medium ${
                          isToday 
                            ? 'text-primary-400 font-bold' 
                            : 'text-gray-500'
                        }`}>
                          {day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
              {/* Weekly Summary */}
              {habits.length > 0 && (
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-gray-400">Week Average</span>
                    <span className="text-white font-semibold">
                      {Math.round(weekProgress.reduce((sum, val) => sum + val, 0) / 7)}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Achievements */}
            <div className="glass rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">Recent Achievements</h3>
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
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <h2 className="text-lg sm:text-xl font-bold text-white">Upcoming Tasks</h2>
              <Link to="/tasks" className="text-xs sm:text-sm text-primary-400 hover:text-primary-300 transition-colors">
                View All →
              </Link>
            </div>
          </div>

          {tasks.length === 0 ? (
            <EmptyState
              icon="📋"
              title="No active tasks"
              actionLabel="View All Tasks"
              actionLink="/tasks"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {sortedTasks.map((task) => {
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
      </MainContent>

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
    </PageContainer>
  );
};

export default DashboardPage;
