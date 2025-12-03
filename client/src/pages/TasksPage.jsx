import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { taskService } from '../services/taskService';
import TaskModal from '../components/TaskModal';
import ConfirmationModal from '../components/ConfirmationModal';

const TasksPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [view, setView] = useState('list'); // 'list' or 'board'

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [filterStatus, filterPriority]);

  const fetchTasks = async () => {
    try {
      const filters = {};
      if (filterStatus !== 'all') filters.status = filterStatus;
      if (filterPriority !== 'all') filters.priority = filterPriority;

      const data = await taskService.getAll(filters);
      setTasks(data || []);
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task, e) => {
    e.stopPropagation();
    e.preventDefault();
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        await taskService.update(editingTask._id, taskData);
      } else {
        await taskService.create(taskData);
      }
      fetchTasks();
      setIsTaskModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      console.error('Failed to save task:', err);
      throw err;
    }
  };

  const handleDeleteClick = (task, e) => {
    e.stopPropagation();
    e.preventDefault();
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;

    try {
      await taskService.delete(taskToDelete._id);
      fetchTasks();
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError('Failed to delete task');
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      await taskService.toggleStatus(taskId);
      fetchTasks();
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Group tasks by status for board view
  const tasksByStatus = {
    todo: tasks.filter(t => t.status === 'todo'),
    'in-progress': tasks.filter(t => t.status === 'in-progress'),
    completed: tasks.filter(t => t.status === 'completed'),
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
      high: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
      urgent: 'text-red-400 bg-red-500/10 border-red-500/30',
    };
    return colors[priority] || colors.medium;
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      low: '🔵',
      medium: '🟡',
      high: '🟠',
      urgent: '🔴',
    };
    return icons[priority] || icons.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      'todo': 'border-gray-500/30',
      'in-progress': 'border-primary-500/30',
      'completed': 'border-green-500/30',
    };
    return colors[status] || colors.todo;
  };

  const formatDeadline = (dueDate) => {
    if (!dueDate) return { text: 'No deadline', color: 'text-gray-500' };
    const date = new Date(dueDate);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: 'Overdue', color: 'text-red-400' };
    if (diffDays === 0) return { text: 'Today', color: 'text-orange-400' };
    if (diffDays === 1) return { text: 'Tomorrow', color: 'text-yellow-400' };
    if (diffDays <= 7) return { text: `${diffDays} days`, color: 'text-primary-400' };
    return { text: date.toLocaleDateString(), color: 'text-gray-400' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const TaskCard = ({ task }) => {
    const deadline = formatDeadline(task.dueDate);
    const isOverdue = task.status !== 'completed' && task.dueDate && new Date(task.dueDate) < new Date();

    return (
      <div
        className={`glass rounded-xl p-4 transition-all cursor-pointer hover:bg-white/10 border ${getStatusColor(task.status)} ${
          isOverdue ? 'border-red-500/50' : ''
        }`}
        onClick={() => handleToggleTask(task._id)}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            {/* Checkbox */}
            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all mt-0.5 ${
              task.status === 'completed'
                ? 'bg-green-500 border-green-500'
                : 'border-white/30 hover:border-primary-500'
            }`}>
              {task.status === 'completed' && (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>

            {/* Task Info */}
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium mb-1 ${
                task.status === 'completed' ? 'text-gray-400 line-through' : 'text-white'
              }`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">{task.description}</p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Priority Badge */}
                <span className={`px-2 py-1 rounded-lg border ${getPriorityColor(task.priority)}`}>
                  {getPriorityIcon(task.priority)} {task.priority}
                </span>

                {/* Deadline */}
                <span className={`flex items-center gap-1 ${deadline.color}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {deadline.text}
                </span>

                {/* Category */}
                {task.category && (
                  <span className="text-gray-500">
                    {task.category}
                  </span>
                )}

                {/* Subtasks Progress */}
                {task.subtasks && task.subtasks.length > 0 && (
                  <span className="text-gray-500">
                    {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} subtasks
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={(e) => handleEditTask(task, e)}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              title="Edit task"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={(e) => handleDeleteClick(task, e)}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors"
              title="Delete task"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/dashboard" className="flex items-center gap-3 glass px-3 py-2 rounded-xl hover:bg-white/10 transition-all">
              <img src="/SavePointLogoTab.png" alt="Save Point" className="h-10 w-10" />
              <img src="/SavePointText.png" alt="Save Point" className="h-6" />
            </Link>

            <div className="flex items-center gap-6">
              <Link to="/dashboard" className="text-gray-400 hover:text-white text-sm transition-colors">
                Dashboard
              </Link>
              <Link to="/calendar" className="text-gray-400 hover:text-white text-sm transition-colors">
                Calendar
              </Link>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 glass px-3 py-2 rounded-xl h-[45px]">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-sm font-medium text-white leading-none">{user?.username || 'User'}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="glass px-4 py-2.5 hover:bg-white/10 text-gray-400 hover:text-white text-sm rounded-xl transition-colors h-[45px]"
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
            Tasks & Deadlines 📋
          </h1>
          <p className="text-gray-400">
            Manage your tasks and stay on top of your deadlines
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
            {error}
          </div>
        )}

        {/* Filters and Actions */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Toggle */}
            <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg">
              <button
                onClick={() => setView('list')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  view === 'list' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setView('board')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  view === 'board' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </button>
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
            >
              <option value="all" className="bg-dark-800">All Status</option>
              <option value="todo" className="bg-dark-800">To Do</option>
              <option value="in-progress" className="bg-dark-800">In Progress</option>
              <option value="completed" className="bg-dark-800">Completed</option>
            </select>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
            >
              <option value="all" className="bg-dark-800">All Priorities</option>
              <option value="urgent" className="bg-dark-800">Urgent</option>
              <option value="high" className="bg-dark-800">High</option>
              <option value="medium" className="bg-dark-800">Medium</option>
              <option value="low" className="bg-dark-800">Low</option>
            </select>
          </div>

          <button
            onClick={handleCreateTask}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Task
          </button>
        </div>

        {/* Tasks View */}
        {tasks.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-white mb-2">No tasks yet</h3>
            <p className="text-gray-400 mb-6">Create your first task to get started!</p>
            <button
              onClick={handleCreateTask}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors"
            >
              Create Your First Task
            </button>
          </div>
        ) : view === 'list' ? (
          /* List View */
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        ) : (
          /* Board View */
          <div className="grid lg:grid-cols-3 gap-6">
            {/* To Do Column */}
            <div className="glass rounded-2xl p-5">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">📝</span>
                To Do ({tasksByStatus.todo.length})
              </h2>
              <div className="space-y-3">
                {tasksByStatus.todo.map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))}
                {tasksByStatus.todo.length === 0 && (
                  <p className="text-center text-gray-500 text-sm py-8">No pending tasks</p>
                )}
              </div>
            </div>

            {/* In Progress Column */}
            <div className="glass rounded-2xl p-5">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                In Progress ({tasksByStatus['in-progress'].length})
              </h2>
              <div className="space-y-3">
                {tasksByStatus['in-progress'].map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))}
                {tasksByStatus['in-progress'].length === 0 && (
                  <p className="text-center text-gray-500 text-sm py-8">No tasks in progress</p>
                )}
              </div>
            </div>

            {/* Completed Column */}
            <div className="glass rounded-2xl p-5">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">✅</span>
                Completed ({tasksByStatus.completed.length})
              </h2>
              <div className="space-y-3">
                {tasksByStatus.completed.map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))}
                {tasksByStatus.completed.length === 0 && (
                  <p className="text-center text-gray-500 text-sm py-8">No completed tasks</p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        task={editingTask}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Task?"
        message={`Are you sure you want to delete "${taskToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
};

export default TasksPage;
