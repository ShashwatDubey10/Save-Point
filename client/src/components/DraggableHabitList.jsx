import { useState, useRef, useCallback, useEffect } from "react";

// Individual Draggable Habit Card
const DraggableHabitCard = ({
  habit,
  index,
  onEdit,
  onDelete,
  onToggle,
  onDragStart,
  isCompletedToday,
  isDragging,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isLocalDragging, setIsLocalDragging] = useState(false);
  const touchStartPosRef = useRef(null);
  const isDraggingRef = useRef(false);
  const isPressedRef = useRef(false);
  const cardElementRef = useRef(null);

  // Handle drag handle press start (both mouse and touch)
  const handleDragHandleStart = (e, isTouchEvent) => {
    e.stopPropagation(); // Prevent card click handlers
    
    setIsPressed(true);
    isPressedRef.current = true;

    // Track initial touch position
    if (isTouchEvent && e.touches && e.touches.length > 0) {
      touchStartPosRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    } else {
      touchStartPosRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    }

    // For touch: activate drag immediately (no long press needed for handle)
    if (isTouchEvent) {
      // Store the event data
      const startEvent = {
        type: e.type || 'touchstart',
        touches: e.touches ? [{ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY }] : null,
        clientX: e.clientX,
        clientY: e.clientY,
      };
      
      // Start drag immediately for handle
      isDraggingRef.current = true;
      setIsLocalDragging(true);
      const syntheticEvent = {
        type: 'touchstart',
        touches: startEvent.touches ? [{ 
          clientX: startEvent.touches[0].clientX, 
          clientY: startEvent.touches[0].clientY 
        }] : [{ 
          clientX: touchStartPosRef.current.x, 
          clientY: touchStartPosRef.current.y 
        }],
        clientX: startEvent.touches ? startEvent.touches[0].clientX : (startEvent.clientX || touchStartPosRef.current.x),
        clientY: startEvent.touches ? startEvent.touches[0].clientY : (startEvent.clientY || touchStartPosRef.current.y),
      };
      onDragStart(habit, index, syntheticEvent);
    } else {
      // For mouse: activate immediately
      isDraggingRef.current = true;
      setIsLocalDragging(true);
      onDragStart(habit, index, e);
    }
  };

  // Handle drag handle move - only called when dragging from handle
  const handleDragHandleMove = (e) => {
    // If dragging is active, let document-level handlers take over
    if (isDraggingRef.current || isDragging) {
      return;
    }
  };

  // Handle drag handle end
  const handleDragHandleEnd = (e) => {
    e.stopPropagation();
    setIsPressed(false);
    isPressedRef.current = false;
    isDraggingRef.current = false;
    setIsLocalDragging(false);
    touchStartPosRef.current = null;
  };

  // Cancel drag handle interaction
  const handleDragHandleCancel = () => {
    setIsPressed(false);
    isPressedRef.current = false;
    isDraggingRef.current = false;
    setIsLocalDragging(false);
    touchStartPosRef.current = null;
  };

  // Sync local dragging state with parent's isDragging prop
  useEffect(() => {
    if (!isDragging) {
      setIsLocalDragging(false);
      isDraggingRef.current = false;
    }
  }, [isDragging]);

  const completed = isCompletedToday(habit);

  return (
    <div
      ref={cardElementRef}
      className={`glass rounded-xl p-4 flex items-center gap-4 transition-all select-none ${
        completed ? "border border-green-500/30" : ""
      } ${isDragging ? "opacity-40 scale-95" : ""} ${
        !isDragging ? "hover:bg-white/10" : ""
      }`}
      style={{
        touchAction: "pan-y", // Always allow vertical scrolling
      }}
      onClick={(e) => {
        // Don't toggle if clicking on drag handle, buttons, or checkbox
        if (
          e.target.closest(".drag-handle") ||
          e.target.closest("button") ||
          e.target.closest(".checkbox")
        ) {
          return;
        }
        // Toggle habit completion
        const completed = isCompletedToday(habit);
        onToggle(habit._id, completed);
      }}
    >
      {/* Drag Handle Indicator */}
      <div
        className="drag-handle flex flex-col gap-0.5 text-gray-600 cursor-grab active:cursor-grabbing touch-none"
        style={{
          touchAction: "none", // Prevent scrolling when touching handle
        }}
        // Mouse events for drag handle
        onMouseDown={(e) => handleDragHandleStart(e, false)}
        onMouseMove={handleDragHandleMove}
        onMouseUp={handleDragHandleEnd}
        onMouseLeave={handleDragHandleCancel}
        // Touch events for drag handle
        onTouchStart={(e) => handleDragHandleStart(e, true)}
        onTouchMove={handleDragHandleMove}
        onTouchEnd={handleDragHandleEnd}
        onTouchCancel={handleDragHandleCancel}
      >
        <div className="w-1 h-1 rounded-full bg-current"></div>
        <div className="w-1 h-1 rounded-full bg-current"></div>
        <div className="w-1 h-1 rounded-full bg-current"></div>
      </div>

      {/* Checkbox */}
      <div
        className={`checkbox w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer ${
          completed
            ? "bg-green-500 border-green-500"
            : "border-white/30 hover:border-primary-500"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onToggle(habit._id, completed);
        }}
      >
        {completed && (
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

      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">
        {habit.icon || "📌"}
      </div>

      {/* Info */}
      <div className="flex-1">
        <h3
          className={`font-medium transition-all ${
            completed ? "text-gray-400 line-through" : "text-white"
          }`}
        >
          {habit.title || habit.name}
        </h3>
        <p className="text-sm text-gray-500 capitalize">{habit.category}</p>
      </div>

      {/* Streak */}
      <div className="flex items-center gap-1 px-3 py-1 bg-white/5 rounded-lg">
        <span className="text-orange-400">🔥</span>
        <span className="text-white font-medium">
          {habit.stats?.currentStreak || 0}
        </span>
      </div>

      {/* XP */}
      <div className="text-primary-400 font-medium">+10 XP</div>

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
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
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
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Main Draggable Habit List Component
const DraggableHabitList = ({
  habits,
  onReorder,
  onToggle,
  onEdit,
  onDelete,
  isCompletedToday,
}) => {
  const [dragState, setDragState] = useState({
    isDragging: false,
    draggedHabit: null,
    draggedIndex: null,
    currentY: 0,
  });

  // Use refs to store data that event handlers need to access
  const dragDataRef = useRef({
    isDragging: false,
    draggedHabit: null,
    draggedIndex: null,
    currentY: 0,
    targetIndex: null,
  });

  const dragGhostRef = useRef(null);
  const itemRefs = useRef([]);

  // Handle drag start
  const handleDragStart = useCallback(
    (habit, index, e) => {
      const clientY = e.type.includes("touch")
        ? e.touches[0].clientY
        : e.clientY;

      // Update both state and ref
      const newDragData = {
        isDragging: true,
        draggedHabit: habit,
        draggedIndex: index,
        currentY: clientY,
        targetIndex: index,
      };

      dragDataRef.current = newDragData;
      setDragState(newDragData);

      // Define handlers as closures that access refs
      const handleMove = (e) => {
        if (!dragDataRef.current.isDragging) return;

        // Prevent scrolling on touch devices
        if (e.type.includes("touch")) {
          e.preventDefault();
        }

        const clientY = e.type.includes("touch")
          ? e.touches[0].clientY
          : e.clientY;

        // Calculate which position the item should be in
        let targetIndex = dragDataRef.current.draggedIndex;

        itemRefs.current.forEach((ref, i) => {
          if (i === dragDataRef.current.draggedIndex || !ref) return;

          const rect = ref.getBoundingClientRect();
          const itemMiddle = rect.top + rect.height / 2;

          if (clientY < itemMiddle && i < dragDataRef.current.draggedIndex) {
            targetIndex = i;
          } else if (
            clientY > itemMiddle &&
            i > dragDataRef.current.draggedIndex
          ) {
            targetIndex = i;
          }
        });

        // Update both ref and state
        dragDataRef.current = {
          ...dragDataRef.current,
          currentY: clientY,
          targetIndex,
        };

        setDragState({
          ...dragDataRef.current,
        });
      };

      const handleEnd = () => {
        // Remove event listeners
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleEnd);
        document.removeEventListener("touchmove", handleMove);
        document.removeEventListener("touchend", handleEnd);

        // Reorder habits if position changed
        const { draggedIndex, targetIndex } = dragDataRef.current;

        if (
          draggedIndex !== null &&
          targetIndex !== null &&
          draggedIndex !== targetIndex
        ) {
          const newHabits = [...habits];
          const [draggedHabit] = newHabits.splice(draggedIndex, 1);
          newHabits.splice(targetIndex, 0, draggedHabit);
          onReorder(newHabits);
        }

        // Reset state
        dragDataRef.current = {
          isDragging: false,
          draggedHabit: null,
          draggedIndex: null,
          currentY: 0,
          targetIndex: null,
        };

        setDragState({
          isDragging: false,
          draggedHabit: null,
          draggedIndex: null,
          currentY: 0,
        });
      };

      // Add event listeners
      if (e.type.includes("touch")) {
        document.addEventListener("touchmove", handleMove, { passive: false });
        document.addEventListener("touchend", handleEnd);
      } else {
        document.addEventListener("mousemove", handleMove);
        document.addEventListener("mouseup", handleEnd);
      }
    },
    [habits, onReorder]
  );

  // Calculate transform for shifting items
  const getTransform = (index) => {
    const { isDragging, draggedIndex, targetIndex } = dragState;

    if (!isDragging || draggedIndex === null || targetIndex === null) {
      return "translateY(0)";
    }

    // Don't transform the dragged item
    if (index === draggedIndex) {
      return "translateY(0)";
    }

    // Items between old and new position should shift
    if (draggedIndex < targetIndex) {
      // Dragging down
      if (index > draggedIndex && index <= targetIndex) {
        const itemHeight = itemRefs.current[draggedIndex]?.offsetHeight || 0;
        return `translateY(-${itemHeight + 12}px)`; // 12px is gap
      }
    } else if (draggedIndex > targetIndex) {
      // Dragging up
      if (index < draggedIndex && index >= targetIndex) {
        const itemHeight = itemRefs.current[draggedIndex]?.offsetHeight || 0;
        return `translateY(${itemHeight + 12}px)`; // 12px is gap
      }
    }

    return "translateY(0)";
  };

  return (
    <>
      <div className="space-y-3">
        {habits.map((habit, index) => (
          <div
            key={habit._id}
            ref={(el) => (itemRefs.current[index] = el)}
            style={{
              transform: getTransform(index),
              transition:
                dragState.isDragging && index !== dragState.draggedIndex
                  ? "transform 0.3s ease"
                  : "none",
            }}
          >
            <DraggableHabitCard
              habit={habit}
              index={index}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggle={onToggle}
              onDragStart={handleDragStart}
              isCompletedToday={isCompletedToday}
              isDragging={dragState.draggedIndex === index}
            />
          </div>
        ))}
      </div>

      {/* Drag Ghost - Follows cursor/finger */}
      {dragState.isDragging && dragState.draggedHabit && (
        <div
          ref={dragGhostRef}
          className="fixed pointer-events-none z-50"
          style={{
            left: "50%",
            top: dragState.currentY,
            transform: "translate(-50%, -50%) scale(1.05)",
            opacity: 0.9,
            width:
              itemRefs.current[dragState.draggedIndex]?.offsetWidth || "auto",
          }}
        >
          <div className="glass rounded-xl p-4 shadow-2xl ring-2 ring-primary-500 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">
              {dragState.draggedHabit.icon || "📌"}
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium">
                {dragState.draggedHabit.title || dragState.draggedHabit.name}
              </h3>
              <p className="text-sm text-gray-400 capitalize">
                {dragState.draggedHabit.category}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DraggableHabitList;
