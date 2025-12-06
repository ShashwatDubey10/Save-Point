import { useState, useRef, useEffect, useCallback } from 'react';

// Custom Draggable Task Card Component - Works with BOTH Mouse and Touch
export const DraggableTaskCard = ({ task, onEdit, onDelete, onDragStart, isDragging }) => {
  const [isPressed, setIsPressed] = useState(false);
  const longPressTimerRef = useRef(null);
  const dragStartTimeRef = useRef(null);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  // Handle press start (both mouse and touch)
  const handlePressStart = (e, isTouchEvent) => {
    // Don't start drag if clicking buttons
    if (e.target.closest('button')) {
      return;
    }

    setIsPressed(true);
    dragStartTimeRef.current = Date.now();

    // For touch: wait 1 second before allowing drag
    if (isTouchEvent) {
      longPressTimerRef.current = setTimeout(() => {
        // Vibrate to indicate drag mode activated
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
        onDragStart(task, e);
      }, 1000);
    } else {
      // For mouse: activate immediately
      onDragStart(task, e);
    }
  };

  // Handle press end
  const handlePressEnd = () => {
    setIsPressed(false);

    // Clear long-press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    // Check if it was a quick tap (less than 200ms)
    const pressDuration = Date.now() - (dragStartTimeRef.current || 0);
    if (pressDuration < 200 && !isDragging) {
      // This was a tap, not a drag attempt
      return;
    }
  };

  // Cancel drag on scroll or movement
  const handlePressCancel = () => {
    setIsPressed(false);
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'high':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'low':
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getDeadlineInfo = (dueDate) => {
    if (!dueDate) return null;
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: 'Overdue', color: 'text-red-400' };
    } else if (diffDays === 0) {
      return { text: 'Due today', color: 'text-orange-400' };
    } else if (diffDays === 1) {
      return { text: 'Due tomorrow', color: 'text-yellow-400' };
    } else if (diffDays <= 7) {
      return { text: `${diffDays} days left`, color: 'text-gray-400' };
    }
    return { text: due.toLocaleDateString(), color: 'text-gray-500' };
  };

  const deadline = getDeadlineInfo(task.dueDate);

  return (
    <div
      className={`glass rounded-xl p-3 sm:p-4 mb-3 hover:bg-white/10 transition-all select-none ${
        isDragging ? 'opacity-40 scale-95' : ''
      } ${isPressed && !isDragging ? 'scale-98' : ''}`}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
      }}
      // Mouse events
      onMouseDown={(e) => handlePressStart(e, false)}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressCancel}
      // Touch events
      onTouchStart={(e) => handlePressStart(e, true)}
      onTouchEnd={handlePressEnd}
      onTouchCancel={handlePressCancel}
    >
      {/* Drag Handle Indicator */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex flex-col gap-0.5 text-gray-600">
          <div className="w-1 h-1 rounded-full bg-current"></div>
          <div className="w-1 h-1 rounded-full bg-current"></div>
          <div className="w-1 h-1 rounded-full bg-current"></div>
        </div>
        <h3 className="text-white font-medium flex-1 text-sm sm:text-base">{task.title}</h3>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 active:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            aria-label="Edit task"
            type="button"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task);
            }}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 active:bg-red-500/30 flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors"
            aria-label="Delete task"
            type="button"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-xs sm:text-sm text-gray-500 mb-3 line-clamp-2 ml-4">{task.description}</p>
      )}

      <div className="flex flex-wrap items-center gap-2 text-xs ml-4">
        <span className={`px-2 py-1 rounded-lg border ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        {deadline && (
          <span className={`flex items-center gap-1 ${deadline.color}`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {deadline.text}
          </span>
        )}
        {task.category && (
          <span className="text-gray-500">{task.category}</span>
        )}
      </div>
    </div>
  );
};

// Droppable Column Component with Drag Detection
export const KanbanColumn = ({
  status,
  title,
  tasks,
  onEdit,
  onDelete,
  onDragStart,
  icon,
  color,
  isOver,
  draggedTask
}) => {
  return (
    <div className="w-full lg:flex-1 lg:min-w-[280px]">
      <div
        className={`glass rounded-2xl p-3 sm:p-4 transition-all min-h-[200px] ${
          isOver ? 'ring-2 ring-primary-500 bg-primary-500/5' : ''
        }`}
      >
        {/* Column Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl">{icon}</span>
            <h2 className="text-base sm:text-lg font-bold text-white">{title}</h2>
          </div>
          <span className={`px-2 py-1 rounded-lg text-sm font-medium ${color}`}>
            {tasks.length}
          </span>
        </div>

        {/* Tasks */}
        <div className="space-y-0">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              <div className="mb-2 text-2xl opacity-30">{icon}</div>
              <span className="hidden lg:inline">Drop tasks here</span>
              <span className="lg:hidden">No {title.toLowerCase()} tasks</span>
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task._id}>
                {/* Placeholder when dragging over this position */}
                {draggedTask && draggedTask._id !== task._id && (
                  <div className="h-2" />
                )}
                <DraggableTaskCard
                  task={task}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onDragStart={onDragStart}
                  isDragging={draggedTask?._id === task._id}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Main Kanban Board with Custom Drag Logic
export const KanbanBoard = ({ tasks, onTaskMove, onEdit, onDelete }) => {
  const [dragState, setDragState] = useState({
    isDragging: false,
    draggedTask: null,
    currentX: 0,
    currentY: 0,
    overColumn: null,
  });

  // Use refs to store data that event handlers need to access
  const dragDataRef = useRef({
    isDragging: false,
    draggedTask: null,
    currentX: 0,
    currentY: 0,
    overColumn: null,
  });
  const dragGhostRef = useRef(null);

  // Handle drag start
  const handleDragStart = useCallback((task, e) => {
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

    // Update both state and ref
    const newDragData = {
      isDragging: true,
      draggedTask: task,
      currentX: clientX,
      currentY: clientY,
      overColumn: null,
    };

    dragDataRef.current = newDragData;
    setDragState(newDragData);

    // Define handlers as closures that access refs
    const handleMove = (e) => {
      if (!dragDataRef.current.isDragging) return;

      // Prevent scrolling on touch devices
      if (e.type.includes('touch')) {
        e.preventDefault();
      }

      const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

      // Detect which column we're over
      const columns = document.querySelectorAll('[data-column]');
      let overColumn = null;

      columns.forEach(col => {
        const rect = col.getBoundingClientRect();
        if (
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom
        ) {
          overColumn = col.getAttribute('data-column');
        }
      });

      // Update both ref and state
      dragDataRef.current = {
        ...dragDataRef.current,
        currentX: clientX,
        currentY: clientY,
        overColumn,
      };

      setDragState({
        ...dragDataRef.current,
      });
    };

    const handleEnd = () => {
      // Remove event listeners
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);

      // Move task to new column if over a different column
      const { overColumn, draggedTask } = dragDataRef.current;

      if (overColumn && draggedTask && overColumn !== draggedTask.status) {
        onTaskMove(draggedTask._id, overColumn);
      }

      // Reset state
      dragDataRef.current = {
        isDragging: false,
        draggedTask: null,
        currentX: 0,
        currentY: 0,
        overColumn: null,
      };

      setDragState({
        isDragging: false,
        draggedTask: null,
        currentX: 0,
        currentY: 0,
        overColumn: null,
      });
    };

    // Add event listeners
    if (e.type.includes('touch')) {
      document.addEventListener('touchmove', handleMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
    } else {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
    }
  }, [onTaskMove]);

  // Organize tasks by status
  const tasksByStatus = {
    todo: tasks.filter(t => t.status === 'todo'),
    'in-progress': tasks.filter(t => t.status === 'in-progress'),
    completed: tasks.filter(t => t.status === 'completed'),
  };

  const columns = [
    {
      status: 'todo',
      title: 'To Do',
      icon: '📋',
      color: 'bg-gray-500/20 text-gray-400',
    },
    {
      status: 'in-progress',
      title: 'In Progress',
      icon: '⚡',
      color: 'bg-blue-500/20 text-blue-400',
    },
    {
      status: 'completed',
      title: 'Completed',
      icon: '✅',
      color: 'bg-green-500/20 text-green-400',
    },
  ];

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {columns.map(column => (
          <div
            key={column.status}
            data-column={column.status}
            className="flex-1"
          >
            <KanbanColumn
              status={column.status}
              title={column.title}
              icon={column.icon}
              color={column.color}
              tasks={tasksByStatus[column.status]}
              onEdit={onEdit}
              onDelete={onDelete}
              onDragStart={handleDragStart}
              isOver={dragState.overColumn === column.status}
              draggedTask={dragState.draggedTask}
            />
          </div>
        ))}
      </div>

      {/* Drag Ghost - Follows cursor/finger */}
      {dragState.isDragging && dragState.draggedTask && (
        <div
          ref={dragGhostRef}
          className="fixed pointer-events-none z-50"
          style={{
            left: dragState.currentX,
            top: dragState.currentY,
            transform: 'translate(-50%, -50%) scale(1.05)',
            opacity: 0.9,
          }}
        >
          <div className="glass rounded-xl p-3 sm:p-4 shadow-2xl ring-2 ring-primary-500 min-w-[250px] max-w-[300px]">
            <h3 className="text-white font-medium text-sm sm:text-base">
              {dragState.draggedTask.title}
            </h3>
            {dragState.draggedTask.description && (
              <p className="text-xs sm:text-sm text-gray-400 mt-1 line-clamp-1">
                {dragState.draggedTask.description}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default KanbanBoard;
