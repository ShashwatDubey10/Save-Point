import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { habitService } from '../services/habitService';
import { analyticsService } from '../services/analyticsService';
import AppHeader from '../components/AppHeader';
import AppNavigation from '../components/AppNavigation';
import HabitModal from '../components/HabitModal';
import ConfirmationModal from '../components/ConfirmationModal';

const HabitsPage = () => {
  const { user, refreshUser } = useAuth();
  const [habits, setHabits] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent'); // recent, name, streak
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [habitsResponse, statsResponse] = await Promise.all([
        habitService.getAll(),
        habitService.getStats()
      ]);
      setHabits(habitsResponse.data || []);
      setStats(statsResponse.data || null);
    } catch (err) {
      setError('Failed to load habits');
      console.error(err);
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

  // Check if habit is completed today
  const isCompletedToday = (habit) => {
    if (!habit || !habit.completions || habit.completions.length === 0) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastCompletionData = habit.completions[habit.completions.length - 1];
    if (!lastCompletionData || !lastCompletionData.date) return false;

    const lastCompletion = new Date(lastCompletionData.date);
    lastCompletion.setHours(0, 0, 0, 0);

    return lastCompletion.getTime() === today.getTime();
  };

  const toggleHabit = async (id, completed) => {
    try {
      if (completed) {
        await habitService.uncomplete(id);
        toast.success('Habit marked as incomplete');
      } else {
        const response = await habitService.complete(id);
        const points = response.data?.points?.earned || 10;
        toast.success(`Habit completed! +${points} XP earned 🎉`);
      }
      // Refresh data and user info
      await Promise.all([
        fetchData(),
        refreshUser()
      ]);
    } catch (err) {
      console.error('Failed to toggle habit:', err);
      toast.error('Failed to update habit. Please try again.');
    }
  };

  const handleCreateHabit = () => {
    setEditingHabit(null);
    setIsHabitModalOpen(true);
  };

  const handleEditHabit = (habit, e) => {
    e.stopPropagation();
    e.preventDefault();
    setEditingHabit(habit);
    setIsHabitModalOpen(true);
  };

  const handleSaveHabit = async (habitData) => {
    try {
      if (editingHabit) {
        await habitService.update(editingHabit._id, habitData);
        toast.success('Habit updated successfully!');
      } else {
        await habitService.create(habitData);
        toast.success('Habit created successfully!');
      }
      fetchData();
      setIsHabitModalOpen(false);
      setEditingHabit(null);
    } catch (err) {
      console.error('Failed to save habit:', err);
      toast.error('Failed to save habit. Please try again.');
      throw err;
    }
  };

  const handleDeleteClick = (habit, e) => {
    e.stopPropagation();
    e.preventDefault();
    setHabitToDelete(habit);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!habitToDelete) return;

    try {
      await habitService.delete(habitToDelete._id);
      toast.success('Habit deleted successfully!');
      fetchData();
      setIsDeleteModalOpen(false);
      setHabitToDelete(null);
    } catch (err) {
      console.error('Failed to delete habit:', err);
      toast.error('Failed to delete habit. Please try again.');
      setError('Failed to delete habit');
    }
  };


  // Get unique categories from backend enum
  const allCategories = ['health', 'fitness', 'productivity', 'mindfulness', 'learning', 'social', 'creative', 'other'];
  const existingCategories = [...new Set(habits.map(h => h.category).filter(Boolean))];
  const categories = ['all', ...existingCategories];

  // Filter habits by category and search
  let filteredHabits = habits;

  if (filterCategory !== 'all') {
    filteredHabits = filteredHabits.filter(h => h.category === filterCategory);
  }

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredHabits = filteredHabits.filter(h =>
      (h.title || h.name || '').toLowerCase().includes(query) ||
      (h.description || '').toLowerCase().includes(query)
    );
  }

  // Sort habits
  const sortedHabits = [...filteredHabits].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.title || a.name || '').localeCompare(b.title || b.name || '');
      case 'streak':
        return (b.stats?.currentStreak || 0) - (a.stats?.currentStreak || 0);
      case 'recent':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  // Group habits by category for display
  const groupedHabits = sortedHabits.reduce((acc, habit) => {
    const category = habit.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(habit);
    return acc;
  }, {});

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
            All Habits 📚
          </h1>
          <p className="text-gray-400">
            Manage and track all your habits in one place
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
            {error}
          </div>
        )}

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-xl">
                  📊
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Habits</p>
                  <p className="text-2xl font-bold text-white">{stats.totalHabits}</p>
                </div>
              </div>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-xl">
                  ✅
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Completed Today</p>
                  <p className="text-2xl font-bold text-white">{stats.completedToday}</p>
                </div>
              </div>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-xl">
                  🔥
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Longest Streak</p>
                  <p className="text-2xl font-bold text-white">{stats.longestStreak} days</p>
                </div>
              </div>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl">
                  🎯
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Completions</p>
                  <p className="text-2xl font-bold text-white">{stats.totalCompletions}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Sort Controls */}
        <div className="mb-6 flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search habits..."
                className="w-full px-4 py-3 pl-11 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500 transition-colors"
          >
            <option value="recent" className="bg-dark-800">Most Recent</option>
            <option value="name" className="bg-dark-800">Name (A-Z)</option>
            <option value="streak" className="bg-dark-800">Highest Streak</option>
          </select>

          <button
            onClick={handleCreateHabit}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Habit
          </button>
        </div>

        {/* Category Filters */}
        <div className="mb-6 flex items-center gap-2 flex-wrap">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`px-4 py-2 rounded-xl transition-all capitalize ${
                filterCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {category === 'all' ? 'All' : category}
            </button>
          ))}
        </div>

        {/* Habits Grid */}
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
        ) : sortedHabits.length === 0 ? (
          <div className="glass rounded-xl p-8 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">No habits found</h3>
            <p className="text-gray-400 mb-4">
              {searchQuery ? 'Try a different search term' : 'Try selecting a different category'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedHabits).map(([category, categoryHabits]) => (
              <div key={category}>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2 capitalize">
                  <span className="text-2xl">
                    {category === 'health' && '💪'}
                    {category === 'fitness' && '🏃'}
                    {category === 'productivity' && '🎯'}
                    {category === 'learning' && '📚'}
                    {category === 'mindfulness' && '🧘'}
                    {category === 'social' && '👥'}
                    {category === 'creative' && '🎨'}
                    {category === 'other' && '📌'}
                  </span>
                  {category} ({categoryHabits.length})
                </h2>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {categoryHabits.map((habit) => {
                    const completed = isCompletedToday(habit);
                    return (
                      <div
                        key={habit._id}
                        className={`glass rounded-xl p-5 transition-all cursor-pointer hover:bg-white/10 ${
                          completed ? 'border border-green-500/30' : ''
                        }`}
                        onClick={() => toggleHabit(habit._id, completed)}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
                              completed
                                ? 'bg-green-500 border-green-500'
                                : 'border-white/30 hover:border-primary-500'
                            }`}>
                              {completed && (
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">
                              {habit.icon || '📌'}
                            </div>
                          </div>
                        <div className="flex items-center gap-1">
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

                        {/* Info */}
                        <h3 className={`font-bold text-lg mb-1 transition-all ${
                          completed ? 'text-gray-400 line-through' : 'text-white'
                        }`}>
                          {habit.title || habit.name}
                        </h3>
                        {habit.description && (
                          <p className="text-sm text-gray-500 mb-4 line-clamp-2">{habit.description}</p>
                        )}

                        {/* Stats */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <div className="flex items-center gap-2">
                            <span className="text-orange-400">🔥</span>
                            <span className="text-white font-medium">{habit.stats?.currentStreak || 0} day streak</span>
                          </div>
                          <div className="text-primary-400 font-medium">
                            +10 XP
                          </div>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                          <span className="capitalize">{habit.frequency || 'daily'}</span>
                          <span>{habit.stats?.totalCompletions || 0} total completions</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
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

export default HabitsPage;
