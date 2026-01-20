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
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'month'
  const [checkedCell, setCheckedCell] = useState(null); // For animation
  
  // Touch swipe handlers
  const swipeRefs = useRef({});
  const touchStartX = useRef({});
  const touchStartY = useRef({});

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
  const getDateString = (date, useUTC = false) => {
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
  };

  // Get dates for current view (week or month)
  const getDatesForView = () => {
    const now = new Date();
    const dates = [];
    
    if (viewMode === 'week') {
      // Show 7 days: 3 days before today, today, 3 days after
      const startDate = new Date(now);
      startDate.setDate(now.getDate() - 3);
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        dates.push(date);
      }
    } else {
      // Show current month
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      for (let i = 1; i <= daysInMonth; i++) {
        dates.push(new Date(year, month, i));
      }
    }
    
    return dates;
  };

  const dates = getDatesForView();
  
  // Get current date info
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

  // Check if habit is completed for a specific date
  const isCompletedForDate = (habit, date) => {
    const targetDateString = getDateString(date);

    // Check if habit was created after this date
    const habitCreatedDate = new Date(habit.createdAt);
    habitCreatedDate.setHours(0, 0, 0, 0);
    if (habitCreatedDate > date) {
      return null; // Not applicable
    }

    if (!habit.completions || habit.completions.length === 0) {
      return false;
    }

    const completion = habit.completions.find(c => {
      const completionDate = new Date(c.date);
      const completionDateString = getDateString(completionDate, true);
      return completionDateString === targetDateString;
    });

    return completion ? true : false;
  };

  // Toggle habit completion for a specific date
  const toggleHabitForDate = async (habit, date) => {
    date.setHours(0, 0, 0, 0);

    // Check if habit was created after this date
    const habitCreatedDate = new Date(habit.createdAt);
    habitCreatedDate.setHours(0, 0, 0, 0);
    if (habitCreatedDate > date) {
      toast.error('Habit did not exist on this date');
      return;
    }

    const isCompleted = isCompletedForDate(habit, date);
    const dateString = getDateString(date);

    try {
      // Set checked cell for animation
      const cellKey = `${habit._id}-${date.getTime()}`;
      setCheckedCell(cellKey);
      setTimeout(() => setCheckedCell(null), 300);

      if (isCompleted) {
        await habitService.uncompleteForDate(habit._id, dateString);
        toast.success(`${habit.title || habit.name} marked as incomplete`);
      } else {
        await habitService.completeForDate(habit._id, dateString);
        toast.success(`${habit.title || habit.name} marked as complete`);
      }
      
      await Promise.all([
        fetchHabits(),
        refreshUser()
      ]);
    } catch (err) {
      console.error('Failed to toggle habit:', err);
      toast.error('Failed to update habit. Please try again.');
    }
  };

  // Touch swipe handlers
  const handleTouchStart = (habitId, e) => {
    touchStartX.current[habitId] = e.touches[0].clientX;
    touchStartY.current[habitId] = e.touches[0].clientY;
  };

  const handleTouchMove = (habitId, e) => {
    if (!touchStartX.current[habitId]) return;
    
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    const deltaX = touchX - touchStartX.current[habitId];
    const deltaY = touchY - touchStartY.current[habitId];
    
    // Only prevent default if horizontal swipe
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (habitId, e) => {
    if (!touchStartX.current[habitId]) return;
    
    const touchX = e.changedTouches[0].clientX;
    const deltaX = touchX - touchStartX.current[habitId];
    const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY.current[habitId]);
    
    // Swipe threshold: 50px horizontal, less than 30px vertical
    if (Math.abs(deltaX) > 50 && deltaY < 30) {
      const scrollContainer = swipeRefs.current[habitId];
      if (scrollContainer) {
        const scrollAmount = deltaX > 0 ? -200 : 200;
        scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
    
    touchStartX.current[habitId] = null;
    touchStartY.current[habitId] = null;
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
  const getDateCellStatus = (habit, date) => {
    const habitCreatedDate = new Date(habit.createdAt);
    habitCreatedDate.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (habitCreatedDate > date) {
      return {
        type: 'not-created',
        isCompleted: false,
        isClickable: false,
        className: 'bg-blue-500/20 cursor-not-allowed opacity-50'
      };
    }

    const isCompleted = isCompletedForDate(habit, date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isToday = date.getTime() === today.getTime();
    const isFuture = date > today;
    const isSelected = selectedDay && date.getTime() === selectedDay.getTime();

    if (isToday) {
      return {
        type: 'today',
        isCompleted: isCompleted === true,
        isClickable: true,
        className: isCompleted
          ? 'bg-emerald-500 shadow-lg shadow-emerald-500/60 ring-2 ring-emerald-300 ring-offset-2 ring-offset-dark-800'
          : 'bg-amber-500 shadow-md shadow-amber-500/40 ring-2 ring-amber-400 ring-offset-2 ring-offset-dark-800'
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
          ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50 ring-2 ring-primary-400 ring-offset-1 ring-offset-dark-800'
          : 'bg-rose-500/70 shadow-sm shadow-rose-500/30 ring-2 ring-primary-400 ring-offset-1 ring-offset-dark-800'
      };
    }

    if (isCompleted) {
      return {
        type: 'completed',
        isCompleted: true,
        isClickable: true,
        className: 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
      };
    }

    return {
      type: 'missed',
      isCompleted: false,
      isClickable: true,
      className: 'bg-rose-500/70'
    };
  };

  // Format date for display
  const formatDateLabel = (date) => {
    const day = date.getDate();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = dayNames[date.getDay()];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isToday = date.getTime() === today.getTime();
    
    return { day, dayName, isToday };
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
      <main className="pt-14 sm:pt-20 lg:pt-32 pb-16 lg:pb-12 px-3 sm:px-4 lg:px-6 w-full sm:max-w-7xl sm:mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">
                Habit Dashboard 📊
              </h1>
              <p className="text-xs sm:text-sm text-gray-400">
                Track your habits day by day
              </p>
            </div>
            <Link
              to="/habits"
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg sm:rounded-xl transition-colors text-xs sm:text-sm"
            >
              Manage →
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/10 border border-red-500/30 rounded-lg sm:rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Calendar Controls - Mobile Optimized */}
        <div className="glass rounded-xl p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                  {viewMode === 'week' ? 'This Week' : `${monthName} ${year}`}
                </h2>
                {!isCurrentMonth && viewMode === 'month' && (
                  <button
                    onClick={goToCurrentMonth}
                    className="mt-1.5 sm:mt-2 px-2.5 py-1 text-xs bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors"
                  >
                    Go to Today
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-colors ${
                    viewMode === 'week'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setViewMode('month')}
                  className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-colors ${
                    viewMode === 'month'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Month
                </button>
              </div>

              {viewMode === 'month' && (
                <>
                  <button
                    onClick={goToPreviousMonth}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    title="Previous month"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={goToNextMonth}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    title="Next month"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Legend - Mobile Optimized */}
          <div className="flex items-center gap-3 sm:gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10 flex-wrap text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500" />
              <span className="text-gray-400">Done</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500/70" />
              <span className="text-gray-400">Missed</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500 ring-2 ring-amber-400" />
              <span className="text-gray-400">Today</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-dark-700/50" />
              <span className="text-gray-400">Future</span>
            </div>
          </div>
        </div>

        {/* Habit List - Mobile Optimized */}
        {habits.length === 0 ? (
          <div className="glass rounded-xl p-6 sm:p-8 text-center">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📅</div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">No habits to track</h3>
            <p className="text-gray-400 mb-4 text-sm sm:text-base">Add some habits to start tracking!</p>
            <Link
              to="/habits"
              className="inline-block px-5 py-2.5 sm:px-6 sm:py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors text-sm sm:text-base"
            >
              Add Habits
            </Link>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {habits.map((habit, habitIndex) => {
              const habitId = habit._id || habitIndex;
              return (
                <div
                  key={habitId}
                  className="glass rounded-xl overflow-hidden"
                >
                  {/* Fixed Habit Header */}
                  <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-white/10 bg-dark-800/50">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <span className="text-2xl sm:text-3xl flex-shrink-0">{habit.icon || '📌'}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-white truncate">
                          {habit.title || habit.name}
                        </h3>
                        {habit.category && (
                          <p className="text-xs sm:text-sm text-gray-500 capitalize mt-0.5">
                            {habit.category}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Swipeable Date Strip */}
                  <div
                    ref={(el) => (swipeRefs.current[habitId] = el)}
                    className="swipeable-container overflow-x-auto overflow-y-hidden"
                    onTouchStart={(e) => handleTouchStart(habitId, e)}
                    onTouchMove={(e) => handleTouchMove(habitId, e)}
                    onTouchEnd={(e) => handleTouchEnd(habitId, e)}
                  >
                    <div className="flex gap-2 sm:gap-3 px-4 py-3 sm:px-5 sm:py-4 min-w-max">
                      {dates.map((date, dateIndex) => {
                        const { day, dayName, isToday } = formatDateLabel(date);
                        const cellStatus = getDateCellStatus(habit, date);
                        const isSelected = selectedDay && date.getTime() === selectedDay.getTime();

                        return (
                          <div
                            key={`${habitId}-${date.getTime()}`}
                            className="flex flex-col items-center gap-1.5 sm:gap-2 flex-shrink-0"
                            style={{ minWidth: '64px' }}
                          >
                            {/* Date Label */}
                            <div className={`text-center w-full ${
                              isToday 
                                ? 'text-primary-400 font-bold' 
                                : isSelected
                                ? 'text-primary-300 font-semibold'
                                : 'text-gray-500'
                            }`}>
                              <div className="text-xs sm:text-sm font-medium">{dayName}</div>
                              <div className={`text-base sm:text-lg font-bold ${isToday ? 'text-primary-400' : ''}`}>
                                {day}
                              </div>
                            </div>

                            {/* Date Cell - Touch Friendly */}
                            <button
                              onClick={() => {
                                if (cellStatus.isClickable) {
                                  setSelectedDay(date);
                                  toggleHabitForDate(habit, date);
                                }
                              }}
                              disabled={!cellStatus.isClickable}
                              className={`
                                w-12 h-12 sm:w-14 sm:h-14 rounded-xl
                                flex items-center justify-center
                                transition-all duration-200
                                touch-manipulation
                                ${cellStatus.className}
                                ${cellStatus.isClickable 
                                  ? 'active:scale-95 cursor-pointer' 
                                  : 'cursor-not-allowed'
                                }
                                ${isSelected ? 'ring-2 ring-primary-400 ring-offset-2 ring-offset-dark-800' : ''}
                                ${checkedCell === `${habitId}-${date.getTime()}` ? 'habit-cell-checked' : ''}
                              `}
                              style={{
                                minWidth: '48px',
                                minHeight: '48px'
                              }}
                              aria-label={`${habit.title || habit.name} - ${dayName} ${day}`}
                            >
                              {cellStatus.isCompleted && (
                                <svg
                                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
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
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default HabitTrackingPage;
