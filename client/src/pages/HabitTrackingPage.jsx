import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { habitService } from '../services/habitService';
import AppHeader from '../components/AppHeader';
import AppNavigation from '../components/AppNavigation';

const HabitTrackingPage = () => {
  const { refreshUser } = useAuth();
  const [habits, setHabits] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'week'

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await habitService.getAll();
      setHabits(response.data || []);
    } catch (err) {
      setError('Failed to load habits');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get days in current month
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const currentDay = new Date().getDate();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const isCurrentMonth =
    currentDate.getMonth() === currentMonth &&
    currentDate.getFullYear() === currentYear;

  // Get month name
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthName = monthNames[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  // Helper to get YYYY-MM-DD string from a date (local timezone)
  const getDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Check if habit is completed for a specific date
  const isCompletedForDate = (habit, day) => {
    const targetDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const targetDateString = getDateString(targetDate);

    // Check if habit was created after this date
    const habitCreatedDate = new Date(habit.createdAt);
    habitCreatedDate.setHours(0, 0, 0, 0);
    if (habitCreatedDate > targetDate) {
      return null; // Not applicable
    }

    if (!habit.completions || habit.completions.length === 0) {
      return false;
    }

    // Compare dates by their YYYY-MM-DD string representation to avoid timezone issues
    const completion = habit.completions.find(c => {
      const completionDate = new Date(c.date);
      const completionDateString = getDateString(completionDate);
      return completionDateString === targetDateString;
    });

    return completion ? true : false;
  };

  // Toggle habit completion for a specific date
  const toggleHabitForDate = async (habit, day) => {
    const targetDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    targetDate.setHours(0, 0, 0, 0);

    // Check if habit was created after this date
    const habitCreatedDate = new Date(habit.createdAt);
    habitCreatedDate.setHours(0, 0, 0, 0);
    if (habitCreatedDate > targetDate) {
      toast.error('Habit did not exist on this date');
      return;
    }

    const isCompleted = isCompletedForDate(habit, day);
    // Use local date string, not UTC (toISOString gives UTC which can shift the date)
    const dateString = getDateString(targetDate);

    try {
      if (isCompleted) {
        await habitService.uncompleteForDate(habit._id, dateString);
        toast.success(`${habit.title || habit.name} marked as incomplete for ${targetDate.toLocaleDateString()}`);
      } else {
        await habitService.completeForDate(habit._id, dateString);
        toast.success(`${habit.title || habit.name} marked as complete for ${targetDate.toLocaleDateString()}`);
      }
      
      // Refresh habits and user data
      await Promise.all([
        fetchHabits(),
        refreshUser()
      ]);
    } catch (err) {
      console.error('Failed to toggle habit:', err);
      toast.error('Failed to update habit. Please try again.');
    }
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
  };

  const getStatusColor = (isCompleted, day, habit) => {
    const targetDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const habitCreatedDate = new Date(habit.createdAt);
    habitCreatedDate.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    if (habitCreatedDate > targetDate) {
      return 'bg-blue-500/20 cursor-not-allowed'; // Not applicable
    }

    // Current day special handling
    if (isCurrentMonth && day === currentDay) {
      if (isCompleted) {
        return 'bg-emerald-400 shadow-emerald-400/60 shadow-lg cursor-pointer hover:scale-110 ring-2 ring-emerald-300';
      } else {
        return 'bg-amber-500/50 cursor-pointer hover:scale-110 ring-2 ring-amber-400/50';
      }
    }

    // Future dates
    if (isCurrentMonth && day > currentDay) {
      return 'bg-dark-700/50 cursor-not-allowed';
    }

    // Completed (past days)
    if (isCompleted) {
      return 'bg-emerald-500 shadow-emerald-500/50 shadow-sm cursor-pointer hover:scale-110';
    }

    // Missed (past days)
    return 'bg-rose-500/70 cursor-pointer hover:scale-110';
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
      <main className="pt-14 sm:pt-20 lg:pt-32 pb-16 lg:pb-12 px-2 sm:px-4 lg:px-6 w-full sm:max-w-7xl sm:mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                Habit Tracking Dashboard 📊
              </h1>
              <p className="text-sm sm:text-base text-gray-400">
                Track and manage your habits across dates
              </p>
            </div>
            <Link
              to="/habits"
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors text-sm sm:text-base"
            >
              Manage Habits →
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
            {error}
          </div>
        )}

        {/* Calendar Controls */}
        <div className="glass rounded-xl p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {monthName} {year}
                </h2>
                {!isCurrentMonth && (
                  <button
                    onClick={goToCurrentMonth}
                    className="mt-2 px-3 py-1 text-xs bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors"
                  >
                    Go to Today
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={goToPreviousMonth}
                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                title="Previous month"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goToNextMonth}
                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                title="Next month"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/10 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-sm text-gray-400">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/70" />
              <span className="text-sm text-gray-400">Missed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500/50" />
              <span className="text-sm text-gray-400">Today (Pending)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-dark-700/50" />
              <span className="text-sm text-gray-400">Future</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500/20" />
              <span className="text-sm text-gray-400">Not Created</span>
            </div>
          </div>
        </div>

        {/* Habit Tracking Table */}
        {habits.length === 0 ? (
          <div className="glass rounded-xl p-8 text-center">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-white mb-2">No habits to track</h3>
            <p className="text-gray-400 mb-4">Add some habits to start tracking!</p>
            <Link
              to="/habits"
              className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors"
            >
              Add Habits
            </Link>
          </div>
        ) : (
          <div className="glass rounded-xl p-4 sm:p-6 overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr>
                  <th className="text-left text-sm font-semibold text-gray-300 pb-4 pr-4 min-w-[180px] sticky left-0 bg-dark-800/95 z-10">
                    Habit
                  </th>
                  {days.map((day) => (
                    <th
                      key={day}
                      className={`text-center text-xs font-medium pb-4 px-1 w-10 ${
                        isCurrentMonth && day === currentDay
                          ? 'text-primary-400 font-bold'
                          : 'text-gray-500'
                      }`}
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {habits.map((habit, habitIndex) => (
                  <tr key={habit._id || habitIndex} className="group">
                    <td className="py-3 pr-4 sticky left-0 bg-dark-800/95 z-10">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{habit.icon || '📌'}</span>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-white font-medium group-hover:text-primary-400 transition-colors block truncate">
                            {habit.title || habit.name}
                          </span>
                          {habit.category && (
                            <span className="text-xs text-gray-500 capitalize">
                              {habit.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    {days.map((day) => {
                      const isCompleted = isCompletedForDate(habit, day);
                      const isApplicable = isCompleted !== null;
                      const statusColor = isApplicable
                        ? getStatusColor(isCompleted, day, habit)
                        : 'bg-blue-500/20 cursor-not-allowed';

                      return (
                        <td key={day} className="py-3 px-1">
                          <div
                            className={`w-8 h-8 rounded-md mx-auto transition-all duration-200 flex items-center justify-center ${statusColor} ${
                              isCurrentMonth && day === currentDay
                                ? 'ring-2 ring-primary-400 ring-offset-2 ring-offset-dark-800'
                                : ''
                            }`}
                            onClick={() => {
                              if (isApplicable && (isCurrentMonth ? day <= currentDay : true)) {
                                toggleHabitForDate(habit, day);
                              }
                            }}
                            title={`${habit.title || habit.name} - ${monthName} ${day}, ${year}`}
                          >
                            {isCompleted && (
                              <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default HabitTrackingPage;
