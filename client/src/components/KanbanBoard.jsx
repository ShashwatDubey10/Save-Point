import { useDraggable, useDroppable } from '@dnd-kit/core';

// Draggable Task Card Component
export const DraggableTaskCard = ({ task, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: task._id,
    data: {
      type: 'task',
      task,
    }
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
    transition: isDragging ? 'none' : 'transform 200ms ease, opacity 200ms ease',
    cursor: isDragging ? 'grabbing' : 'grab',
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
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`glass rounded-xl p-3 sm:p-4 mb-3 hover:bg-white/10 transition-all ${isDragging ? 'shadow-2xl ring-2 ring-primary-500' : ''}`}
    >
      <div className="flex items-start gap-2 mb-2">
        {/* Task Title */}
        <h3 className="text-white font-medium flex-1 text-sm sm:text-base">{task.title}</h3>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className="touch-target w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 active:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
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
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className="touch-target w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 active:bg-red-500/30 flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
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
        <p className="text-xs sm:text-sm text-gray-500 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-wrap items-center gap-2 text-xs">
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

// Droppable Column Component - Mobile-first responsive
export const KanbanColumn = ({ status, title, tasks, onEdit, onDelete, icon, color }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      type: 'column',
      status,
    }
  });

  return (
    <div className="w-full lg:flex-1 lg:min-w-[280px]">
      <div
        ref={setNodeRef}
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
              <DraggableTaskCard
                key={task._id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
