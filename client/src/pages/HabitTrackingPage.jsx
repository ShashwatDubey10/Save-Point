import { useState, useEffect, useRef } from 'react';
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
  const [selectedDay, setSelectedDay] = useState(null);
  
  // Single scroll container ref for perfect synchronization
  const scrollContainerRef = useRef(null);

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

  // Helper to get YYYY-MM-DD string from a date
  // Uses UTC methods for dates from backend (stored as UTC) to ensure correct calendar date
  // Uses local methods for dates created locally (for display/UI)
  const getDateString = (date, useUTC = false) => {
    if (useUTC) {
      // For dates from backend (stored as UTC), extract UTC components
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } else {
      // For local dates (created in UI), use local components
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  };

  // Helper to create a date for a specific day in the current month
  const getDateForDay = (day) => {
    return new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
  };

  // Get days in current month
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Get current date info using the same logic
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

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

  // Fixed column widths for perfect alignment
  const HABIT_COLUMN_WIDTH = 200; // Fixed width for habit name column
  const DATE_COLUMN_WIDTH = 48; // Fixed width for each date column

  // Check if habit is completed for a specific date
  const isCompletedForDate = (habit, day) => {
    const targetDate = getDateForDay(day);
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
    // Use UTC for backend dates, local for UI dates
    const completion = habit.completions.find(c => {
      const completionDate = new Date(c.date);
      // Backend dates are stored as UTC, so extract UTC components
      const completionDateString = getDateString(completionDate, true);
      return completionDateString === targetDateString;
    });

    return completion ? true : false;
  };

  // Toggle habit completion for a specific date
  const toggleHabitForDate = async (habit, day) => {
    const targetDate = getDateForDay(day);
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
    setSelectedDay(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDay(null);
  };

  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
    setSelectedDay(null);
  };

  // Get status and styling for a date cell
  const getDateCellStatus = (habit, day) => {
    const targetDate = getDateForDay(day);
    const habitCreatedDate = new Date(habit.createdAt);
    habitCreatedDate.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    // Check if habit was created after this date
    if (habitCreatedDate > targetDate) {
      return {
        type: 'not-created',
        isCompleted: false,
        isClickable: false,
        className: 'bg-blue-500/20 cursor-not-allowed opacity-50'
      };
    }

    const isCompleted = isCompletedForDate(habit, day);
    const isToday = isCurrentMonth && day === currentDay;
    const isFuture = isCurrentMonth && day > currentDay;
    const isSelected = selectedDay === day;

    if (isToday) {
      return {
        type: 'today',
        isCompleted: isCompleted === true,
        isClickable: true,
        className: isCompleted
          ? 'bg-emerald-500 shadow-emerald-500/60 shadow-lg cursor-pointer hover:scale-110 ring-2 ring-emerald-300 ring-offset-2 ring-offset-dark-800'
          : 'bg-amber-500 shadow-amber-500/40 shadow-md cursor-pointer hover:scale-110 ring-2 ring-amber-400 ring-offset-2 ring-offset-dark-800'
      };
    }

    if (isFuture) {
      return {
        type: 'future',
        isCompleted: false,
        isClickable: false,
        className: 'bg-dark-700/50 cursor-not-allowed opacity-60'
      };
    }

    if (isSelected) {
      return {
        type: 'selected',
        isCompleted: isCompleted === true,
        isClickable: true,
        className: isCompleted
          ? 'bg-emerald-500 shadow-emerald-500/50 shadow-sm cursor-pointer hover:scale-110 ring-2 ring-primary-400 ring-offset-1 ring-offset-dark-800'
          : 'bg-rose-500/70 shadow-rose-500/30 shadow-sm cursor-pointer hover:scale-110 ring-2 ring-primary-400 ring-offset-1 ring-offset-dark-800'
      };
    }

    if (isCompleted) {
      return {
        type: 'completed',
        isCompleted: true,
        isClickable: true,
        className: 'bg-emerald-500 shadow-emerald-500/50 shadow-sm cursor-pointer hover:scale-110'
      };
    }

    return {
      type: 'missed',
      isCompleted: false,
      isClickable: true,
      className: 'bg-rose-500/70 cursor-pointer hover:scale-110'
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate total width for the grid
  const totalWidth = HABIT_COLUMN_WIDTH + (days.length * DATE_COLUMN_WIDTH);

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
              <div className="w-3 h-3 rounded-full bg-amber-500 ring-2 ring-amber-400" />
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
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary-400 ring-2 ring-primary-400" />
              <span className="text-sm text-gray-400">Selected</span>
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
          <div className="glass rounded-xl overflow-hidden">
            {/* Single Scroll Container - Perfect Synchronization */}
            <div
              ref={scrollContainerRef}
              className="habit-tracker-scrollbar overflow-x-auto overflow-y-auto max-h-[70vh]"
            >
              {/* Table with Exact Column Widths */}
              <table
                className="w-full"
                style={{
                  minWidth: `${totalWidth}px`,
                  tableLayout: 'fixed'
                }}
              >
                <colgroup>
                  <col style={{ width: `${HABIT_COLUMN_WIDTH}px` }} />
                  {days.map(() => (
                    <col key={`col-${Math.random()}`} style={{ width: `${DATE_COLUMN_WIDTH}px` }} />
                  ))}
                </colgroup>
                <thead>
                  <tr>
                    {/* Sticky Habit Name Header */}
                    <th
                      className="sticky left-0 z-30 bg-dark-800/98 backdrop-blur-sm px-4 py-4 border-b border-r border-white/10 text-left"
                      style={{
                        width: `${HABIT_COLUMN_WIDTH}px`
                      }}
                    >
                      <span className="text-sm font-semibold text-gray-300">Habit</span>
                    </th>
                    {/* Date Headers */}
                    {days.map((day) => {
                      const isToday = isCurrentMonth && day === currentDay;
                      const isSelected = selectedDay === day;
                      return (
                        <th
                          key={`header-${day}`}
                          className={`border-b border-white/10 text-center py-4 px-2 ${
                            isToday
                              ? 'text-primary-400 font-bold bg-primary-500/10'
                              : isSelected
                              ? 'text-primary-300 font-semibold bg-primary-500/20 ring-2 ring-primary-400/50'
                              : 'text-gray-500'
                          }`}
                          style={{
                            width: `${DATE_COLUMN_WIDTH}px`
                          }}
                        >
                          <span className="text-xs font-medium">{day}</span>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {habits.map((habit, habitIndex) => (
                    <tr
                      key={`habit-${habit._id || habitIndex}`}
                      className="group hover:bg-white/5 transition-colors"
                    >
                      {/* Sticky Habit Name Column */}
                      <td
                        className="sticky left-0 z-20 bg-dark-800/98 backdrop-blur-sm px-4 py-3 border-b border-r border-white/5"
                        style={{
                          width: `${HABIT_COLUMN_WIDTH}px`
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl shrink-0">{habit.icon || '📌'}</span>
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

                      {/* Date Cells */}
                      {days.map((day) => {
                        const cellStatus = getDateCellStatus(habit, day);
                        const isToday = isCurrentMonth && day === currentDay;
                        const isSelected = selectedDay === day;

                        return (
                          <td
                            key={`cell-${habit._id || habitIndex}-${day}`}
                            className={`border-b border-white/5 py-3 px-2 ${
                              isSelected ? 'bg-primary-500/10' : ''
                            }`}
                            style={{
                              width: `${DATE_COLUMN_WIDTH}px`
                            }}
                            onClick={() => {
                              if (cellStatus.isClickable) {
                                setSelectedDay(day);
                                toggleHabitForDate(habit, day);
                              }
                            }}
                            onMouseEnter={() => {
                              if (cellStatus.isClickable) {
                                setSelectedDay(day);
                              }
                            }}
                            title={`${habit.title || habit.name} - ${monthName} ${day}, ${year}${isToday ? ' (Today)' : ''}`}
                          >
                            <div className="flex items-center justify-center">
                              <div
                                className={`w-8 h-8 rounded-md transition-all duration-200 flex items-center justify-center ${cellStatus.className}`}
                              >
                                {cellStatus.isCompleted && (
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
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HabitTrackingPage;
