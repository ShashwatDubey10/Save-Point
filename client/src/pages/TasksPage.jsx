import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { taskService } from '../services/taskService';
import TaskModal from '../components/TaskModal';
import ConfirmationModal from '../components/ConfirmationModal';
import AppHeader from '../components/AppHeader';
import AppNavigation from '../components/AppNavigation';
import LevelUpModal from '../components/LevelUpModal';
import { KanbanBoard } from '../components/KanbanBoard';
import { PageContainer, MainContent, PageHeader, ErrorMessage, LoadingSpinner, EmptyState, ControlBar } from '../utils/pageLayout';

const TasksPage = () => {
  const { user, refreshUser } = useAuth();

  // Level up modal state
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [levelUpData, setLevelUpData] = useState({ newLevel: 1, previousLevel: 1 });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [view, setView] = useState('board'); // 'list' or 'board'

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
        toast.success('Task updated successfully!');
      } else {
        await taskService.create(taskData);
        toast.success('Task created successfully!');
      }
      fetchTasks();
      setIsTaskModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      console.error('Failed to save task:', err);
      toast.error('Failed to save task. Please try again.');
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
      toast.success('Task deleted successfully!');
      fetchTasks();
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    } catch (err) {
      console.error('Failed to delete task:', err);
      toast.error('Failed to delete task. Please try again.');
      setError('Failed to delete task');
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const response = await taskService.toggleStatus(taskId);

      // Show detailed feedback if XP was awarded
      if (response.points) {
        const { earned, type, breakdown, priority, leveledUp, previousLevel, level } = response.points;

        if (type === 'start') {
          // XP for starting a task
          const priorityEmoji = {
            low: '🔵',
            medium: '🟡',
            high: '🟠',
            urgent: '🔴'
          };
          toast.success(
            `⚡ Task started! +${earned} XP ${priorityEmoji[priority] || ''}`,
            { duration: 4000 }
          );
        } else if (type === 'complete') {
          // XP for completing a task
          if (breakdown.status === 'early') {
            toast.success(
              `🎉 Task completed ${breakdown.daysEarly} day${breakdown.daysEarly > 1 ? 's' : ''} early! +${earned} XP (+${breakdown.base} base, +${breakdown.deadlineModifier} early bonus)`,
              { duration: 5000 }
            );
          } else if (breakdown.status === 'on_time') {
            toast.success(
              `✅ Task completed on time! +${earned} XP (+${breakdown.base} base, +${breakdown.deadlineModifier} on-time bonus)`,
              { duration: 5000 }
            );
          } else if (breakdown.status === 'late') {
            if (earned > 0) {
              toast(
                `⚠️ Task completed ${breakdown.daysLate} day${breakdown.daysLate > 1 ? 's' : ''} late. +${earned} XP (+${breakdown.base} base, ${breakdown.deadlineModifier} late penalty)`,
                { icon: '⚠️', duration: 5000 }
              );
            } else {
              toast.error(
                `❌ Task completed ${breakdown.daysLate} day${breakdown.daysLate > 1 ? 's' : ''} late. No XP awarded due to delay.`,
                { duration: 5000 }
              );
            }
          } else {
            toast.success(`✅ Task completed! +${earned} XP`, { duration: 4000 });
          }
        }

        // Show level-up animation if user leveled up
        if (leveledUp) {
          setLevelUpData({ newLevel: level, previousLevel });
          setIsLevelUpModalOpen(true);
        }

        // Refresh user data to update XP in header
        await refreshUser();
      } else {
        toast.success('Task status updated!');
      }

      fetchTasks();
    } catch (err) {
      console.error('Failed to toggle task:', err);
      toast.error('Failed to update task status.');
    }
  };

  // Handle task move between columns
  const handleTaskMove = async (taskId, newStatus) => {
    const currentTask = tasks.find(t => t._id === taskId);

    if (!currentTask || currentTask.status === newStatus) {
      return; // No change needed
    }

    // Update task status
    if (newStatus === 'todo' || newStatus === 'in-progress' || newStatus === 'completed') {
      try {
        const response = await taskService.updateStatus(taskId, newStatus);

        // Show detailed feedback if XP was awarded
        if (response.points) {
          const { earned, type, breakdown, priority, leveledUp, previousLevel, level } = response.points;

          if (type === 'start') {
            // XP for starting a task
            const priorityEmoji = {
              low: '🔵',
              medium: '🟡',
              high: '🟠',
              urgent: '🔴'
            };
            toast.success(
              `⚡ Task started! +${earned} XP ${priorityEmoji[priority] || ''}`,
              { duration: 4000 }
            );
          } else if (type === 'complete') {
            // XP for completing a task
            if (breakdown.status === 'early') {
              toast.success(
                `🎉 Task completed ${breakdown.daysEarly} day${breakdown.daysEarly > 1 ? 's' : ''} early! +${earned} XP (+${breakdown.base} base, +${breakdown.deadlineModifier} early bonus)`,
                { duration: 5000 }
              );
            } else if (breakdown.status === 'on_time') {
              toast.success(
                `✅ Task completed on time! +${earned} XP (+${breakdown.base} base, +${breakdown.deadlineModifier} on-time bonus)`,
                { duration: 5000 }
              );
            } else if (breakdown.status === 'late') {
              if (earned > 0) {
                toast(
                  `⚠️ Task completed ${breakdown.daysLate} day${breakdown.daysLate > 1 ? 's' : ''} late. +${earned} XP (+${breakdown.base} base, ${breakdown.deadlineModifier} late penalty)`,
                  { icon: '⚠️', duration: 5000 }
                );
              } else {
                toast.error(
                  `❌ Task completed ${breakdown.daysLate} day${breakdown.daysLate > 1 ? 's' : ''} late. No XP awarded due to delay.`,
                  { duration: 5000 }
                );
              }
            } else {
              toast.success(`✅ Task completed! +${earned} XP`, { duration: 4000 });
            }
          }

          // Show level-up animation if user leveled up
          if (leveledUp) {
            setLevelUpData({ newLevel: level, previousLevel });
            setIsLevelUpModalOpen(true);
          }

          // Refresh user data to update XP in header
          await refreshUser();
        } else {
          toast.success(`Task moved to ${newStatus === 'in-progress' ? 'In Progress' : newStatus === 'todo' ? 'To Do' : 'Completed'}!`);
        }

        fetchTasks();
      } catch (err) {
        console.error('Failed to update task status:', err);
        toast.error('Failed to move task. Please try again.');
        setError('Failed to move task');
      }
    }
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
    return <LoadingSpinner />;
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
            {/* Status Icon - cycles through: todo -> in-progress -> completed */}
            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all mt-0.5 ${
              task.status === 'completed'
                ? 'bg-green-500 border-green-500'
                : task.status === 'in-progress'
                ? 'bg-primary-500 border-primary-500'
                : 'border-white/30 hover:border-primary-500'
            }`} title={`Status: ${task.status}. Click to cycle status.`}>
              {task.status === 'completed' && (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {task.status === 'in-progress' && (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
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
                {/* Status Badge */}
                <span className={`px-2 py-1 rounded-lg border ${
                  task.status === 'completed' ? 'text-green-400 bg-green-500/10 border-green-500/30' :
                  task.status === 'in-progress' ? 'text-primary-400 bg-primary-500/10 border-primary-500/30' :
                  'text-gray-400 bg-gray-500/10 border-gray-500/30'
                }`}>
                  {task.status === 'completed' ? '✓ Completed' :
                   task.status === 'in-progress' ? '⚡ In Progress' :
                   '○ To Do'}
                </span>

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
    <PageContainer>
      <AppHeader />
      <AppNavigation />

      <MainContent>
        <PageHeader
          title="Tasks & Deadlines 📋"
          description={view === 'board' ? 'Drag tasks between columns to change their status' : 'Click status icon to cycle: To Do → In Progress → Completed'}
          actionLabel="Add Task"
          actionOnClick={handleCreateTask}
        />

        <ErrorMessage message={error} />

        {/* Filters and Actions - Mobile-first */}
        <div className="mb-4 sm:mb-6 flex flex-col gap-3">
          {/* Top row: View toggle and Add button */}
          <div className="flex items-center justify-between gap-3">
            {/* View Toggle */}
            <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg">
              <button
                onClick={() => setView('list')}
                className={`touch-target px-2.5 sm:px-3 py-1.5 rounded-md transition-all ${
                  view === 'list' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
                aria-label="List view"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setView('board')}
                className={`touch-target px-2.5 sm:px-3 py-1.5 rounded-md transition-all ${
                  view === 'board' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
                aria-label="Board view"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </button>
            </div>

            {/* Add Task Button */}
            <button
              onClick={handleCreateTask}
              className="touch-target flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="whitespace-nowrap">Add Task</span>
            </button>
          </div>

          {/* Bottom row: Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs sm:text-sm flex-shrink-0"
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
              className="px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs sm:text-sm flex-shrink-0"
            >
              <option value="all" className="bg-dark-800">All Priorities</option>
              <option value="urgent" className="bg-dark-800">Urgent</option>
              <option value="high" className="bg-dark-800">High</option>
              <option value="medium" className="bg-dark-800">Medium</option>
              <option value="low" className="bg-dark-800">Low</option>
            </select>
          </div>
        </div>

        {/* Tasks View */}
        {tasks.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No tasks yet"
            description="Create your first task to get started!"
            actionLabel="Create Your First Task"
            actionOnClick={handleCreateTask}
          />
        ) : view === 'list' ? (
          /* List View */
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        ) : (
          /* Board View with Custom Drag & Drop - Works on Desktop & Mobile */
          <KanbanBoard
            tasks={tasks}
            onTaskMove={handleTaskMove}
            onEdit={(task) => {
              setEditingTask(task);
              setIsTaskModalOpen(true);
            }}
            onDelete={(task) => {
              setTaskToDelete(task);
              setIsDeleteModalOpen(true);
            }}
          />
        )}
      </MainContent>

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

      <LevelUpModal
        isOpen={isLevelUpModalOpen}
        onClose={() => setIsLevelUpModalOpen(false)}
        newLevel={levelUpData.newLevel}
        previousLevel={levelUpData.previousLevel}
      />
    </PageContainer>
  );
};

export default TasksPage;
