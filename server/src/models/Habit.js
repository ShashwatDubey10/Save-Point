import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a habit title'],
    trim: true,
    maxlength: [100, 'Habit title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  category: {
    type: String,
    enum: ['health', 'fitness', 'productivity', 'mindfulness', 'learning', 'social', 'creative', 'other'],
    default: 'other'
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'custom'],
    default: 'daily'
  },
  schedule: {
    // For weekly: [0,1,2,3,4,5,6] where 0 is Sunday
    days: [{
      type: Number,
      min: 0,
      max: 6
    }],
    // For daily: time of day (optional)
    timeOfDay: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'anytime'],
      default: 'anytime'
    }
  },
  color: {
    type: String,
    default: '#8b5cf6' // Default purple
  },
  icon: {
    type: String,
    default: '🎯'
  },
  completions: [{
    date: {
      type: Date,
      required: true
    },
    note: {
      type: String,
      maxlength: 200
    },
    mood: {
      type: String,
      enum: ['great', 'good', 'okay', 'bad', 'terrible']
    }
  }],
  stats: {
    totalCompletions: {
      type: Number,
      default: 0
    },
    currentStreak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    },
    lastCompletedDate: {
      type: Date,
      default: null
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
habitSchema.index({ user: 1, isActive: 1 });
habitSchema.index({ user: 1, category: 1 });
habitSchema.index({ user: 1, order: 1 });

// Pre-save hook to ensure stats are initialized
habitSchema.pre('save', function(next) {
  if (!this.stats) {
    this.stats = {
      totalCompletions: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: null
    };
  }
  if (!this.completions) {
    this.completions = [];
  }
  next();
});

// Method to check if habit was completed today
habitSchema.methods.isCompletedToday = function() {
  if (this.completions.length === 0) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastCompletion = this.completions[this.completions.length - 1].date;
  const lastCompletionDate = new Date(lastCompletion);
  lastCompletionDate.setHours(0, 0, 0, 0);

  return lastCompletionDate.getTime() === today.getTime();
};

// Method to complete habit
habitSchema.methods.complete = function(note = '', mood = null) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if already completed today
  if (this.isCompletedToday()) {
    return false;
  }

  // Add completion
  this.completions.push({
    date: today,
    note,
    mood
  });

  // Update stats
  this.stats.totalCompletions += 1;
  this.stats.lastCompletedDate = today;

  // Update streak
  this.updateStreak();

  return true;
};

// Method to uncomplete habit (remove today's completion)
habitSchema.methods.uncomplete = function() {
  if (!this.isCompletedToday()) {
    return false;
  }

  // Remove last completion
  this.completions.pop();

  // Update stats
  this.stats.totalCompletions = Math.max(0, this.stats.totalCompletions - 1);

  // Recalculate streak
  this.recalculateStreak();

  return true;
};

// Helper to get YYYY-MM-DD string from a date (using local date components)
function getDateString(date) {
  if (!date) return null;
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Method to normalise a date input (string or Date) to a local midnight Date
function normaliseToLocalDate(targetDate) {
  if (!targetDate) return null;

  // If it's a string in YYYY-MM-DD format, parse as local date (not UTC)
  if (typeof targetDate === 'string') {
    const parts = targetDate.split('-');
    if (parts.length === 3) {
      const year = Number(parts[0]);
      const month = Number(parts[1]) - 1; // 0-based
      const day = Number(parts[2]);
      const d = new Date(year, month, day);
      d.setHours(0, 0, 0, 0);
      return d;
    }
  }

  // If it's already a Date, extract local date components and create new date
  if (targetDate instanceof Date) {
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    const day = targetDate.getDate();
    const d = new Date(year, month, day);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  // Fallback – let JS parse, then extract local components
  const d = new Date(targetDate);
  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate();
  const normalized = new Date(year, month, day);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

// Method to complete habit for a specific date
habitSchema.methods.completeForDate = function(targetDate, note = '', mood = null) {
  const date = normaliseToLocalDate(targetDate);
  if (!date || isNaN(date.getTime())) {
    return false;
  }

  // Check if habit was created after this date
  const habitCreatedDate = new Date(this.createdAt);
  habitCreatedDate.setHours(0, 0, 0, 0);
  if (habitCreatedDate > date) {
    return false; // Habit didn't exist on this date
  }

  // Check if already completed for this date
  // Compare by date string to avoid timezone issues
  const targetDateString = getDateString(date);
  const existingCompletion = this.completions.find(c => {
    const completionDateString = getDateString(c.date);
    return completionDateString === targetDateString;
  });

  if (existingCompletion) {
    return false; // Already completed for this date
  }

  // Add completion
  this.completions.push({
    date: date,
    note,
    mood
  });

  // Sort completions by date
  this.completions.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Update stats
  this.stats.totalCompletions += 1;
  if (!this.stats.lastCompletedDate || date > this.stats.lastCompletedDate) {
    this.stats.lastCompletedDate = date;
  }

  // Recalculate streak
  this.recalculateStreak();

  return true;
};

// Method to uncomplete habit for a specific date
habitSchema.methods.uncompleteForDate = function(targetDate) {
  const date = normaliseToLocalDate(targetDate);
  if (!date || isNaN(date.getTime())) {
    return false;
  }

  // Find and remove completion for this date
  // Compare by date string to avoid timezone issues
  const targetDateString = getDateString(date);
  const completionIndex = this.completions.findIndex(c => {
    const completionDateString = getDateString(c.date);
    return completionDateString === targetDateString;
  });

  if (completionIndex === -1) {
    return false; // Not completed for this date
  }

  // Remove completion
  this.completions.splice(completionIndex, 1);

  // Update stats
  this.stats.totalCompletions = Math.max(0, this.stats.totalCompletions - 1);

  // Recalculate streak
  this.recalculateStreak();

  return true;
};

// Method to update streak
habitSchema.methods.updateStreak = function() {
  if (this.completions.length === 0) {
    this.stats.currentStreak = 0;
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let checkDate = new Date(today);

  // Count consecutive days backwards
  for (let i = this.completions.length - 1; i >= 0; i--) {
    const completionDate = new Date(this.completions[i].date);
    completionDate.setHours(0, 0, 0, 0);

    if (completionDate.getTime() === checkDate.getTime()) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  this.stats.currentStreak = streak;

  // Update longest streak
  if (streak > this.stats.longestStreak) {
    this.stats.longestStreak = streak;
  }
};

// Method to recalculate all streaks
habitSchema.methods.recalculateStreak = function() {
  if (this.completions.length === 0) {
    this.stats.currentStreak = 0;
    this.stats.longestStreak = 0;
    return;
  }

  // Sort completions by date
  this.completions.sort((a, b) => a.date - b.date);

  let currentStreak = 1;
  let longestStreak = 1;

  for (let i = 1; i < this.completions.length; i++) {
    const prevDate = new Date(this.completions[i - 1].date);
    const currDate = new Date(this.completions[i].date);

    prevDate.setHours(0, 0, 0, 0);
    currDate.setHours(0, 0, 0, 0);

    const daysDiff = (currDate - prevDate) / (1000 * 60 * 60 * 24);

    if (daysDiff === 1) {
      currentStreak++;
    } else {
      longestStreak = Math.max(longestStreak, currentStreak);
      currentStreak = 1;
    }
  }

  longestStreak = Math.max(longestStreak, currentStreak);

  // Check if streak is current
  const lastCompletion = new Date(this.completions[this.completions.length - 1].date);
  lastCompletion.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (lastCompletion.getTime() === today.getTime() || lastCompletion.getTime() === yesterday.getTime()) {
    this.stats.currentStreak = currentStreak;
  } else {
    this.stats.currentStreak = 0;
  }

  this.stats.longestStreak = longestStreak;
};

const Habit = mongoose.model('Habit', habitSchema);

export default Habit;
