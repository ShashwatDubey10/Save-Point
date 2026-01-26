import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { habitService } from '../services/habitService';
import AppHeader from '../components/AppHeader';
import AppNavigation from '../components/AppNavigation';

function HabitTrackingPage() {
  const location = useLocation();
  const { refreshUser } = useAuth();
  const [habits, setHabits] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  
  // Touch swipe handlers
  const swipeRefs = useRef({});
  const touchStartX = useRef({});
  const touchStartY = useRef({});

  const fetchHabits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await habitService.getAll();
      setHabits(response.data || []);
    } catch (err) {
      setError('Failed to load habits');
      console.error('Error fetching habits:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch habits on mount and when navigating to this page
  useEffect(() => {
    fetchHabits();
  }, [fetchHabits, location.pathname]);

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

  // Check if habit is completed for a specific date
  // Backend normalizes dates: when user sends "2024-01-26", backend creates UTC midnight for that calendar date
  // So we compare: local calendar date (what user sees) with UTC date string from backend (calendar date stored)
  const isCompletedForDate = (habit, day) => {
    const targetDate = getDateForDay(day);
    // Get the local calendar date the user sees (this is what we send to backend)
    const targetDateString = getDateString(targetDate, false); // Local calendar date

    // Check if habit was created after this date
    const habitCreatedDate = new Date(habit.createdAt);
    habitCreatedDate.setHours(0, 0, 0, 0);
    if (habitCreatedDate > targetDate) {
      return null; // Not applicable
    }

    if (!habit.completions || habit.completions.length === 0) {
      return false;
    }

    // Compare dates by their YYYY-MM-DD string representation
    // Backend stores dates as UTC midnight for the calendar date specified
    // When we retrieve, we extract UTC components to get the calendar date that was stored
    const completion = habit.completions.find(c => {
      const completionDate = new Date(c.date);
      // Backend stored this as UTC midnight for a specific calendar date
      // Extract UTC components to get that calendar date
      const completionDateString = getDateString(completionDate, true);
      // Compare with the local calendar date the user is viewing
      // They match if it's the same calendar day
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

    // Store previous state for rollback
    const previousHabitState = { ...habit };

    // Optimistic UI update - update immediately without waiting for server
    setHabits(prevHabits =>
      prevHabits.map(h => {
        if (h._id === habit._id) {
          const updatedHabit = { ...h };
          const targetDateString = getDateString(targetDate, false);
          
          if (isCompleted) {
            // Remove completion for this date
            updatedHabit.completions = (h.completions || []).filter(c => {
              const completionDate = new Date(c.date);
              const completionDateString = getDateString(completionDate, true);
              return completionDateString !== targetDateString;
            });
          } else {
            // Add completion for this date
            const completionDate = new Date(dateString + 'T00:00:00Z');
            updatedHabit.completions = [
              ...(h.completions || []),
              { date: completionDate.toISOString(), note: '', mood: null }
            ];
          }
          return updatedHabit;
        }
        return h;
      })
    );

    try {
      let response;
      if (isCompleted) {
        response = await habitService.uncompleteForDate(habit._id, dateString);
        toast.success(`${habit.title || habit.name} marked as incomplete`);
      } else {
        response = await habitService.completeForDate(habit._id, dateString);
        toast.success(`${habit.title || habit.name} marked as complete`);
      }

      // Update the specific habit with server response if available
      if (response?.data?.habit) {
        setHabits(prevHabits =>
          prevHabits.map(h =>
            h._id === habit._id ? response.data.habit : h
          )
        );
      }

      // Update user data in background without blocking UI
      // Fire and forget - don't await to prevent blocking
      refreshUser().catch(() => {
        // Silent fail - non-critical
      });
    } catch (err) {
      console.error('Failed to toggle habit:', err);
      toast.error('Failed to update habit. Please try again.');

      // Revert optimistic update on error
      setHabits(prevHabits =>
        prevHabits.map(h =>
          h._id === habit._id ? previousHabitState : h
        )
      );
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
  const formatDateLabel = (day) => {
    const date = getDateForDay(day);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = dayNames[date.getDay()];
    const isToday = isCurrentMonth && day === currentDay;
    
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

        {/* Habit List - Mobile Optimized */}
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
                    className="hide-scrollbar overflow-x-auto overflow-y-hidden"
                    onTouchStart={(e) => handleTouchStart(habitId, e)}
                    onTouchMove={(e) => handleTouchMove(habitId, e)}
                    onTouchEnd={(e) => handleTouchEnd(habitId, e)}
                  >
                    <div className="flex gap-2 sm:gap-3 px-4 py-3 sm:px-5 sm:py-4 min-w-max">
                      {days.map((day) => {
                        const { dayName, isToday } = formatDateLabel(day);
                        const cellStatus = getDateCellStatus(habit, day);
                        const isSelected = selectedDay === day;

                        return (
                          <div
                            key={`${habitId}-${day}`}
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
                                  setSelectedDay(day);
                                  toggleHabitForDate(habit, day);
                                }
                              }}
                              disabled={!cellStatus.isClickable}
                              className={`
                                w-12 h-12 sm:w-14 sm:h-14 rounded-xl
                                flex items-center justify-center
                                transition-all duration-200
                                ${cellStatus.className}
                                ${cellStatus.isClickable 
                                  ? 'active:scale-95 cursor-pointer' 
                                  : 'cursor-not-allowed'
                                }
                                ${isSelected ? 'ring-2 ring-primary-400 ring-offset-2 ring-offset-dark-800' : ''}
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
