import { useState, useRef, useEffect } from 'react';

const DraggableHabitList = ({
  habits,
  onReorder,
  onToggle,
  onEdit,
  onDelete,
  isCompletedToday
}) => {
  const [dragState, setDragState] = useState({
    isDragging: false,
    draggedIndex: null,
    currentY: 0,
    startY: 0,
    offsetY: 0,
    placeholderIndex: null,
  });

  const longPressTimerRef = useRef(null);
  const scrollCheckIntervalRef = useRef(null);
  const itemRefs = useRef([]);
  const initialScrollY = useRef(0);
  const isDragActiveRef = useRef(false);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
      if (scrollCheckIntervalRef.current) {
        clearInterval(scrollCheckIntervalRef.current);
      }
    };
  }, []);

  const handleTouchStart = (e, index) => {
    // Don't start drag if touching a button
    if (e.target.closest('button')) {
      return;
    }

    const touch = e.touches[0];
    const itemRect = itemRefs.current[index].getBoundingClientRect();

    initialScrollY.current = window.scrollY;
    isDragActiveRef.current = false;

    // Start long-press timer (2 seconds)
    longPressTimerRef.current = setTimeout(() => {
      // Activate drag mode after 2 seconds
      isDragActiveRef.current = true;

      // Haptic feedback (if supported)
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }

      setDragState({
        isDragging: true,
        draggedIndex: index,
        currentY: touch.clientY,
        startY: touch.clientY,
        offsetY: touch.clientY - itemRect.top,
        placeholderIndex: index,
      });
    }, 2000);

    // Check for scroll every 100ms to cancel drag
    scrollCheckIntervalRef.current = setInterval(() => {
      if (Math.abs(window.scrollY - initialScrollY.current) > 10) {
        cancelDrag();
      }
    }, 100);
  };

  const handleTouchMove = (e, index) => {
    // If we haven't activated drag mode yet, check if user is scrolling
    if (!isDragActiveRef.current) {
      if (Math.abs(window.scrollY - initialScrollY.current) > 5) {
        cancelDrag();
      }
      return;
    }

    // Prevent scrolling while dragging
    e.preventDefault();

    const touch = e.touches[0];
    const currentY = touch.clientY;

    // Update drag position
    setDragState(prev => ({
      ...prev,
      currentY,
    }));

    // Calculate which position the item should be in
    let newPlaceholderIndex = dragState.draggedIndex;
    const draggedItemHeight = itemRefs.current[dragState.draggedIndex]?.offsetHeight || 0;

    itemRefs.current.forEach((ref, i) => {
      if (i === dragState.draggedIndex || !ref) return;

      const rect = ref.getBoundingClientRect();
      const itemMiddle = rect.top + rect.height / 2;

      if (currentY < itemMiddle && i < dragState.draggedIndex) {
        newPlaceholderIndex = i;
      } else if (currentY > itemMiddle && i > dragState.draggedIndex) {
        newPlaceholderIndex = i;
      }
    });

    if (newPlaceholderIndex !== dragState.placeholderIndex) {
      setDragState(prev => ({
        ...prev,
        placeholderIndex: newPlaceholderIndex,
      }));
    }
  };

  const handleTouchEnd = (e) => {
    // Clear timers
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    if (scrollCheckIntervalRef.current) {
      clearInterval(scrollCheckIntervalRef.current);
    }

    // If drag was active, perform reorder
    if (isDragActiveRef.current && dragState.isDragging) {
      const { draggedIndex, placeholderIndex } = dragState;

      if (draggedIndex !== placeholderIndex) {
        // Reorder the habits
        const newHabits = [...habits];
        const [draggedHabit] = newHabits.splice(draggedIndex, 1);
        newHabits.splice(placeholderIndex, 0, draggedHabit);

        // Call parent's reorder function
        onReorder(newHabits);
      }
    }

    // Reset drag state
    setDragState({
      isDragging: false,
      draggedIndex: null,
      currentY: 0,
      startY: 0,
      offsetY: 0,
      placeholderIndex: null,
    });
    isDragActiveRef.current = false;
  };

  const cancelDrag = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    if (scrollCheckIntervalRef.current) {
      clearInterval(scrollCheckIntervalRef.current);
    }

    setDragState({
      isDragging: false,
      draggedIndex: null,
      currentY: 0,
      startY: 0,
      offsetY: 0,
      placeholderIndex: null,
    });
    isDragActiveRef.current = false;
  };

  const getItemStyle = (index) => {
    const { isDragging, draggedIndex, currentY, offsetY, placeholderIndex } = dragState;

    if (isDragging && index === draggedIndex) {
      // Style for the dragged item
      return {
        position: 'fixed',
        left: '50%',
        top: `${currentY - offsetY}px`,
        transform: 'translateX(-50%) scale(1.05)',
        zIndex: 1000,
        opacity: 0.9,
        width: `${itemRefs.current[index]?.offsetWidth}px`,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        transition: 'none',
        touchAction: 'none',
      };
    }

    if (isDragging && index === placeholderIndex && index !== draggedIndex) {
      // Style for the placeholder position
      return {
        borderColor: 'rgba(139, 92, 246, 0.5)',
        borderWidth: '2px',
        borderStyle: 'dashed',
        transition: 'all 0.3s ease',
      };
    }

    return {
      transition: 'all 0.3s ease',
    };
  };

  const getTransform = (index) => {
    const { isDragging, draggedIndex, placeholderIndex } = dragState;

    if (!isDragging || draggedIndex === null || placeholderIndex === null) {
      return 'translateY(0)';
    }

    // Don't transform the dragged item (it's positioned absolutely)
    if (index === draggedIndex) {
      return 'translateY(0)';
    }

    // Items between old and new position should shift
    if (draggedIndex < placeholderIndex) {
      // Dragging down
      if (index > draggedIndex && index <= placeholderIndex) {
        const itemHeight = itemRefs.current[draggedIndex]?.offsetHeight || 0;
        return `translateY(-${itemHeight + 12}px)`; // 12px is gap
      }
    } else if (draggedIndex > placeholderIndex) {
      // Dragging up
      if (index < draggedIndex && index >= placeholderIndex) {
        const itemHeight = itemRefs.current[draggedIndex]?.offsetHeight || 0;
        return `translateY(${itemHeight + 12}px)`; // 12px is gap
      }
    }

    return 'translateY(0)';
  };

  return (
    <div className="space-y-3">
      {habits.map((habit, index) => {
        const completed = isCompletedToday(habit);
        const isDragged = dragState.isDragging && index === dragState.draggedIndex;

        return (
          <div
            key={habit._id}
            ref={(el) => (itemRefs.current[index] = el)}
            className={`glass rounded-xl p-4 flex items-center gap-4 transition-all ${
              completed ? 'border border-green-500/30' : ''
            } ${isDragged ? 'cursor-grabbing' : 'cursor-grab'} ${
              !isDragged && !dragState.isDragging ? 'hover:bg-white/10' : ''
            }`}
            style={{
              ...getItemStyle(index),
              transform: getTransform(index),
            }}
            onTouchStart={(e) => handleTouchStart(e, index)}
            onTouchMove={(e) => handleTouchMove(e, index)}
            onTouchEnd={handleTouchEnd}
            onClick={() => !dragState.isDragging && onToggle(habit._id, completed)}
          >
            {/* Drag Handle Indicator */}
            <div className="flex flex-col gap-1 text-gray-600">
              <div className="w-1 h-1 rounded-full bg-current"></div>
              <div className="w-1 h-1 rounded-full bg-current"></div>
              <div className="w-1 h-1 rounded-full bg-current"></div>
            </div>

            {/* Checkbox */}
            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
              completed
                ? 'bg-green-500 border-green-500'
                : 'border-white/30 hover:border-primary-500'
            }`}>
              {completed && (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>

            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">
              {habit.icon || '📌'}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h3 className={`font-medium transition-all ${
                completed ? 'text-gray-400 line-through' : 'text-white'
              }`}>
                {habit.title || habit.name}
              </h3>
              <p className="text-sm text-gray-500 capitalize">{habit.category}</p>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1 px-3 py-1 bg-white/5 rounded-lg">
              <span className="text-orange-400">🔥</span>
              <span className="text-white font-medium">{habit.stats?.currentStreak || 0}</span>
            </div>

            {/* XP */}
            <div className="text-primary-400 font-medium">
              +10 XP
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(habit, e);
                }}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                title="Edit habit"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(habit, e);
                }}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors"
                title="Delete habit"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DraggableHabitList;
