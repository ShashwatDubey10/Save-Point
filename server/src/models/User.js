import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password by default
  },
  gamification: {
    points: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 1
    },
    streak: {
      current: {
        type: Number,
        default: 0
      },
      longest: {
        type: Number,
        default: 0
      },
      lastCheckIn: {
        type: Date,
        default: null
      }
    },
    badges: [{
      id: String,
      name: String,
      description: String,
      icon: String,
      earnedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  profile: {
    avatar: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      maxlength: 500,
      default: ''
    },
    timezone: {
      type: String,
      default: 'UTC'
    }
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto', 'system'],
      default: 'dark'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    }
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

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to calculate level from points
userSchema.methods.calculateLevel = function() {
  // Level formula: Level = floor(sqrt(points / 100)) + 1
  // Level 1: 0-99 points
  // Level 2: 100-399 points
  // Level 3: 400-899 points, etc.
  this.gamification.level = Math.floor(Math.sqrt(this.gamification.points / 100)) + 1;
};

// Method to add points and update level
userSchema.methods.addPoints = function(points) {
  this.gamification.points += points;
  this.calculateLevel();
};

// Method to update streak
userSchema.methods.updateStreak = function() {
  const now = new Date();
  const lastCheckIn = this.gamification.streak.lastCheckIn;

  if (!lastCheckIn) {
    // First check-in
    this.gamification.streak.current = 1;
    this.gamification.streak.lastCheckIn = now;
  } else {
    const daysSinceLastCheckIn = Math.floor((now - lastCheckIn) / (1000 * 60 * 60 * 24));

    if (daysSinceLastCheckIn === 0) {
      // Same day, no change
      return;
    } else if (daysSinceLastCheckIn === 1) {
      // Consecutive day, increment streak
      this.gamification.streak.current += 1;
      this.gamification.streak.lastCheckIn = now;

      // Update longest streak if needed
      if (this.gamification.streak.current > this.gamification.streak.longest) {
        this.gamification.streak.longest = this.gamification.streak.current;
      }
    } else {
      // Streak broken, reset to 1
      this.gamification.streak.current = 1;
      this.gamification.streak.lastCheckIn = now;
    }
  }
};

// Method to award badge
userSchema.methods.awardBadge = function(badge) {
  const existingBadge = this.gamification.badges.find(b => b.id === badge.id);
  if (!existingBadge) {
    this.gamification.badges.push({
      ...badge,
      earnedAt: new Date()
    });
    return true;
  }
  return false;
};

const User = mongoose.model('User', userSchema);

export default User;
