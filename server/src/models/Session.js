import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  habits: [{
    habit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Habit',
      required: true
    },
    completed: {
      type: Boolean,
      default: false
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
  notes: {
    type: String,
    maxlength: 1000,
    default: ''
  },
  mood: {
    type: String,
    enum: ['great', 'good', 'okay', 'bad', 'terrible'],
    default: null
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  autoSaveVersion: {
    type: Number,
    default: 1
  },
  publishedAt: {
    type: Date,
    default: null
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

// Indexes
sessionSchema.index({ user: 1, date: -1 });
sessionSchema.index({ user: 1, status: 1 });

// Method to publish session
sessionSchema.methods.publish = function() {
  if (this.status === 'draft') {
    this.status = 'published';
    this.publishedAt = new Date();
    return true;
  }
  return false;
};

const Session = mongoose.model('Session', sessionSchema);

export default Session;
