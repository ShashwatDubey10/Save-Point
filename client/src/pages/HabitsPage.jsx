import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { habitService } from '../services/habitService';
import HabitModal from '../components/HabitModal';
import ConfirmationModal from '../components/ConfirmationModal';

const HabitsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  // Modal states
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState(null);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const data = await habitService.getAll();
      setHabits(data.habits || []);
    } catch (err) {
      setError('Failed to load habits');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleHabit = async (id, completed) => {
    try {
      if (completed) {
        await habitService.uncomplete(id);
      } else {
        await habitService.complete(id);
      }
      fetchHabits();
    } catch (err) {
      console.error('Failed to toggle habit:', err);
    }
  };

  const handleCreateHabit = () => {
    setEditingHabit(null);
    setIsHabitModalOpen(true);
  };

  const handleEditHabit = (habit, e) => {
    e.stopPropagation();
    setEditingHabit(habit);
    setIsHabitModalOpen(true);
  };

  const handleSaveHabit = async (habitData) => {
    try {
      if (editingHabit) {
        await habitService.update(editingHabit._id, habitData);
      } else {
        await habitService.create(habitData);
      }
      fetchHabits();
      setIsHabitModalOpen(false);
      setEditingHabit(null);
    } catch (err) {
      console.error('Failed to save habit:', err);
      throw err;
    }
  };

  const handleDeleteClick = (habit, e) => {
    e.stopPropagation();
    setHabitToDelete(habit);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!habitToDelete) return;

    try {
      await habitService.delete(habitToDelete._id);
      fetchHabits();
      setHabitToDelete(null);
    } catch (err) {
      console.error('Failed to delete habit:', err);
      setError('Failed to delete habit');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Get unique categories
  const categories = ['all', ...new Set(habits.map(h => h.category).filter(Boolean))];

  // Filter habits by category
  const filteredHabits = filterCategory === 'all'
    ? habits
    : habits.filter(h => h.category === filterCategory);

  // Group habits by category for display
  const groupedHabits = filteredHabits.reduce((acc, habit) => {
    const category = habit.category || 'Uncategorized';
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
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/dashboard" className="flex items-center">
              <img src="/SavePointLogo.png" alt="Save Point" className="h-10" />
            </Link>

            <div className="flex items-center gap-6">
              <Link to="/dashboard" className="text-gray-400 hover:text-white text-sm transition-colors">
                Dashboard
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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

        {/* Filters and Stats */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-4 py-2 rounded-xl transition-all ${
                  filterCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={handleCreateHabit}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Habit
          </button>
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
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedHabits).map(([category, categoryHabits]) => (
              <div key={category}>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-2xl">
                    {category === 'Health' && '💪'}
                    {category === 'Productivity' && '🎯'}
                    {category === 'Learning' && '📚'}
                    {category === 'Mindfulness' && '🧘'}
                    {category === 'Social' && '👥'}
                    {category === 'Uncategorized' && '📌'}
                  </span>
                  {category} ({categoryHabits.length})
                </h2>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {categoryHabits.map((habit) => (
                    <div
                      key={habit._id}
                      className={`glass rounded-xl p-5 transition-all cursor-pointer hover:bg-white/10 ${
                        habit.completedToday ? 'border border-green-500/30' : ''
                      }`}
                      onClick={() => toggleHabit(habit._id, habit.completedToday)}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
                            habit.completedToday
                              ? 'bg-green-500 border-green-500'
                              : 'border-white/30 hover:border-primary-500'
                          }`}>
                            {habit.completedToday && (
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
                        habit.completedToday ? 'text-gray-400 line-through' : 'text-white'
                      }`}>
                        {habit.name}
                      </h3>
                      {habit.description && (
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{habit.description}</p>
                      )}

                      {/* Stats */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2">
                          <span className="text-orange-400">🔥</span>
                          <span className="text-white font-medium">{habit.streak?.current || 0} day streak</span>
                        </div>
                        <div className="text-primary-400 font-medium">
                          +{habit.xpReward || 10} XP
                        </div>
                      </div>

                      {/* Frequency */}
                      {habit.frequency && (
                        <div className="mt-3 text-xs text-gray-500">
                          {habit.frequency.type === 'daily' && 'Daily'}
                          {habit.frequency.type === 'weekly' && `${habit.frequency.daysPerWeek || 0} times per week`}
                          {habit.frequency.type === 'custom' && 'Custom schedule'}
                        </div>
                      )}
                    </div>
                  ))}
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
        message={`Are you sure you want to delete "${habitToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
};

export default HabitsPage;
