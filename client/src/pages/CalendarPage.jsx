import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { habitService } from '../services/habitService';
import { taskService } from '../services/taskService';

const CalendarPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [habits, setHabits] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [view, setView] = useState('month'); // 'month', 'week', 'day'

  useEffect(() => {
    fetchData();
  }, [currentDate]);

  const fetchData = async () => {
    try {
      const [habitsData, tasksData] = await Promise.all([
        habitService.getAll(),
        taskService.getAll(),
      ]);
      setHabits(habitsData.habits || []);
      setTasks(tasksData.tasks || []);
    } catch (err) {
      setError('Failed to load calendar data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Calendar utilities
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Get tasks for a specific date
  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.deadline);
      return taskDate.getFullYear() === date.getFullYear() &&
             taskDate.getMonth() === date.getMonth() &&
             taskDate.getDate() === date.getDate();
    });
  };

  // Check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
  };

  // Check if a date is selected
  const isSelected = (date) => {
    if (!selectedDate) return false;
    return date.getFullYear() === selectedDate.getFullYear() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getDate() === selectedDate.getDate();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const calendarDays = generateCalendarDays();

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
            <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src="/SavePointLogoTab.png" alt="Save Point" className="h-10 w-10" />
              <img src="/SavePointText.png" alt="Save Point" className="h-6" />
            </Link>

            <div className="flex items-center gap-6">
              <Link to="/dashboard" className="text-gray-400 hover:text-white text-sm transition-colors">
                Dashboard
              </Link>
              <Link to="/tasks" className="text-gray-400 hover:text-white text-sm transition-colors">
                Tasks
              </Link>
              <Link to="/habits" className="text-gray-400 hover:text-white text-sm transition-colors">
                Habits
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
            Calendar 📅
          </h1>
          <p className="text-gray-400">
            View your habits and tasks in one place
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
            {error}
          </div>
        )}

        {/* Calendar Controls */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Month/Year Display */}
            <div className="flex items-center gap-4">
              <button
                onClick={previousMonth}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <h2 className="text-2xl font-bold text-white min-w-[200px] text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>

              <button
                onClick={nextMonth}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={goToToday}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors"
              >
                Today
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-2 glass rounded-2xl p-6">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {dayNames.map(day => (
                <div key={day} className="text-center text-gray-400 text-sm font-medium py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const dayTasks = getTasksForDate(date);
                const hasEvents = dayTasks.length > 0 || habits.length > 0;

                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`aspect-square p-2 rounded-xl transition-all relative ${
                      isToday(date)
                        ? 'bg-primary-600 text-white'
                        : isSelected(date)
                        ? 'bg-primary-500/20 border-2 border-primary-500 text-white'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300'
                    }`}
                  >
                    <div className="text-sm font-medium">{date.getDate()}</div>

                    {/* Event Indicators */}
                    {hasEvents && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
                        {habits.length > 0 && (
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        )}
                        {dayTasks.length > 0 && (
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar - Selected Date Details */}
          <div className="space-y-6">
            {/* Selected Date Info */}
            {selectedDate && (
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h3>

                {/* Tasks for Selected Date */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-blue-400" />
                    <p className="text-sm font-medium text-gray-300">
                      Tasks ({getTasksForDate(selectedDate).length})
                    </p>
                  </div>

                  {getTasksForDate(selectedDate).length === 0 ? (
                    <p className="text-sm text-gray-500">No tasks scheduled</p>
                  ) : (
                    <div className="space-y-2">
                      {getTasksForDate(selectedDate).map(task => {
                        const priorityColors = {
                          low: 'border-l-blue-400',
                          medium: 'border-l-yellow-400',
                          high: 'border-l-orange-400',
                          urgent: 'border-l-red-400',
                        };

                        return (
                          <Link
                            key={task._id}
                            to="/tasks"
                            className={`block p-3 bg-white/5 hover:bg-white/10 rounded-lg border-l-4 ${priorityColors[task.priority]} transition-colors`}
                          >
                            <p className={`text-sm font-medium ${
                              task.status === 'completed' ? 'text-gray-400 line-through' : 'text-white'
                            }`}>
                              {task.title}
                            </p>
                            {task.description && (
                              <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                {task.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2 text-xs">
                              <span className={`px-2 py-0.5 rounded ${
                                task.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                                task.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                                task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-blue-500/20 text-blue-400'
                              }`}>
                                {task.priority}
                              </span>
                              {task.status === 'completed' && (
                                <span className="text-green-400">✓ Completed</span>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Daily Habits */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <p className="text-sm font-medium text-gray-300">
                      Daily Habits ({habits.length})
                    </p>
                  </div>

                  {habits.length === 0 ? (
                    <p className="text-sm text-gray-500">No habits to complete</p>
                  ) : (
                    <div className="space-y-2">
                      {habits.slice(0, 5).map(habit => (
                        <Link
                          key={habit._id}
                          to="/habits"
                          className="block p-3 bg-white/5 hover:bg-white/10 rounded-lg border-l-4 border-l-green-400 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{habit.icon || '📌'}</span>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-white">{habit.name}</p>
                              <p className="text-xs text-gray-500">
                                {habit.streak?.current || 0} day streak
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                      {habits.length > 5 && (
                        <Link
                          to="/habits"
                          className="block text-center p-2 text-sm text-primary-400 hover:text-primary-300 transition-colors"
                        >
                          View all {habits.length} habits →
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400 text-sm">Total Tasks</span>
                  <span className="text-white font-bold">{tasks.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400 text-sm">Pending Tasks</span>
                  <span className="text-yellow-400 font-bold">
                    {tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400 text-sm">Completed Tasks</span>
                  <span className="text-green-400 font-bold">
                    {tasks.filter(t => t.status === 'completed').length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400 text-sm">Active Habits</span>
                  <span className="text-primary-400 font-bold">{habits.length}</span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Legend</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-400" />
                  <span className="text-sm text-gray-400">Tasks</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-sm text-gray-400">Habits</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-primary-600" />
                  <span className="text-sm text-gray-400">Today</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-primary-500/20 border-2 border-primary-500" />
                  <span className="text-sm text-gray-400">Selected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CalendarPage;
