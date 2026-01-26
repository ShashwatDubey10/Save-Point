import { useState, useEffect, useMemo, memo } from 'react';

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

const MonthlyHabitTracker = memo(({ habits = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [stats, setStats] = useState({
    completionRate: 0,
    currentStreak: 0,
    totalXP: 0,
    badges: 0
  });

  // Create a serialized version of habits to detect changes properly
  const habitsKey = useMemo(() => {
    return habits.map(h => `${h._id}-${h.completions?.length || 0}`).join('|');
  }, [habits]);

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

  // Memoize completion status calculations
  const getCompletionStatus = useMemo(() => (habit, day) => {
    const targetDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    targetDate.setHours(0, 0, 0, 0);
    // Backend stores dates as UTC midnight, so compare using UTC date strings
    const targetDateString = getDateString(targetDate, true);

    // Check if habit was created after this date
    const habitCreatedDate = new Date(habit.createdAt);
    habitCreatedDate.setHours(0, 0, 0, 0);
    if (habitCreatedDate > targetDate) {
      return 2; // Not applicable (habit didn't exist yet)
    }

    // Handle missing completions array
    if (!habit.completions || habit.completions.length === 0) return 0;

    // Find if there's a completion for this date
    // Compare dates by their YYYY-MM-DD string representation
    // Backend dates are stored as UTC midnight, extract UTC date string
    const completion = habit.completions.find(c => {
      const completionDate = new Date(c.date);
      // Use UTC for backend dates
      const completionDateString = getDateString(completionDate, true);
      return completionDateString === targetDateString;
    });

    return completion ? 1 : 0;
  }, [currentDate]);

  const getStatusColor = useMemo(() => (status, day, habit) => {
    // Check if habit existed on this day
    const targetDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const habitCreatedDate = new Date(habit.createdAt);
    habitCreatedDate.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    // Check if habit was created after this day (not just same day)
    if (habitCreatedDate > targetDate) {
      return 'bg-blue-500/20 cursor-default'; // Not applicable - created after this date
    }

    // Current day special handling
    if (isCurrentMonth && day === currentDay) {
      if (status === 1) {
        // Completed today - bright green with special glow
        return 'bg-emerald-400 shadow-emerald-400/60 shadow-lg cursor-pointer hover:scale-110 ring-2 ring-emerald-300';
      } else {
        // Not completed yet today - amber/pending color
        return 'bg-amber-500/50 cursor-pointer hover:scale-110 ring-2 ring-amber-400/50';
      }
    }

    // Future dates
    if (isCurrentMonth && day > currentDay) {
      return 'bg-dark-700/50 cursor-default';
    }

    // Completed (past days)
    if (status === 1) {
      return 'bg-emerald-500 shadow-emerald-500/50 shadow-sm cursor-pointer hover:scale-110';
    }

    // Missed (past days)
    return 'bg-rose-500/70 cursor-pointer hover:scale-110';
  }, [currentDate, currentDay, isCurrentMonth]);

  // Calculate stats
  useEffect(() => {
    if (habits.length === 0) {
      setStats({
        completionRate: 0,
        currentStreak: 0,
        totalXP: 0,
        badges: 0
      });
      return;
    }

    let totalCompletions = 0;
    let totalPossible = 0;
    let longestStreak = 0;
    let xpEarned = 0;
    let badgesCount = 0;

    habits.forEach(habit => {
      const habitCreatedDate = new Date(habit.createdAt);
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      // Determine the start day for this habit in the current month
      let habitStartDay = 1;
      if (habitCreatedDate > monthStart) {
        habitStartDay = habitCreatedDate.getDate();
      }

      // Count completions for current month - handle missing completions array
      const completions = habit.completions || [];
      const monthCompletions = completions.filter(c => {
        const date = new Date(c.date);
        return date.getMonth() === currentDate.getMonth() &&
               date.getFullYear() === currentDate.getFullYear();
      });

      totalCompletions += monthCompletions.length;

      // Only count days from when habit was created
      const endDay = isCurrentMonth ? currentDay : daysInMonth;
      const possibleDays = Math.max(0, endDay - habitStartDay + 1);
      totalPossible += possibleDays;

      // XP calculation (10 XP per completion)
      xpEarned += monthCompletions.length * 10;

      // Track longest streak - handle missing stats
      const currentStreak = habit.stats?.currentStreak || 0;
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    });

    const completionRate = totalPossible > 0
      ? Math.round((totalCompletions / totalPossible) * 100)
      : 0;

    setStats({
      completionRate,
      currentStreak: longestStreak,
      totalXP: xpEarned,
      badges: badgesCount
    });
  }, [habits, habitsKey, currentDate, currentDay, daysInMonth, isCurrentMonth]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
  };

  if (habits.length === 0) {
    return (
      <div className="glass rounded-3xl p-8 text-center">
        <div className="text-4xl mb-4">📅</div>
        <h3 className="text-xl font-bold text-white mb-2">No habits to track</h3>
        <p className="text-gray-400">Add some habits to see your monthly progress!</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Glow effect behind card */}
      <div className="absolute -inset-4 bg-gradient-to-r from-primary-600/20 via-primary-500/10 to-primary-600/20 rounded-3xl blur-2xl" />

      {/* Card */}
      <div className="relative glass rounded-3xl p-6 sm:p-8 glow-primary">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold text-white">{monthName} {year}</h3>
                {!isCurrentMonth && (
                  <button
                    onClick={goToCurrentMonth}
                    className="px-3 py-1 text-xs bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors"
                  >
                    Today
                  </button>
                )}
              </div>
              <p className="text-gray-400 mt-1">Your habit tracking dashboard</p>
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
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-sm text-gray-400">Done</span>
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
            <span className="text-sm text-gray-400">Upcoming</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500/20" />
            <span className="text-sm text-gray-400">Not Created</span>
          </div>
        </div>

        {/* Habit Grid */}
        <div className="overflow-x-auto -mx-2 sm:-mx-2 px-2 sm:px-2">
          <table className="w-full border-separate" style={{ borderSpacing: '0 8px' }}>
            <thead>
              <tr>
                <th className="text-left text-sm font-semibold text-gray-300 pb-3 sm:pb-4 pr-3 sm:pr-4 min-w-[140px] sm:min-w-[160px]">
                  Habit
                </th>
                {days.map((day) => (
                  <th
                    key={day}
                    className={`text-center text-xs sm:text-xs font-medium pb-3 sm:pb-4 px-1.5 sm:px-1 ${
                      isCurrentMonth && day === currentDay
                        ? 'text-primary-400 font-bold'
                        : 'text-gray-500'
                    }`}
                    style={{ minWidth: '36px' }}
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {habits.map((habit, habitIndex) => (
                <tr key={habit._id || habitIndex} className="group">
                  <td className="py-3 sm:py-2 pr-3 sm:pr-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-lg sm:text-xl">{habit.icon || '📌'}</span>
                      <span className="text-sm text-white font-medium group-hover:text-primary-400 transition-colors truncate max-w-[100px] sm:max-w-[120px]">
                        {habit.title || habit.name}
                      </span>
                    </div>
                  </td>
                  {days.map((day) => {
                    const status = getCompletionStatus(habit, day);
                    return (
                      <td key={day} className="py-2.5 sm:py-3 px-1.5 sm:px-1">
                        <div
                          className={`w-8 h-8 sm:w-5 sm:h-5 rounded-lg sm:rounded-md mx-auto transition-all duration-200 ${getStatusColor(status, day, habit)}
                            ${isCurrentMonth && day === currentDay ? 'ring-2 sm:ring-2 ring-primary-400 ring-offset-1 sm:ring-offset-2 ring-offset-dark-800' : ''}`}
                          title={`${habit.title || habit.name} - Day ${day}`}
                          style={{ minWidth: '32px', minHeight: '32px' }}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Stats Row */}
        <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass rounded-xl p-4 text-center hover:bg-white/10 transition-colors group cursor-pointer">
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📈</div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-1">
              {stats.completionRate}%
            </div>
            <div className="text-sm text-gray-400">Completion</div>
          </div>

          <div className="glass rounded-xl p-4 text-center hover:bg-white/10 transition-colors group cursor-pointer">
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🔥</div>
            <div className="text-2xl sm:text-3xl font-bold text-orange-400 mb-1">
              {stats.currentStreak}
            </div>
            <div className="text-sm text-gray-400">Day Streak</div>
          </div>

          <div className="glass rounded-xl p-4 text-center hover:bg-white/10 transition-colors group cursor-pointer">
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">⭐</div>
            <div className="text-2xl sm:text-3xl font-bold text-primary-400 mb-1">
              {stats.totalXP}
            </div>
            <div className="text-sm text-gray-400">XP Earned</div>
          </div>

          <div className="glass rounded-xl p-4 text-center hover:bg-white/10 transition-colors group cursor-pointer">
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🏆</div>
            <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-1">
              {habits.length}
            </div>
            <div className="text-sm text-gray-400">Habits</div>
          </div>
        </div>
      </div>
    </div>
  );
});

MonthlyHabitTracker.displayName = 'MonthlyHabitTracker';

export default MonthlyHabitTracker;
